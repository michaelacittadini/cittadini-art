#!/usr/bin/env node
// Enforces vMAJOR.MINOR.PATCH versioning for cittadini.art (see CHANGELOG.md / docs/VERSIONING.md).
//   node scripts/check-version.mjs            -> package.json version is X.Y.Z and CHANGELOG.md has "## vX.Y.Z"
//   node scripts/check-version.mjs --release  -> also: clean tree, HEAD tagged vX.Y.Z, tag pushed to origin
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const release = process.argv.includes('--release');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const v = pkg.version;
const fail = (m) => { console.error('version check FAILED: ' + m); process.exit(1); };
if (!/^\d+\.\d+\.\d+$/.test(v)) fail('package.json version "' + v + '" is not MAJOR.MINOR.PATCH');
const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
if (!new RegExp('^## v' + v.replace(/\./g, '\\.') + '(\\s|$)', 'm').test(changelog)) fail('CHANGELOG.md has no "## v' + v + '" entry');
if (release) {
  const sh = (c) => execSync(c, { encoding: 'utf8' }).trim();
  if (sh('git status --porcelain')) fail('working tree is not clean; commit first');
  const tag = 'v' + v;
  if (!sh('git tag --points-at HEAD').split('\n').includes(tag)) fail('HEAD is not tagged ' + tag + '. Run: npm run release -- patch|minor|major');
  const local = sh('git rev-parse refs/tags/' + tag);
  const remote = sh('git ls-remote --tags origin refs/tags/' + tag).split(/\s+/)[0];
  if (remote !== local) fail('tag ' + tag + ' is not pushed to origin. Run: git push origin main ' + tag);
}
console.log('version ok: v' + v + (release ? ' (HEAD tagged and pushed)' : ''));
