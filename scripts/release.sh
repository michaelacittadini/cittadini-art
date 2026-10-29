#!/usr/bin/env bash
# Cut a new cittadini.art version.  Usage: npm run release -- patch|minor|major
#   patch = fixes, wording, prices, photos, adding/removing an artwork
#   minor = new page or feature
#   major = Misha's official launch approval (v1.0.0), later a redesign or URL-breaking change
# Needs notes under "## Unreleased" in CHANGELOG.md. Bumps package.json, dates the CHANGELOG entry,
# commits "Release vX.Y.Z", creates annotated tag vX.Y.Z and pushes main + tag. Then: npm run publish
set -euo pipefail
cd "$(dirname "$0")/.."
LEVEL=${1:-}
case "$LEVEL" in patch|minor|major) ;; *) echo "usage: npm run release -- patch|minor|major"; exit 1;; esac
[ "$(git rev-parse --abbrev-ref HEAD)" = main ] || { echo "refusing: release from main only (merge the branch first)"; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "refusing: working tree not clean"; exit 1; }
git fetch -q origin main --tags
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo "refusing: main is not in sync with origin/main"; exit 1; }
CUR=$(node -p "require('./package.json').version")
NEXT=$(node -e '
const [a,b,c]=process.argv[1].split(".").map(Number); const l=process.argv[2];
console.log(l==="major"?`${a+1}.0.0`:l==="minor"?`${a}.${b+1}.0`:`${a}.${b}.${c+1}`);' "$CUR" "$LEVEL")
git rev-parse -q --verify "refs/tags/v$NEXT" >/dev/null && { echo "refusing: tag v$NEXT already exists"; exit 1; }
NOTES=$(awk '/^## Unreleased/{f=1;next} /^## /{f=0} f' CHANGELOG.md | grep -v '^[[:space:]]*$' || true)
[ -n "$NOTES" ] || { echo "refusing: add what changed under '## Unreleased' in CHANGELOG.md first"; exit 1; }
DATE=$(TZ=America/Los_Angeles date +%F)
node -e '
const fs=require("fs"); const [next,date]=process.argv.slice(1);
let t=fs.readFileSync("CHANGELOG.md","utf8");
t=t.replace(/^## Unreleased\s*$/m, "## Unreleased\n\n## v"+next+" — "+date);
fs.writeFileSync("CHANGELOG.md",t);' "$NEXT" "$DATE"
npm version "$NEXT" --no-git-tag-version >/dev/null
node scripts/check-version.mjs
git add CHANGELOG.md package.json package-lock.json
git commit -qm "Release v$NEXT"
git tag -a "v$NEXT" -m "cittadini.art v$NEXT ($DATE)"
git push -q origin main "v$NEXT"
echo "released v$NEXT (was v$CUR). Publish with: npm run publish"
