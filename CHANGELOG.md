# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Every change to cittadini.art gets a version number **vMAJOR.MINOR.PATCH** (for example v0.1.0).
The site footer shows the live version, every version is a git tag in this repo, and the publish
script refuses to put anything live unless it is a tagged, pushed version. See docs/VERSIONING.md.

- **PATCH** (v0.1.0 → v0.1.1): fixes, wording, prices, photos, adding or removing an artwork.
- **MINOR** (v0.1.1 → v0.2.0): a new page or feature (e.g. Buy buttons go live, newsletter sign-up).
- **MAJOR** (v0.x → v1.0.0): Misha approves the site as her official launch; later, a redesign or a change that breaks links.

## [Unreleased]

- Fragment of a Canyon marked sold (sold at The Big Open, Nov 14).

## [v0.4.6] - 2026-11-12
- Renamed What the Tide Remembers of Fire to Tide Remembers.

## [v0.4.5] - 2026-11-12
- Added What the Tide Remembers of Fire (Interference, 38 × 45 in, $3,500).
- Stripe scripts read STRIPE_API_KEY from ~/.openclaw/.env when it is not already set in the environment.
- CHANGELOG.md now uses Keep a Changelog headings ("## [vX.Y.Z] - YYYY-MM-DD"); release and version-check scripts updated to match.
## [v0.4.4] - 2026-11-12
- Buy buttons are live on the five available Fragments.

## [v0.4.3] - 2026-11-11
- Fragment of a Shell marked sold.

## [v0.4.2] - 2026-11-11
- Added the Fragments series (six 12 × 12 in works, $495, Buy buttons) and five new paintings: The Memory of Light, Deep Reverberation, Overtone, Silent Echo (Resonance) and Where Waves Meet (Interference).

## [v0.4.1] - 2026-11-05
- Renamed the fiber-optic series from Second Light to Secret Light.

## [v0.4.0] - 2026-11-02
- Buy buttons (Stripe) on works up to $1,500: US shipping $100 (up to $500) or $150 (up to $1,500) plus California sales tax at checkout. Larger paintings keep "Enquire".

## [v0.3.3] - 2026-11-02
- Moved one room photo from Summer Echo II to Summer Echo I, where it belongs.

## [v0.3.2] - 2026-11-02
- Room photos added for Subjective Topographies I & II and Kinetic Currents (Misha's own), plus room mockups for Warm Eclipse, The Space Between, Almost Visible and Aperture of Becoming.
- Misha's own room photos added for Summer Echo II and Soft Undertow.

## [v0.3.1] - 2026-11-02
- Add The Weight of Silence, Ember Frequency, Aperture of Becoming, and The Space Between to the artwork catalog.
- Misha's own interior photos added to the galleries of 12 paintings (Black Wave, Radiant Frequency, Where Light Gathers, Blue Emergence, Soft Undertow, Tidal Bloom, Still Point, The Weight of Silence, Ember Frequency, Deep Current, Undertow, Tidal Frequency).

## [v0.3.0] - 2026-11-01
- Artwork galleries: swipe between photos on phones, scroll with a trackpad, or use arrows, thumbnails and keyboard navigation; photo counters and reduced-motion support.

## [v0.2.11] - 2026-10-31
- About: Misha’s chosen portrait beside her biography, plus three studio and process photographs.
- Artwork pages: selectable photo galleries with captions distinguishing real photographs from interior mockups; reuse existing framed, studio and room images.

## [v0.2.10] - 2026-10-31
- Home: "Painting of the month" is now a caption right under the hero painting.

- Header: name is larger, with "Abstract painter, Sausalito, California" underneath on every page (removed from the home hero).

- Home page: removed the second "Misha Cittadini" under the hero painting (name stays in the header; kept for search engines only).

## [v0.2.9] - 2026-10-29
- Removed Soft Horizon I, Soft Horizon II, Wave of Blue and Orbital Resonance (Misha).

## [v0.2.8] - 2026-10-29
- Where Light Gathers: new unframed photos (unlit + lit).

## [v0.2.7] - 2026-10-29
- Works page: paintings grouped in the same order as the series (Resonance first, The Hours last).

## [v0.2.6] - 2026-10-29
- Exhibitions: AAU Spring Show 2026 now names the three works still on view at 601 Brannan St.

## [v0.2.5] - 2026-10-29
- Exhibitions: added The Big Open (Nov 2026) and NOSTALGIA at Mirus Gallery; Stockton (Haggin Museum) and David Sutherland Showroom now dated 2026 and listed at the top.

## [v0.2.4] - 2026-10-29
- Series in Misha's order everywhere: Resonance, Interference, Second Light, Trade Winds, Palm Trees, The Hours (Palm Trees back on the home page).

## [v0.2.3] - 2026-10-29
- Removed Commissions from the main menu (Misha).

## [v0.2.2] - 2026-10-29
- Neutral black and grey palette (no blue or orange accents).

## [v0.2.1] - 2026-10-29
- Home page: removed the Commissions button (Misha).

## [v0.2.0] - 2026-10-29
- New look: Fraunces + Instrument Sans fonts, indigo and flame-orange colours. Home page now shows a "Painting of the month" (set in src/data/hero.json) followed by a grid of five series (Resonance, Interference, Second Light, Trade Winds, The Hours; Palm Trees stays under All works). Added The Hours: ten 12 × 12 in works, $495 each, in hanging order. Artwork pages note free studio pickup; shipping quoted on enquiry. Cormorant Garamond for the name and headings; home page keeps the quiet layout (hero with name, series as text links, selected works).

## [v0.1.0] - 2026-10-29
- First versioned release of the site live at https://cittadini.art: 53 artworks, bio and statement, 22 exhibitions, CV, commissions.
- Stripe Payment Link sync, commission deposit/balance invoices and /thanks page (works show "Enquire" until Stripe keys exist).
- Version numbering: version shown in the footer, `npm run release`, and publish refuses untagged builds.
