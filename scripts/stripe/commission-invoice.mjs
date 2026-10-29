#!/usr/bin/env node
// Commission invoices (deposit, then balance) via Stripe Invoices.
//   STRIPE_API_KEY=... node scripts/stripe/commission-invoice.mjs --email buyer@x.com --name "Buyer Name" \
//      --title "Commission: 36x48 abstract, blues" --total 4800 --stage deposit [--deposit-pct 50] [--days 7] [--send] [--tax]
//   ... --stage balance  (bills total minus the deposit)
// Without --send the invoice is created as a DRAFT and its dashboard URL is printed: Misha/Mr K review, then re-run with
// --send or press Send in the dashboard. Stripe emails the client a hosted payment page (card / ACH).
import { stripe, mode } from './lib.mjs';
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) a[argv[i].slice(2)] = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
for (const k of ['email', 'name', 'title', 'total', 'stage']) if (!a[k]) { console.error('missing --' + k); process.exit(1); }
const total = Number(a.total); const pct = Number(a['deposit-pct'] || 50);
const deposit = Math.round(total * pct) / 100;
const amount = a.stage === 'deposit' ? deposit : total - deposit;
const label = a.stage === 'deposit' ? `${a.title} — ${pct}% deposit` : `${a.title} — balance due on completion`;
const found = (await stripe('GET', '/customers', { email: a.email, limit: 1 })).data[0];
const customer = found || await stripe('POST', '/customers', { email: a.email, name: a.name, metadata: { source: 'cittadini-art-commission' } });
const inv = await stripe('POST', '/invoices', {
  customer: customer.id, collection_method: 'send_invoice', days_until_due: Number(a.days || 7), auto_advance: false,
  automatic_tax: { enabled: Boolean(a.tax) }, description: 'Original commissioned painting by Misha Cittadini. ' + (a.stage === 'deposit' ? 'Deposit secures your studio slot; non-refundable once work begins.' : 'Final balance.'),
  metadata: { commission: a.title, stage: a.stage, total: String(total) },
});
await stripe('POST', '/invoiceitems', { customer: customer.id, invoice: inv.id, amount: Math.round(amount * 100), currency: 'usd', description: label, tax_code: 'txcd_99999999' });
if (a.send) {
  await stripe('POST', `/invoices/${inv.id}/finalize`);
  const sent = await stripe('POST', `/invoices/${inv.id}/send`);
  console.log(`[${mode}] SENT ${a.stage} $${amount} -> ${sent.hosted_invoice_url}`);
} else {
  console.log(`[${mode}] DRAFT ${a.stage} $${amount}: https://dashboard.stripe.com/${mode === 'test' ? 'test/' : ''}invoices/${inv.id}`);
}
