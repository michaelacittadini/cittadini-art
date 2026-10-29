// Fails the build if any artwork folder is malformed (missing index.md or images referenced but absent).
import fs from 'node:fs';
import path from 'node:path';
const base = 'src/content/artworks';
let bad = 0;
for (const d of fs.readdirSync(base)) {
  const dir = path.join(base, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  const md = path.join(dir, 'index.md');
  if (!fs.existsSync(md)) { console.error('missing', md); bad++; continue; }
  const text = fs.readFileSync(md, 'utf8');
  for (const m of text.matchAll(/\.\/([^'",\]\s]+\.(?:jpe?g|png|webp|avif))/gi)) {
    if (!fs.existsSync(path.join(dir, m[1]))) { console.error('missing image', path.join(dir, m[1])); bad++; }
    else if (fs.statSync(path.join(dir, m[1])).size > 8 * 1024 * 1024) { console.error('image over 8 MB (resize with scripts/add-artwork.mjs):', m[1]); bad++; }
  }
}
if (bad) process.exit(1);
console.log('content ok');
