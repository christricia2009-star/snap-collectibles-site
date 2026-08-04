# Snap Collectibles – Enhancement Summary (v1.2)

## Implemented vs commercial apps

### Scanning & Identification
- **Single-item AI** (OpenRouter / Gemini) from photo
- **Bulk shelf AI scan** – photograph a whole shelf; AI returns every visible item for multi-select add
- Barcode / UPC via ML Kit + CameraX
- Category hint improves bulk detection accuracy

### Valuation
- **Preferred market value**: eBay sold average → Amazon → manual estimate
- eBay low / high / sample count stored
- **Price cache**: batch re-value skips items valued in the last 24h (unless forced)
- **Batch re-value**: long-press to multi-select → refresh icon re-prices selected items via SoldComps + Rainforest

### Portfolio & Analytics
- Cost basis + unrealized P/L on Stats and Market Rate
- Preferred totals respect quantity
- Location breakdowns
- **Series completion %** – group by series; set Series Target on any item for progress bars
- Home-screen **widget** shows collection value + item count

### Data model (power collector)
- location, quantity, variant, seriesTarget
- Up to 3 photos per item (gallery on Detail)
- ebayLow / ebayHigh / ebaySampleCount
- price history JSON

### Export
- Insurance-ready CSV with preferred value, ROI, quantity, location, variant, eBay range
- Imports legacy and new formats

### Security & UX
- API keys only in SharedPreferences (never hardcoded)
- Multi-select move / delete / re-value
- Swipe actions, filters, sort
- Owned / Selling / Wishlist lists

### Version
- App version **1.2** (versionCode 3)
- Room DB **v6** (destructive migration on upgrade – export first)

## How to use new features
1. **Bulk shelf scan**: Home → Dashboard icon (or navigate Bulk Scan) → take photo → Detect → select items → Add
2. **Batch re-value**: Long-press items → select → tap Refresh in the top bar
3. **Series completion**: Home → Category icon → see progress; set “Series Target” on any item in a series
4. **Widget**: Long-press home screen → Widgets → Snap Collectibles → Collection Value
5. **API keys**: Settings (OpenRouter for AI, SoldComps for eBay, Rainforest for Amazon)

## Still future ideas
- On-device object detection model (no API) for bulk scan
- Force re-value toggle + progress UI polish
- Live Activities / richer widgets
- Full Funko catalog series targets preloaded
