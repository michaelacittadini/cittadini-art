import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per artwork: src/content/artworks/<slug>/index.md + its photos (<slug>-1.jpg ...).
const artworks = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/artworks', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int().optional(),
      medium: z.string().optional(),
      dimensions: z.string().optional(),
      widthIn: z.number().optional(),
      heightIn: z.number().optional(),
      series: z.string().optional(),
      status: z.enum(['available', 'sold', 'nfs', 'commission', 'unknown']).default('unknown'),
      price: z.number().nullable().optional(),
      images: z.array(image()).min(1),
      alt: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      instagram: z.string().optional(),
    }),
});

const exhibitions = defineCollection({
  loader: file('src/data/exhibitions.json'),
  schema: z.object({
    id: z.string(),
    year: z.number().int(),
    title: z.string(),
    venue: z.string().optional(),
    city: z.string().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
  }),
});

export const collections = { artworks, exhibitions };
