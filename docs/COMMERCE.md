# Selling: Stripe (Misha's existing account), Prodigi, newsletter

All accounts are Misha's own. Secrets never go in this repo.

## Stripe — originals (Payment Links)
- Key: a **restricted** key (rk_test_… / rk_live_…) from Misha's Stripe account with write access to Products, Prices, Payment Links, Checkout Sessions, Invoices, Invoice items, Customers, Tax (and read on Tax settings). Stored only in 1Password vault **Mr Klepitko**, items "Stripe - Misha - restricted key (test)" and "Stripe - Misha - restricted key (live)", and optionally as STRIPE_API_KEY in ~/.openclaw/.env on oc-misha.
- The site is static and never needs the key: Payment Links are public URLs. `npm run stripe:sync` creates/updates one Product + Price + Payment Link per artwork with `status: available` and a `price`, limited to one completed sale (originals are unique), collects shipping address and phone, redirects to /thanks/. It writes the public URLs to `src/data/stripe-links.json`; artwork pages then show **Buy original** instead of **Enquire**.
- Only `mode: live` links appear on the production site. Test-mode links show only in a build with PUBLIC_STRIPE_TEST=1.
- Mark a work `status: sold` (or remove the price) and re-run sync: its link is deactivated and the button reverts to Enquire. A completed Stripe sale also stops the link automatically (limit 1); then set `status: sold` and sync + publish.
- Price change: edit `price`, re-run sync (new Price, old archived, new link).

```sh
# test first, always
STRIPE_API_KEY=$(op-misha read "op://Mr Klepitko/Stripe - Misha - restricted key (test)/credential") npm run stripe:sync
PUBLIC_STRIPE_TEST=1 npm run build && npm run preview   # click Buy, pay with 4242 4242 4242 4242, check /thanks/ + Stripe test dashboard
# then live
STRIPE_API_KEY=$(op-misha read "op://Mr Klepitko/Stripe - Misha - restricted key (live)/credential") npm run stripe:sync
git add src/data/stripe-links.json && git commit -m "Stripe links" && npm run publish
```

## Stripe — commissions (Invoices with deposit)
```sh
npm run stripe:invoice -- --email client@example.com --name "Client Name" --title "Commission: 36x48 in, blues" --total 4800 --stage deposit            # draft, 50% deposit
npm run stripe:invoice -- ... --stage deposit --send        # finalize + Stripe emails the client a pay page
npm run stripe:invoice -- ... --stage balance --send        # on completion: total minus deposit
```
Agree price and deposit with Misha before sending anything; drafts are safe to create.

## Stripe Tax
Turn on only after Misha has entered her tax registrations (California seller's permit, origin address) in Stripe → Tax → Registrations. Then run sync with `--tax` and pass `--tax` to invoices.

## Not set up yet (Misha's own accounts needed)
| Need | Provider | Plug-in point |
| --- | --- | --- |
| Prints | Prodigi | `commerce.printsEnabled` + print links per artwork (future field) |
| Newsletter | Buttondown / Mailchimp / Kit | `newsletter.formAction` in `src/site.config.ts` |

Forbidden for agents: changing Stripe payout/bank settings, account identity or business details, refunds, moving money.
