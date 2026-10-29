#!/usr/bin/env bash
# Interim publish to GitHub Pages (branch gh-pages of michaelacittadini/cittadini-art) -> https://preview.cittadini.art
# Used ONLY until Cloudflare Pages is connected to this repo (then every push to main deploys automatically
# and this script is retired). Run from a clean checkout of main after the PR is merged.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL=$(git remote get-url origin)
case "$REMOTE_URL" in *github.com/michaelacittadini/*) ;; *) echo "refusing: origin is not michaelacittadini ($REMOTE_URL)"; exit 1;; esac
SITE_URL=${SITE_URL:-https://preview.cittadini.art} PUBLIC_PREVIEW=${PUBLIC_PREVIEW:-1} npm run build
node scripts/check-content.mjs
touch dist/.nojekyll
echo "${PAGES_CNAME:-preview.cittadini.art}" > dist/CNAME
TMP=$(mktemp -d); cp -r dist/. "$TMP"/
cd "$TMP"; git init -q -b gh-pages
git config user.name "Mr. Klepitko"; git config user.email "misha@cittadini.art"
git add -A; git commit -qm "Publish $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$REMOTE_URL" gh-pages
echo "published to gh-pages -> https://${PAGES_CNAME:-preview.cittadini.art}"
