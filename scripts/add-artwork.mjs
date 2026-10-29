#!/usr/bin/env node
// Add (or update) an artwork from one or more photos + details.
// Usage:
//   node scripts/add-artwork.mjs --title "Blue Hour" --year 2025 --medium "Oil on canvas" \
//     --dimensions "24 x 30 in" --width 24 --height 30 --series "Coastal" --status available --price 2400 \
//     --description "Short text about the piece." photo1.jpg [photo2.jpg ...]
// Photos are resized to max 3000px long edge (JPEG q88) and stored next to the content file.
// The site build makes all smaller sizes/WebP automatically.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const opts = {}; const photos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) opts[args[i].slice(2)] = args[++i]; else photos.push(args[i]);
}
if (!opts.title || photos.length === 0) { console.error('need --title and at least one photo'); process.exit(1); }
const slug = opts.slug || opts.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const dir = path.join('src/content/artworks', slug);
fs.mkdirSync(dir, { recursive: true });
const images = [];
for (const [i, p] of photos.entries()) {
  const name = `${slug}-${i + 1}.jpg`;
  await sharp(p).rotate().resize({ width: 3000, height: 3000, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(dir, name));
  images.push(`./${name}`);
}
const q = (s) => JSON.stringify(s);
const fm = ['---', `title: ${q(opts.title)}`];
if (opts.year) fm.push(`year: ${Number(opts.year)}`);
if (opts.medium) fm.push(`medium: ${q(opts.medium)}`);
if (opts.dimensions) fm.push(`dimensions: ${q(opts.dimensions)}`);
if (opts.width) fm.push(`widthIn: ${Number(opts.width)}`);
if (opts.height) fm.push(`heightIn: ${Number(opts.height)}`);
if (opts.series) fm.push(`series: ${q(opts.series)}`);
fm.push(`status: ${opts.status || 'unknown'}`);
if (opts.price) fm.push(`price: ${Number(opts.price)}`);
fm.push(`images: [${images.map(q).join(', ')}]`);
if (opts.alt) fm.push(`alt: ${q(opts.alt)}`);
if (opts.featured) fm.push('featured: true');
if (opts.instagram) fm.push(`instagram: ${q(opts.instagram)}`);
fm.push('---', '', opts.description || '', '');
fs.writeFileSync(path.join(dir, 'index.md'), fm.join('\n'));
console.log(`wrote ${dir}/index.md with ${images.length} image(s)`);
