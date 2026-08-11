# Snap Collectibles — Landing Page

Modern, high-converting single-page marketing site for the **Snap Collectibles** iOS app (public name for Collection Vault).

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

### Marketing alignment (B15 / v2.3)

Marketing copy tracks the latest Collection Vault / Snap Collectibles build (**tagline: Scan · Catalog · Trade**, app version **2.3.0**). Highlight shipping capabilities without inventing metrics or guaranteed valuations:

- **Smarter scan** — category-first ID, barcode, scan review with rarity signals, packaging cues, sold ranges, deal scores, coach Q&A, duplicate warnings
- **Portfolio home** — value ranges, unrealized P/L, 7d movers, health, grails, favorites, goals, activity, backup status
- **Hunter Mode** — shelf price → buy/pass deal scores; hunt sessions, trip edge, walk-away ledger
- **Pricing intelligence** — sold comps / multi-market helpers, confidence, forecasts, defensive value, fee-aware flip calculator, quiet refresh
- **Tools hub** — vault search, smart collections, goals, portfolio mix, compare, offline queue, series tracker, selling helpers, exports, show/booth, insurance inventory, print checklist
- **Vault DNA & Collector Academy** — hunter style profile and field guides
- **Selling** — listed/sold with fees & P/L, tax CSV, where-to-list helpers
- **Trades** — offers, inventory pick, feed, chat, matches, fair equity, checklist, contact helpers
- **Account / safety** — Sign in with Apple, iCloud backup & restore, Events, messages, app lock, block/report
- **Widgets** — portfolio Home Screen snapshot (when widget target is installed)

Avoid single-brand positioning (e.g. Funko-only). Do not invent pricing or guaranteed valuations. Market values are **estimates from comps — not appraisals**.

### Source of truth for copy

When the iOS archive advances past the last site sync, diff against:

- `Models/Theme.swift` → `AppIdentity` (name, tagline, version, disclaimer)
- `Models/EventModels.swift` → `WhatsNew.items`
- `Views/HomeView.swift`, `Views/MoreView.swift`, `Views/Advanced/AdvancedFeatureViews.swift` (Tools hub)
- Level10 / Moat / Level20 hubs for Hunter Mode, portfolio tools, hunt intelligence

## Build

```bash
npm run build
npm start
```
