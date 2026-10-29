#!/usr/bin/env bash
# Interim publish to GitHub Pages (branch gh-pages of michaelacittadini/cittadini-art) -> https://cittadini.art (production)
# Used ONLY until Cloudflare Pages is connected to this repo (then every push to main deploys automatically
# and this script is retired). Run from a clean checkout of main after the PR is merged.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL=$(git remote get-url origin)
case "$REMOTE_URL" in *github.com/michaelacittadini/*) ;; *) echo "refusing: origin is not michaelacittadini ($REMOTE_URL)"; exit 1;; esac
node scripts/check-version.mjs --release
VERSION=v$(node -p "require('./package.json').version")
SHA=$(git rev-parse --short HEAD)
SITE_URL=${SITE_URL:-https://cittadini.art} PUBLIC_PREVIEW=${PUBLIC_PREVIEW:-0} npm run build
node scripts/check-content.mjs
touch dist/.nojekyll
echo "${PAGES_CNAME:-cittadini.art}" > dist/CNAME
TMP=$(mktemp -d); cp -r dist/. "$TMP"/
cd "$TMP"; git init -q -b gh-pages
git config user.name "Mr. Klepitko"; git config user.email "misha@cittadini.art"
git add -A; git commit -qm "Publish $VERSION ($SHA) $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$REMOTE_URL" gh-pages
echo "published $VERSION to gh-pages -> https://${PAGES_CNAME:-cittadini.art}"
