# cittadini.art — rules for agents (Mr K)

This repo is the ONLY place Misha's website lives. Owner: GitHub **michaelacittadini** (Misha). Never use, push to, or create anything under davidcittadini for this site.

- Stack: Astro (static), content collections, sharp image pipeline, @astrojs/sitemap.
- Add an artwork: `node scripts/add-artwork.mjs --title ... photo.jpg` (see docs/ADDING-ARTWORK.md), then `npm run build` must pass.
- Flow: branch -> PR -> check the preview -> merge to main -> auto-deploy. Never hand-upload files to a server, never make ad-hoc preview sites.
- Site-wide settings (email, Instagram, Stripe links, newsletter form): `src/site.config.ts` only.
- Do not commit secrets. Commerce accounts (Stripe, Prodigi, newsletter) must be Misha's own; see docs/COMMERCE.md.
