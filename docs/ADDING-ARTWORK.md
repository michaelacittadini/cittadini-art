# Adding or updating an artwork

1. Get the photo(s) (best: straight-on, even light, cropped to the canvas edge) and details: title, year, medium, size, series, availability, price.
2. On a new branch:
   ```sh
   git switch -c add-<slug>
   node scripts/add-artwork.mjs --title "Title" --year 2025 --medium "Oil on canvas" --dimensions "24 x 30 in" \
     --width 24 --height 30 --series "Series name" --status available --price 2400 \
     --description "One or two sentences in Misha's voice." photo.jpg
   npm run build
   ```
3. Commit, push, open a PR. Check the preview (Cloudflare preview URL on the PR, or `npm run preview` locally).
4. Show Misha the preview if the text is new; merge to `main` to publish.

Updating: edit `src/content/artworks/<slug>/index.md` (e.g. `status: sold`). Removing: delete the folder.
Status values: available, sold, nfs (not for sale), commission, unknown.
`featured: true` puts a work on the home page (first featured = hero).

## Images
- Store at most 3000px long edge in the repo (the script does this). The build generates all smaller sizes and modern formats.
- Full-resolution originals (print files) are NOT committed. Once Cloudflare R2 is enabled in Misha's Cloudflare account, keep them in bucket `cittadini-art-originals`; until then keep them in Misha's Google Drive / Mr K workspace `art/originals/`.
