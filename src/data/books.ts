import type { ImageMetadata } from 'astro';
import artist from '../assets/books/wild-waves-artist-edition.jpg';
import simple from '../assets/books/wild-waves-simple.jpg';
import boldEasy from '../assets/books/wild-waves-bold-easy.jpg';

export interface Book { title: string; subtitle: string; ages: string; pages: number; description: string; cover: ImageMetadata; amazon: string }

// Amazon links from Misha (KDP), 2026-11-16. Prices live on Amazon only.
export const books: Book[] = [
  {
    title: 'Wild Waves: The Artist Edition',
    subtitle: 'My First Abstract Art Adventure',
    ages: '4–10', pages: 28,
    description: 'Ten original paintings, each paired with a coloring page that finds a sea animal hidden in the brushstrokes, plus three artist-inspiration pages.',
    cover: artist,
    amazon: 'https://www.amazon.com/dp/B0HGWL9WBV',
  },
  {
    title: 'Wild Waves',
    subtitle: 'A Simple Sea-Animal Coloring Book',
    ages: '3–6', pages: 24,
    description: 'Whales, turtles, octopuses and dolphins hidden in flowing lines inspired by my paintings. Bold outlines, from easy to more detailed.',
    cover: simple,
    amazon: 'https://www.amazon.com/dp/B0HGTMY73R',
  },
  {
    title: 'Wild Waves',
    subtitle: 'Bold & Easy Ocean Animals',
    ages: '3–6', pages: 24,
    description: 'Friendly sea animals with strong outlines and big spaces to color, printed single-sided for little hands.',
    cover: boldEasy,
    amazon: 'https://www.amazon.com/dp/B0HGWGP6S7',
  },
];
