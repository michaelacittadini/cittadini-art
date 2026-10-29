import { getCollection, type CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artworks'>;

export async function allWorks(): Promise<Artwork[]> {
  const works = await getCollection('artworks');
  return works.sort((a, b) => (b.data.order - a.data.order) || ((b.data.year ?? 0) - (a.data.year ?? 0)) || a.data.title.localeCompare(b.data.title));
}

export function slugify(s: string) {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function seriesList() {
  const works = await allWorks();
  const map = new Map<string, Artwork[]>();
  for (const w of works) if (w.data.series) map.set(w.data.series, [...(map.get(w.data.series) ?? []), w]);
  return [...map.entries()].map(([name, items]) => ({ name, slug: slugify(name), items }));
}

export const statusLabel: Record<string, string> = { available: 'Available', sold: 'Sold', nfs: 'Not for sale', commission: 'Commission', unknown: '' };

export function formatPrice(p?: number | null) {
  return typeof p === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p) : '';
}
