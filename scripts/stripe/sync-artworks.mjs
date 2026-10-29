#!/usr/bin/env node
// Sync artworks -> Stripe Products/Prices/Payment Links, write public link map to src/data/stripe-links.json.
//   STRIPE_API_KEY=rk_test_... node scripts/stripe/sync-artworks.mjs [--dry-run] [--tax]
// - Only works with status: available AND a price get a Payment Link (limit 1 completed sale: originals are unique).
// - sold / nfs / no price -> existing link is deactivated and removed from the map.
// - Price change -> new Price, old one archived, link recreated.
// - --tax turns on Stripe Tax (automatic_tax) on links; only use once Misha's tax registrations exist in Stripe.
// Products are matched by metadata.slug, so re-running is safe (idempotent).
import fs from 'node:fs';
import path from 'node:path';
import { stripe, mode } from './lib.mjs';

const DRY = process.argv.includes('--dry-run');
const TAX = process.argv.includes('--tax');
const SITE = process.env.SITE_URL || 'https://cittadini.art';
const base = 'src/content/artworks';
const out = 'src/data/stripe-links.json';

function fm(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/); const o = {};
  if (!m) return o;
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':'); if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (/^".*"$/.test(v)) v = JSON.parse(v); else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    o[line.slice(0, i).trim()] = v;
  }
  return o;
}

const works = fs.readdirSync(base).filter((d) => fs.existsSync(path.join(base, d, 'index.md')))
  .map((slug) => ({ slug, ...fm(fs.readFileSync(path.join(base, slug, 'index.md'), 'utf8')) }));
const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : { links: {} };
const links = {};
console.log(`mode=${mode} works=${works.length} dry=${DRY} tax=${TAX}`);

async function findProduct(slug) {
  const r = await stripe('GET', '/products/search', { query: `metadata['slug']:'${slug}'`, limit: 1 });
  return r.data[0];
}

for (const w of works) {
  const sellable = w.status === 'available' && typeof w.price === 'number' && w.price > 0;
  const cents = sellable ? Math.round(w.price * 100) : 0;
  if (DRY) { if (sellable) console.log(`would sell ${w.slug} $${w.price}`); continue; }
  let product = await findProduct(w.slug);
  if (!sellable) {
    if (product) {
      const pl = await stripe('GET', '/payment_links', { active: true, limit: 100 });
      for (const l of pl.data.filter((l) => l.metadata?.slug === w.slug)) await stripe('POST', `/payment_links/${l.id}`, { active: false });
      if (product.active && w.status === 'sold') await stripe('POST', `/products/${product.id}`, { active: false });
      console.log(`unlisted ${w.slug} (${w.status})`);
    }
    continue;
  }
  const desc = [w.year, w.medium, w.dimensions].filter(Boolean).join(' · ') + ' — original artwork by Misha Cittadini';
  const productParams = { name: w.title, description: desc, url: `${SITE}/works/${w.slug}/`, tax_code: 'txcd_99999999', shippable: true, metadata: { slug: w.slug, source: 'cittadini-art' } };
  if (!product) product = await stripe('POST', '/products', { ...productParams, default_price_data: { currency: 'usd', unit_amount: cents, tax_behavior: 'exclusive' } });
  else await stripe('POST', `/products/${product.id}`, { ...productParams, active: true });
  product = await stripe('GET', `/products/${product.id}`);
  let priceId = product.default_price;
  const price = priceId ? await stripe('GET', `/prices/${priceId}`) : null;
  let priceChanged = false;
  if (!price || price.unit_amount !== cents) {
    const np = await stripe('POST', '/prices', { product: product.id, currency: 'usd', unit_amount: cents, tax_behavior: 'exclusive' });
    await stripe('POST', `/products/${product.id}`, { default_price: np.id });
    if (price) await stripe('POST', `/prices/${price.id}`, { active: false });
    priceId = np.id; priceChanged = true;
  }
  const existing = (await stripe('GET', '/payment_links', { active: true, limit: 100 })).data.find((l) => l.metadata?.slug === w.slug);
  let link = existing;
  if (existing && (priceChanged || Boolean(existing.automatic_tax?.enabled) !== TAX)) { await stripe('POST', `/payment_links/${existing.id}`, { active: false }); link = null; }
  if (!link) {
    link = await stripe('POST', '/payment_links', {
      line_items: { 0: { price: priceId, quantity: 1 } },
      restrictions: { completed_sessions: { limit: 1 } },
      shipping_address_collection: { allowed_countries: { 0: 'US', 1: 'CA', 2: 'GB', 3: 'AU', 4: 'NZ', 5: 'CZ', 6: 'DE', 7: 'FR', 8: 'IT', 9: 'NL' } },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: TAX },
      after_completion: { type: 'redirect', redirect: { url: `${SITE}/thanks/?work=${w.slug}` } },
      metadata: { slug: w.slug },
    });
  }
  links[w.slug] = link.url;
  console.log(`${w.slug}: $${w.price} -> ${link.url}`);
}
if (!DRY) {
  fs.writeFileSync(out, JSON.stringify({ mode, updated: new Date().toISOString(), links }, null, 2) + '\n');
  console.log(`wrote ${out} (${Object.keys(links).length} links, previously ${Object.keys(prev.links || {}).length})`);
}
