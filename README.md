# cittadini.art

Website for artist Misha (Michaela) Cittadini. Astro static site; content is plain files so Mr K (her assistant agent) can add work from a photo and a few details.

- `src/content/artworks/<slug>/index.md` + photos — one folder per artwork
- `src/content/pages/about.md`, `commissions.md` — page text
- `src/data/exhibitions.json` — exhibition history
- `src/site.config.ts` — email, Instagram, Stripe payment links, newsletter form

```sh
npm ci
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into dist/
```

Deploy: GitHub Actions (`.github/workflows/deploy.yml`). Every push to `main` deploys. With the `CLOUDFLARE_API_TOKEN` secret + `CLOUDFLARE_ACCOUNT_ID` variable set (and repo variable `HOST=cloudflare`), it deploys to Cloudflare Pages project `cittadini-art` and every PR gets its own preview URL; otherwise it deploys to GitHub Pages.

See docs/ADDING-ARTWORK.md and docs/COMMERCE.md.
