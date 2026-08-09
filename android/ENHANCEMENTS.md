# Snap Collectibles Android — Enhancements (v1.1)

This release turns Snap Collectibles into a **power-user portfolio tool** for multi-category collectibles — beyond barcode-only trackers and estimate-only AI scanners.

## What was added

### 1. Data model (Room v5)
New / ensured fields on `Collectible`:
- `location`, `quantity` (default 1), `variant`
- `photoUri2`, `photoUri3`
- `ebayLow`, `ebayHigh`, `ebaySampleCount`
- `seriesTarget`

Computed helpers (not columns):
- **preferredValue** — eBay sold avg → Amazon → manual estimate  
- **unrealizedGain** — `(preferred − purchase) × quantity`  
- **hasRoiData**, **allPhotos**, **isFreshlyValued(24h)**, **portfolioValue**

**Migration:** Room uses `fallbackToDestructiveMigration()`. **Export CSV before upgrading** if you need to keep local data.

### 2. Valuation intelligence
- Preferred market value used in lists, stats, cards, home total, export.
- eBay sold comps (SoldComps API) store avg + low + high + sample count.
- Amazon via Rainforest when barcode/ASIN/UPC is present.
- Price history JSON appends on successful lookups.
- **24h cache** — skip re-valuation unless `force=true`.
- **Batch re-value** — selected IDs or whole collection; ~400ms between calls; Room updated after each success; progress UI.

### 3. Scanning & identification
- Single-item AI identify + barcode scan (unchanged flow).
- **Bulk Shelf Scan** (new):
  1. Open **Bulk Scan** (dashboard icon on Home top bar).
  2. Optional category hint (figures, cards, etc.).
  3. Take or pick one shelf/group photo (downscaled before AI).
  4. Review multi-select results; choose Owned / Selling / Wishlist.
  5. Add selected in one batch; duplicates by name skipped/flagged.

### 4. Collection management at scale
- Search / filter / sort (value sorts use **preferredValue**).
- Multi-select: move lists, delete, **batch re-value (Refresh icon)**.
- Location, quantity, variant, series target on Add/Edit + Detail.
- **Series Completion** screen: group Owned+Selling by series; progress when `seriesTarget > 0`.
- Multi-photo on Detail (all non-blank photo URIs).

### 5. Portfolio / analytics
- Stats + Market Rate: total preferred value × quantity, cost basis, unrealized P/L, eBay vs Amazon coverage, top categories, location breakdown.
- Home value card: preferred × quantity.
- Cards show preferred value and quantity when > 1.

### 6. Export / import
CSV includes preferred value, unrealized gain, quantity, location, variant, eBay low/high/sample, series target, photo URIs.  
Import accepts **legacy** and **new** column layouts. Share via FileProvider.

### 7. Home-screen widget
Add **“Collection Value”** widget: market value + piece count.  
Refreshes when collection data changes (snapshot in SharedPreferences).

### 8. Security & settings
- **No hardcoded API keys** in source. Keys only in SharedPreferences.
- Settings: masked fields, test buttons, save, market rate, batch re-value all, CSV import/export, insurance tip.
- Empty keys → clear Toasts.

### 9. Navigation
Routes: Home, Add, Edit, Detail, Settings, Scan, Stats, MarketRate, **Series**, **BulkScan**.  
Home top bar: Stats, Series, Bulk Scan, Sort, Export, Settings.

### 10. Versioning
- `versionName` **1.1**, `versionCode` **2**
- Room DB **version 5**

---

## How to use key features

### Bulk Shelf Scan
Home → **Dashboard** icon → category hint → photo → **Detect Items with AI** → multi-select → list → **Add Selected**.  
Requires OpenRouter key in Settings.

### Batch re-value
1. **Selected:** long-press items → **Refresh** icon (forces re-value).  
2. **Whole collection:** Market Rate or Settings → batch re-value (respects 24h cache).  
Requires SoldComps and/or Rainforest keys.

### Series completion
Home → **Category** icon. Set **Series** + optional **Series Target** on items when editing. Progress bars appear when target > 0.

### Widget
Long-press home screen → Widgets → Snap Collectibles → Collection Value.

### Insurance export
Settings or Home share → CSV with market values, locations, quantities for your agent.

---

## Differentiation vs typical apps

| Capability | Typical apps | Snap Collectibles |
|---|---|---|
| Scan | Barcode only or single AI guess | Barcode + single AI + **bulk shelf AI** |
| Value | Manual or one estimate | **eBay sold + Amazon + preferred hierarchy + history** |
| Scale | Per-item | Multi-select, batch re-value, locations, qty, variants |
| Portfolio | Count / sum | Cost basis, P/L, coverage, categories, locations, widget |
| Export | Basic CSV | Insurance-ready preferred + gain fields |
| Privacy | Often cloud-first | Local Room DB; keys on-device only |

---

## Setup checklist
1. Settings → enter OpenRouter, SoldComps, Rainforest keys → Save → Test.  
2. Export existing data before any future schema upgrade.  
3. Scan or Bulk Scan to add items; Detail → price buttons for live comps.  
4. Optional: long-press multi-select → batch re-value; add widget.
