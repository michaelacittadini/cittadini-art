#!/usr/bin/env node
// Studio-pickup Payment Links (Misha 2026-11-14): same artworks as the online links in
// src/data/stripe-links.json, but no shipping and a fixed 9.25% CA sales tax (Sausalito, Marin)
// included in the price. Payment Links can't apply a fixed tax rate and Stripe Tax would use the
// buyer's home address, so the pickup Price is tax-inclusive and tagged metadata kind=pickup,
// tax_rate=0.0925; scripts/stripe-qbo-sync.py splits the tax back out when booking to QuickBooks.
//   node --env-file=/home/openclaw/.openclaw/.env scripts/stripe/sync-pickup-links.mjs [--dry-run]
// Run after sync-artworks.mjs. Idempotent. Also: if either link of a work has sold, the other is
// deactivated (prevents selling the same original twice) and the slug is reported as SOLD.
import fs from 'node:fs';
import { stripe, mode } from './lib.mjs';

const DRY = process.argv.includes('--dry-run');
const RATE = 0.0925;
const SITE = process.env.SITE_URL || 'https://cittadini.art';
const out = 'src/data/stripe-links.json';
const data = JSON.parse(fs.readFileSync(out, 'utf8'));
const online = data.links || {};
const pickup = {};
const sold = [];

const all = [];
for (let starting_after; ;) {
  const r = await stripe('GET', '/payment_links', { limit: 100, ...(starting_after ? { starting_after } : {}) });
  all.push(...r.data);
  if (!r.has_more) break;
  starting_after = r.data[r.data.length - 1].id;
}
const sessionsUsed = (l) => l.restrictions?.completed_sessions?.count || 0;
const deactivate = async (l) => { if (l.active && !DRY) await stripe('POST', `/payment_links/${l.id}`, { active: false }); };

// Sold check across both kinds of link.
const bySlug = {};
for (const l of all) { const s = l.metadata?.slug; if (s) (bySlug[s] ||= []).push(l); }
for (const [slug, ls] of Object.entries(bySlug)) {
  const soldLink = ls.find((l) => sessionsUsed(l) > 0);
  if (!soldLink) continue;
  const others = ls.filter((l) => l !== soldLink && l.active);
  if (online[slug] || others.length) { sold.push(slug); for (const l of others) await deactivate(l); }
}

console.log(`mode=${mode} online=${Object.keys(online).length} dry=${DRY}`);
for (const slug of Object.keys(online)) {
  if (sold.includes(slug)) continue;
  const product = (await stripe('GET', '/products/search', { query: `metadata['slug']:'${slug}'`, limit: 1 })).data[0];
  if (!product?.default_price) { console.log(`skip ${slug}: no product/price`); continue; }
  const base = await stripe('GET', `/prices/${product.default_price}`);
  const gross = Math.round(base.unit_amount * (1 + RATE));
  const mine = (bySlug[slug] || []).filter((l) => l.metadata?.kind === 'pickup' && l.active);
  const keep = mine.find((l) => l.metadata?.gross === String(gross));
  for (const l of mine) if (l !== keep) await deactivate(l);
  if (keep) { pickup[slug] = keep.url; continue; }
  if (DRY) { console.log(`would create pickup ${slug} $${(gross / 100).toFixed(2)}`); continue; }
  const prices = await stripe('GET', '/prices', { product: product.id, active: true, limit: 100 });
  let price = prices.data.find((p) => p.metadata?.kind === 'pickup' && p.unit_amount === gross);
  if (!price) price = await stripe('POST', '/prices', {
    product: product.id, currency: 'usd', unit_amount: gross, tax_behavior: 'inclusive',
    nickname: 'Studio pickup, incl. 9.25% CA sales tax',
    metadata: { kind: 'pickup', tax_rate: String(RATE), slug },
  });
  const link = await stripe('POST', '/payment_links', {
    line_items: { 0: { price: price.id, quantity: 1 } },
    restrictions: { completed_sessions: { limit: 1 } },
    phone_number_collection: { enabled: true },
    automatic_tax: { enabled: false },
    custom_text: { submit: { message: 'Studio pickup at Studio 107, ICB Building, 480 Gate 5 Rd, Sausalito. Price includes 9.25% California sales tax. No shipping.' } },
    after_completion: { type: 'redirect', redirect: { url: `${SITE}/thanks/?work=${slug}` } },
    metadata: { slug, kind: 'pickup', gross: String(gross) },
  });
  pickup[slug] = link.url;
  console.log(`${slug}: pickup $${(gross / 100).toFixed(2)} -> ${link.url}`);
}
if (sold.length) console.log('SOLD (mark status: sold, then run sync-artworks):', sold.join(', '));
if (!DRY) {
  data.pickup = pickup;
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
  console.log(`wrote ${out} (${Object.keys(pickup).length} pickup links)`);
}
