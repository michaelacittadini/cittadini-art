# Versioning (vMAJOR.MINOR.PATCH)

Rule: nothing goes live on cittadini.art without a version number.

1. Work on a branch, build, show Misha the preview, merge to main on her OK.
2. While working, add a plain-English line under `## Unreleased` in CHANGELOG.md.
3. `npm run release -- patch` (or `minor` / `major`, see CHANGELOG.md for which). This bumps
   package.json, dates the CHANGELOG entry, commits "Release vX.Y.Z", tags vX.Y.Z and pushes both.
4. `npm run publish`. It runs `scripts/check-version.mjs --release` first and refuses unless HEAD is
   the pushed tag vX.Y.Z with a matching CHANGELOG entry and a clean tree. The gh-pages commit is
   "Publish vX.Y.Z (<sha>)" and the footer shows vX.Y.Z.
5. Tell Misha: "cittadini.art is now on vX.Y.Z: <what changed>".

Never move, delete or reuse a tag. To undo, release a new patch that reverts the change.
v1.0.0 is reserved for Misha's explicit approval of the site as her official launch.
