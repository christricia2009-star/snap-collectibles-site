# Snap Collectibles — Landing Page

Modern, high-converting single-page marketing site for the **Snap Collectibles** iOS app.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** v4
- **Motion** (`motion/react`) for animations

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    layout.tsx      # Root layout, fonts, metadata
    page.tsx        # Composes all landing sections
    globals.css     # Design tokens + utilities
  components/
    Header.tsx
    Hero.tsx
    Features.tsx
    Gallery.tsx
    HowItWorks.tsx
    Stats.tsx
    FAQ.tsx
    FinalCTA.tsx
    Footer.tsx
    AppStoreButton.tsx
    PhoneMockup.tsx
    SectionHeading.tsx
```

## Customizing

| What | Where |
|------|--------|
| TestFlight / testing email | `src/lib/testing.ts` |
| Screenshot paths | `src/lib/screenshots.ts` + `/public/screenshots/` |
| App Store URL (when live) | `AppStoreButton.tsx` → `APP_STORE_URL` + set `disabled={false}` |
| Feature copy | `Features.tsx` → `features` array |
| FAQ content | `FAQ.tsx` → `faqs` array |
| Stats numbers | `Stats.tsx` → `stats` array |
| Support email / privacy | `Footer.tsx` |
| Brand colors | `globals.css` → `@theme` tokens |

### App status

The app is **coming to the App Store**; private testing may be available. Primary CTAs email `Testing@snapcollectibles.com` (prefilled request). The App Store badge is shown disabled as “Coming to the App Store.”

Marketing copy is brand-neutral and category-first (aligned to the latest Collection Vault / Snap Collectibles build): pick a category then scan, sold comps / price helpers, inventory with list + grid + category filters, My Shelf, wishlist, selling/sold, Sign in with Apple, trades (offers, inventory pick, feed, chat, contact helpers), swipe actions, cloud backup while signed in, and More (stats / trade history). Avoid single-brand positioning (e.g. Funko-only). Do not invent pricing or guaranteed valuations.

## Build

```bash
npm run build
npm start
```
