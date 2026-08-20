# Snap Collectibles — Landing Page

Marketing site for **Snap Collectibles** (public name for Collection Vault). Layout and design language match BassheadOS: dark bay, display type, device frames, and an on-page beta form.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** v4
- BassheadOS design system in `src/app/globals.css`

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
| Beta inbox / FormSubmit | `src/lib/testing.ts` (`BETA_INBOX`, `BETA_ENDPOINT`) |
| Android Play test URL | `src/lib/testing.ts` (`ANDROID_TEST_URL`) |
| Screenshot paths | `src/lib/screenshots.ts` + `/public/screenshots/` |
| Feature copy | `Features.tsx`, `ProductSections.tsx` |
| FAQ content | `FAQ.tsx` → `faqs` array |
| Support email / privacy | `Footer.tsx`, `/privacy`, `/support` |
| Brand colors | `globals.css` → `:root` tokens |

### App status

iOS and Android are **in closed beta**. The form posts App name (`Snap Collectibles`), phone OS, and email to [FormSubmit](https://formsubmit.co) → **admin@snapcollectibles.com**.

Android submissions show the Play internal-test URL on-screen. Testers must copy/keep it and acknowledge before continuing. The URL is active once the email is added to the tester list — allow up to a few hours. Google does not auto-send tester emails.

The first live submission to a new inbox sends a FormSubmit confirmation. Click it once so later requests land automatically. If the service is blocked, the page falls back to a `mailto:` draft (iOS immediately; Android only after the URL is on-screen).

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
