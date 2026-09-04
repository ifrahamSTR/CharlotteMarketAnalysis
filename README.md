# Charlotte, NC STR buy-box presentation webpage

Plain HTML/CSS/JS, no build step, no framework. Run locally with any static
server, e.g. `python3 -m http.server 8000` from this directory, then open
`index.html`. It will not work correctly from `file://` because of the JSON
`fetch()` call in `map.js`.

This site is a direct clone of the Shenandoah Valley reference site
(rafidislam07.github.io/shenandoah) — same architecture (`data.js` →
`render.js`/`charts.js`/`map.js` → `main.js`), same `ddBlock`/photo-figure/
lightbox component patterns, same CSS design tokens and two responsive
breakpoints (960px/600px), same brand palette (deep forest green + amber).
Per the request that created this page, it is the **same template with
different analysis results**, not a redesign — see "Code changes from the
reference site" below for the functional edits made.

## Status (as of the region-based pivot)

- **Buy-box structure is region-first, not bedroom-count-first.** The site
  originally organized around 3BR/4BR/5BR+ (plus a bonus, amenity-defined
  Lake box), with 5BR+ fully built out as a deep dive. The team then adopted
  a teammate's (Walid's) independent geography-based classification of the
  same 719 listings — **Downtown / Uptown**, **Outskirts**, **Lakeside** —
  and pivoted the buy-box structure to match it. The old 5BR+ deep dive has
  been **retired from this page** (its notebook,
  `../notebooks/charlotte_5br_plus_buybox.ipynb`, and its assets under
  `assets/5br/`, still exist on disk but are no longer referenced by
  `data.js` — kept, not deleted, in case any of that analysis is reused
  later).
- **All three current buy boxes — Downtown / Uptown, Outskirts, Lake — are
  named and scoped, not yet built out.** Each has a real N and a real Top
  10% hit rate (market-wide $78,801 threshold applied within the region, not
  a threshold recomputed inside it), sourced from
  `../notebooks/charlotte_overview.ipynb`'s region-based buy-box
  segmentation. None has a full deep dive (comp sets, revenue tiering,
  amenity evidence, buy-box template) yet — map and structure came first, per
  the team's explicit call, with deep dives deferred to a later pass. They
  render as "pending" tabs using the template's native pending-state
  handling (`box.status !== "developed"` in `render.js`) — no placeholder
  data is invented for them.
- **Lake was promoted from a thin "bonus" segment to a core buy box.** The
  original amenity-flag-only definition (`HAS_waterfront`/`HAS_lake_access`)
  covered just N=27 market-wide, too thin to underwrite on its own. Walid's
  Lakeside region (a geography, not an amenity flag) covers N=39 — 20 of
  those listings have neither flag set — which resolved the sample-size
  objection and is why Lake now sits alongside Downtown/Uptown and Outskirts
  as a core box rather than a cross-cutting bonus.
- **Curated property photography, design comps, and acquisition-candidate
  screening are deferred for all three buy boxes**, same as before the
  pivot — no stock photos or invented images anywhere on this page.

## Code changes from the reference site

The reference site's `render.js`/`map.js` hardcode `", VA "` as the state
suffix on every comp/listing location string, and `map.js`'s Section-3 map
interpretation sentence hardcodes three Shenandoah Valley town names
(Rileyville, Stanley, Shenandoah). Both are load-bearing bugs for any other
state/market, so:

- `MAP_CONFIG.stateAbbr` (`"NC"`) was added in `data.js`, and every
  hardcoded `", VA "` in `render.js`/`map.js` was replaced with
  `", " + MAP_CONFIG.stateAbbr + " "`.
- `MAP_CONFIG.marketInterpretation` was added in `data.js` (the actual
  Charlotte map-caption sentence).
- `renderDeclarations()`/`renderDeepDiveTabs()` in `render.js` both assumed
  `BUY_BOXES[0]` was always the "developed" entry (true for the reference
  site, where every buy box was developed) — hardcoding "— Developed" on
  every declaration card and defaulting tab-bar highlighting to index 0.
  Both functions now check `box.status` / compute the actual default box
  instead of assuming index 0. This matters even more now than when it was
  first fixed — **all three current buy boxes are pending**, so this logic
  falls back to `BUY_BOXES[0]` (Downtown / Uptown) as the default tab, and
  does so correctly.
- **Section 3's map was swapped out entirely**, twice. First, the
  reference site's native Leaflet market-wide tier map (`js/map.js`'s
  `initMap()`, reading `data/listings.json`) was replaced with an
  `<iframe>` embed of `assets/overview/charlotte_overview_map.html` — a
  folium map built in `charlotte_overview.ipynb`. That map originally split
  only the Top 10% into four KMeans-derived micro-clusters (Uptown/NoDa/
  South End, Steele Creek/Lake Wylie, Ballantyne/Matthews/SouthPark, East
  Charlotte/Mint Hill); it was then rebuilt again to plot **all 719
  listings** on **two independent toggle axes** — revenue tier (Top 10% /
  Top 25% / Other 75%) and Walid's region classification (Downtown/Uptown,
  Outskirts, Lakeside) — once the team adopted the region-based buy-box
  structure. The two axes are independent overlays, not a combined filter:
  each listing is plotted once per axis (twice total), sharing the same
  tier-based color/size styling, so an overlapping pair reads as one marker
  when both relevant layers are visible. `js/map.js`'s `initMap()` is
  consequently unused (the `#leaflet-map` container it targets no longer
  exists in `index.html`, so it now no-ops) — kept in place rather than
  deleted, in case a native filterable map is wanted again later (see "How
  to extend"). A small function, `renderLocationInterpretation()` in
  `render.js`, prints `MAP_CONFIG.marketInterpretation` plus
  `MAP_CONFIG.regionBullets` (renamed from `clusterBullets` when the map
  pivoted to regions) under the embedded map; it's called from `main.js` in
  place of the old `initMap()` call.

No other line of `render.js`, `map.js`, `charts.js`, `main.js`, or
`css/styles.css` was touched beyond the above (one added `.embedded-map--tall`
CSS rule for the taller Section-3 iframe) — everything else is a byte-for-byte
copy of the reference site's files. `js/render.js`'s `fourBrCompMapBlock()`/
`oneTwoBrCompMapBlock()` and `js/map.js`'s corresponding init/cleanup
functions are Shenandoah-specific (4BR/1-2BR embedded Leaflet comp maps) and
are unused dead code here — none of the three current buy boxes reference
those section keys.

## Content style: compact, bulleted narrative fields

Every narrative string in `data.js` (thesis, `whyItWorks`, `recommended`,
`caution`, etc.) is rendered via `innerHTML`, not `textContent`. Write
narrative fields as a short lead-in sentence (if any) plus a tight 2-4 item
bullet list (bold lead-ins via `<strong>`, an emoji accent per item where it
adds scannability), not a wall of text — see `MARKET_OVERVIEW.paragraphs`'s
third paragraph and `MAP_CONFIG.regionBullets` for the current examples.
**This is the template going forward** for any narrative field, including
whichever buy box gets a full deep dive first.

## Architecture

- **`js/data.js`** — the only place content lives: the three current buy
  boxes' scoping notes (all pending — see Status above), the market-wide
  revenue distribution histogram, demographics, and map config. Nothing else
  in the codebase hardcodes content. A developed buy box would declare its
  own ordered `buyBoxSections` array (a list of section keys) — see
  `js/render.js`'s `NARRATIVE_BLOCKS` dispatch table for what each key
  renders — but none of the three current entries do, since none are
  developed yet.
- **`js/render.js`** — presentation logic; builds every DOM component from
  `data.js` via a generic `ddBlock` helper plus a small set of `*Block`
  builders, dispatched through `NARRATIVE_BLOCKS` in `renderDeepDive`
  according to each box's own `buyBoxSections` order (unknown/absent keys are
  skipped silently). A box with `status !== "developed"` renders its
  `pendingNote` instead of a deep dive — currently true for all three boxes.
- **`js/charts.js`** — Chart.js: the market-wide Revenue Potential histogram
  (colored by revenue-tier band) and the two Section-4 demographics charts
  (review-composition pie + by-bedroom stacked bar).
- **`js/map.js`** — Leaflet/OpenStreetMap map reading `data/listings.json`,
  filterable by revenue tier (top10/top25/bottom75, market-wide), plus a
  ZIP-area overlay toggle (approximate centroid+radius circles, same
  documented limitation as the reference site — see below). **Currently
  unused** on this page — Section 3 embeds `charlotte_overview_map.html`
  instead (see "Code changes from the reference site" above) — kept working
  and in place as a documented fallback/extension point, not deleted.
- **`js/main.js`** — bootstraps everything on `DOMContentLoaded`; nav
  scroll-spy; lightbox open/close wiring. Unmodified from the reference site.
- **`css/styles.css`** — the whole design system. Unmodified from the
  reference site.
- **`data/listings.json`** — generated by `scripts/generate_webpage_map_data.py`
  from `Charlotte NC - Market Eval - FINAL.xlsx`; safe to re-run, do not
  hand-edit. Includes a `zipApprox` array (see ZIP overlay note below) and an
  `isLake` flag per listing (amenity-flag-based, not the same as Walid's
  Lakeside region — not read by the currently-unused `map.js` yet).
- **`assets/overview/charlotte_overview_map.html`** — the live Section 3
  map, generated by `charlotte_overview.ipynb`. Regenerate by re-running
  that notebook and copying its output here (see "How to extend").
- **`assets/5br/`** — the real matplotlib charts and folium map generated
  for the now-retired 5BR+ deep dive. **Orphaned, not deleted** — nothing in
  `data.js` references this directory anymore.

## ZIP overlay — documented integration point

Exact ZIP (ZCTA) boundary GeoJSON is not in this repo. `map.js`'s
`drawZipOverlay()` first tries to fetch `data/zip-boundaries.geojson`; if
that file doesn't exist (the current state), it falls back to drawing subtle
dashed circles at each ZIP's centroid (computed from that ZIP's own listing
coordinates in `scripts/generate_webpage_map_data.py`, stored as `zipApprox`
in `listings.json`), each labeled with its ZIP code — an approximation, not
an authoritative ZCTA boundary. This is only relevant if `map.js`'s native
Leaflet map is ever brought back into use (see "How to extend") — it plays
no role in the currently-embedded folium map. To upgrade to real boundary
lines, drop a standard ZCTA GeoJSON at `data/zip-boundaries.geojson`
covering these 24 ZIPs; no other code changes are needed.

## Revenue distribution plot

`REVENUE_DISTRIBUTION` in `data.js` is a 20-bin histogram of
`Charlotte NC - Market Eval - FINAL.xlsx`'s `Revenue Potential` field across
all 719 listings (all bedroom counts, all regions), with P75 ($52,526,
top-25% threshold) and P90 ($78,801, top-10% threshold) computed directly
from the data — see `scripts/generate_webpage_map_data.py` for the exact
percentile method (pandas `.quantile()`, linear interpolation). There is no
per-region or per-bedroom breakout field on this chart (an earlier version
had a `bedroom4` field holding 5BR+-subset figures for a since-removed
comparison sentence in `charts.js` — removed when the 5BR+ deep dive was
retired).

## How to extend

- **Regenerate the Section 3 map** (region classification or tier
  thresholds changed): re-run `../notebooks/charlotte_overview.ipynb`
  end-to-end, then `cp ../notebooks/charlotte_overview_map.html
  assets/overview/charlotte_overview_map.html`.
- **Develop the Downtown / Uptown, Outskirts, or Lake buy box**: replace its
  stub entry in `BUY_BOXES` (`js/data.js`) with a full spec following the
  fuller section vocabulary already wired up in `render.js`'s
  `NARRATIVE_BLOCKS` (`overview`, `performanceContext`, `acquisitionSpec`,
  `locationGuidance`, `geoConsiderations`, `travelerICP`,
  `mustHaveAmenities`, `revenueTiers`, `analystNotes`, `acquisition`, etc. —
  see the retired 5BR+ entry in git history for a fully worked example of
  every section), set `status: "developed"`, and remove its entry from
  `PENDING_BUY_BOXES`. Give it its own deep-dive notebook first (none of the
  three currently has one — the old bedroom-count stub notebooks
  `charlotte_3br_buybox.ipynb`/`charlotte_4br_buybox.ipynb` no longer
  correspond to any current buy box).
- **Add a new photo**: drop the file under
  `assets/<buy-box-id>/<category>/`, then reference it via
  `photo(relPath, alt, caption)` in `data.js`.
- **Regenerate `data/listings.json`**: `python3
  scripts/generate_webpage_map_data.py` from this directory whenever the
  underlying workbook changes. This file is not currently used by the live
  page (see `js/map.js` above) but is kept working for the native-map
  fallback path.

## What NOT to assume

- No build/bundle/minify step, no package manager.
- `data/listings.json` is machine-generated; don't hand-edit it.
- The ZIP-area circles on the (currently unused) native map are an
  approximation, not real ZCTA boundaries — see the ZIP overlay note above.
- No STR regulation, permit, or HOA figures are shown for any buy box
  because none have been researched yet.
- **Region classification (Downtown/Outskirts/Lakeside) comes from a
  teammate's workbook (`Charlotte NC - Market Eval - Walid.xlsx` →
  `Cleaned_Data_With_Region`), joined onto `Charlotte NC - Market Eval -
  FINAL.xlsx` by Property ID** (verified 719/719 exact match, zero revenue
  mismatches). The classification itself is stored as static values in that
  workbook, not a documented formula or live Excel formula — the boundaries
  are finer than ZIP-code (7 ZIP codes each span two or three regions), so
  treat the exact rule as opaque provenance, not something this codebase can
  independently regenerate, until confirmed directly.
- **Outskirts is intentionally the coarsest of the three regions** — it
  spans everything from close-in SouthPark-adjacent ZIPs to far exurbs
  (2.5–14 miles from Uptown) and likely hides real internal variation (see
  `charlotte_overview.ipynb`'s "Tying It Together" section, which flags this
  explicitly). Don't present its stats as a locationally uniform submarket.
- The market-wide thresholds used throughout ($78,801 / $52,526) are
  deliberately the whole market's, not recomputed within any one region —
  see each buy box's `pendingNote` for why that distinction matters here.
- `assets/5br/` and `../notebooks/charlotte_5br_plus_buybox.ipynb` are
  orphaned (retired from the site, not deleted) — don't assume anything
  under `assets/5br/` is still live content.
