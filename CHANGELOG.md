# Changelog

Every change to cittadini.art gets a version number **vMAJOR.MINOR.PATCH** (for example v0.1.0).
The site footer shows the live version, every version is a git tag in this repo, and the publish
script refuses to put anything live unless it is a tagged, pushed version. See docs/VERSIONING.md.

- **PATCH** (v0.1.0 → v0.1.1): fixes, wording, prices, photos, adding or removing an artwork.
- **MINOR** (v0.1.1 → v0.2.0): a new page or feature (e.g. Buy buttons go live, newsletter sign-up).
- **MAJOR** (v0.x → v1.0.0): Misha approves the site as her official launch; later, a redesign or a change that breaks links.

## Unreleased

- Series in Misha's order everywhere: Resonance, Interference, Second Light, Trade Winds, Palm Trees, The Hours (Palm Trees back on the home page).

## v0.2.3 — 2026-10-29
- Removed Commissions from the main menu (Misha).

## v0.2.2 — 2026-10-29
- Neutral black and grey palette (no blue or orange accents).

## v0.2.1 — 2026-10-29
- Home page: removed the Commissions button (Misha).

## v0.2.0 — 2026-10-29
- New look: Fraunces + Instrument Sans fonts, indigo and flame-orange colours. Home page now shows a "Painting of the month" (set in src/data/hero.json) followed by a grid of five series (Resonance, Interference, Second Light, Trade Winds, The Hours; Palm Trees stays under All works). Added The Hours: ten 12 × 12 in works, $495 each, in hanging order. Artwork pages note free studio pickup; shipping quoted on enquiry. Cormorant Garamond for the name and headings; home page keeps the quiet layout (hero with name, series as text links, selected works).

## v0.1.0 — 2026-10-29
- First versioned release of the site live at https://cittadini.art: 53 artworks, bio and statement, 22 exhibitions, CV, commissions.
- Stripe Payment Link sync, commission deposit/balance invoices and /thanks page (works show "Enquire" until Stripe keys exist).
- Version numbering: version shown in the footer, `npm run release`, and publish refuses untagged builds.
