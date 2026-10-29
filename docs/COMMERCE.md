# Selling: what plugs in where

All accounts must be in Misha's own name (her identity, tax info and bank). Nothing here is active yet.

| Need | Provider | What to put in the site |
| --- | --- | --- |
| Buy an original / commission deposit | Stripe Payment Links (Stripe Tax on) | `src/site.config.ts` → `commerce.stripePaymentLinks['<slug>'] = 'https://buy.stripe.com/...'`. Works without a link show "Enquire". |
| Prints | Prodigi (connected to Stripe or via its own checkout) | set `commerce.printsEnabled = true` and add print links per artwork (future field). |
| Newsletter | Buttondown / Mailchimp / Kit | `newsletter.formAction` = the provider's form POST URL. |
| Sales tax | Stripe Tax (confirm her California seller's permit with her accountant) | Turn on in Stripe dashboard. |
