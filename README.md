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
reference site" below for the only two functional edits made.

## Status

- **5BR+ buy box: fully developed.** Source of truth:
  `../notebooks/charlotte_5br_plus_buybox.ipynb` (the deep dive built for
  this buy box) and `../notebooks/charlotte_overview.ipynb` (market-wide
  framing, revenue thresholds, and the buy-box segmentation decision). Every
  comp's Property ID, revenue, ADR, occupancy, city, and ZIP was pulled
  directly from `Charlotte NC - Market Eval - FINAL.xlsx`.
- **3BR, 4BR, and the bonus Lake buy box: named and scoped, not yet built
  out.** Each is named in `charlotte_overview.ipynb`'s buy-box segmentation
  with a real N and Top-10%-hit-rate figure, and each has its own stub
  notebook (`../notebooks/charlotte_3br_buybox.ipynb`,
  `charlotte_4br_buybox.ipynb`, `charlotte_lake_buybox.ipynb`) — but no
  deep-dive analysis (comp-set definition, revenue tiering, amenity evidence,
  geography, buy-box template) has been built for them yet. They render as
  "pending" tabs on this page using the template's native pending-state
  handling (`box.status !== "developed"` in `render.js`'s `renderDeepDive`) —
  no placeholder data is invented for them.
- **Curated property photography, design comps, and acquisition-candidate
  screening are deferred for all four buy boxes** — the "image-based visual
  analysis" the request explicitly said to placeholder for later. Every image
  slot on this page is either a real generated analysis chart (`photo()`,
  copied from the 5BR+ deep-dive notebook's own matplotlib output) or an
  honest photo-pending card (`pendingPhoto()`) linking straight to the real
  Airbnb listing — never a stock photo or an invented image.

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
  Charlotte cluster sentence).
- `renderDeclarations()`/`renderDeepDiveTabs()` in `render.js` both assumed
  `BUY_BOXES[0]` was always the "developed" entry (true for the reference
  site, where every buy box was developed) — hardcoding "— Developed" on
  every declaration card and defaulting tab-bar highlighting to index 0.
  Once Charlotte had pending boxes ordered before its one developed box,
  this became a real, visible bug (the active tab and the content shown
  disagreed). Both functions now check `box.status` / compute the actual
  default box instead of assuming index 0.
- **Section 3's map was swapped out entirely.** The reference site's native
  Leaflet market-wide tier map (`js/map.js`'s `initMap()`, reading
  `data/listings.json`) has been replaced with an `<iframe>` embed of
  `assets/overview/charlotte_overview_map.html` — the market-wide cluster +
  landmark map already built in `charlotte_overview.ipynb` (Top 10% split
  into 4 named clusters, plus toggleable Airport/Banking/Sports landmark
  layers). It's a strictly richer map for the same market-wide purpose, and
  it's real, already-verified content rather than something built fresh for
  the page. `js/map.js`'s `initMap()` is consequently unused (the `#leaflet-
  map` container it targets no longer exists in `index.html`, so it now
  no-ops) — kept in place rather than deleted, in case a native filterable
  map is wanted again later (see "How to extend"). A new tiny function,
  `renderLocationInterpretation()` in `render.js`, prints
  `MAP_CONFIG.marketInterpretation` under the embedded map; it's called from
  `main.js` in place of the old `initMap()` call.

No other line of `render.js`, `map.js`, `charts.js`, `main.js`, or
`css/styles.css` was touched beyond the above (one added `.embedded-map--tall`
CSS rule for the taller Section-3 iframe) — everything else is a byte-for-byte
copy of the reference site's files. `js/render.js`'s `fourBrCompMapBlock()`/
`oneTwoBrCompMapBlock()` and `js/map.js`'s corresponding init/cleanup
functions are Shenandoah-specific (4BR/1-2BR embedded Leaflet comp maps) and
are unused dead code here — the 5BR+ deep dive embeds its own standalone
map instead (see below), so nothing in `buyBoxSections` references those
section keys.

## Content style: compact, bulleted narrative fields

Every narrative string in `data.js` (thesis, `whyItWorks`, `recommended`,
`caution`, etc.) is rendered via `innerHTML`, not `textContent` — this was
already true in the reference site, just not used for anything beyond plain
paragraphs there. The 5BR+ buy box's `overview.whyItWorks`,
`locationGuidance.recommended`/`caution`, and `travelerICP.secondary` fields
embed real `<ul><li>` HTML directly in the string (bold lead-ins via
`<strong>`, a medal emoji per cluster rank in `recommended`) instead of one
dense paragraph each — no `render.js` change was needed for this, it's a
content-only pattern. **This is the template going forward**: when 3BR/4BR/
Lake get built out, write their Overview/Location/Traveler narrative fields
the same way — a short lead-in sentence (if any) plus a tight 2-4 item
bullet list, not a wall of text.

## Architecture

- **`js/data.js`** — the only place content lives: the 5BR+ buy box's full
  spec, the three pending buy boxes' scoping notes, the market-wide revenue
  distribution histogram, demographics, and map config. Nothing else in the
  codebase hardcodes content. Each `BUY_BOXES` entry declares its own ordered
  `buyBoxSections` array (a list of section keys) — see `js/render.js`'s
  `NARRATIVE_BLOCKS` dispatch table for what each key renders.
- **`js/render.js`** — presentation logic; builds every DOM component from
  `data.js` via a generic `ddBlock` helper plus a small set of `*Block`
  builders, dispatched through `NARRATIVE_BLOCKS` in `renderDeepDive`
  according to each box's own `buyBoxSections` order (unknown/absent keys are
  skipped silently). A box with `status !== "developed"` renders its
  `pendingNote` instead of a deep dive.
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
  `isLake` flag per listing (not read by `map.js` yet, kept for a future
  Lake-buy-box-specific map).
- **`assets/5br/charts/`** — the three real matplotlib charts generated for
  the 5BR+ deep dive (`03_capacity.png`, `04_amenity_prevalence.png`,
  `05_amenity_ranking.png`), copied as-is from
  `../notebooks/5br_deep_dive/`.
- **`assets/5br/charlotte_5br_interactive_map.html`** — the standalone
  folium map generated by the 5BR+ deep-dive notebook, embedded in-page via
  `locationGuidance.interactiveMapUrl` (an `<iframe>`, the same pattern the
  reference site uses for its 3BR comp-set map). This is a real, already-
  built interactive map — not a placeholder.

## ZIP overlay — documented integration point

Exact ZIP (ZCTA) boundary GeoJSON is not in this repo. `map.js`'s
`drawZipOverlay()` first tries to fetch `data/zip-boundaries.geojson`; if
that file doesn't exist (the current state), it falls back to drawing subtle
dashed circles at each ZIP's centroid (computed from that ZIP's own listing
coordinates in `scripts/generate_webpage_map_data.py`, stored as `zipApprox`
in `listings.json`), each labeled with its ZIP code — an approximation, not
an authoritative ZCTA boundary. To upgrade to real boundary lines, drop a
standard ZCTA GeoJSON at `data/zip-boundaries.geojson` covering these 24
ZIPs; no other code changes are needed.

## Revenue distribution plot

`REVENUE_DISTRIBUTION` in `data.js` is a 20-bin histogram of
`Charlotte NC - Market Eval - FINAL.xlsx`'s `Revenue Potential` field across
all 719 listings (all bedroom counts), with P75 ($52,526, top-25% threshold)
and P90 ($78,801, top-10% threshold) computed directly from the data — see
`scripts/generate_webpage_map_data.py` for the exact percentile method
(pandas `.quantile()`, linear interpolation). The `bedroom4` field (kept
under that name to match the reference site's chart/interpretation code) 
holds the non-lake-excluded 5BR+ subset here (N=64, median $85,346, P90
$147,875), shown alongside as supporting context.

## How to extend

- **Build out the 5BR+ buy box further**: edit `BUY_BOXES[2]` (`id:
  "5br-plus"`) in `js/data.js`; `ddBlock` skips rows with no value, so a
  field left `null`/omitted renders as absent rather than guessed.
- **Develop the 3BR, 4BR, or Lake buy box**: replace its stub entry in
  `BUY_BOXES` with a full spec following the 5BR+ object's shape (or richer —
  see the original Shenandoah reference for the fuller section vocabulary:
  `mustHaveExecutionTiers`, `executionComparison`, `counterexamples`,
  `designDirection`, `acquisitionCandidates`, etc., all already wired up in
  `render.js`'s `NARRATIVE_BLOCKS`), set `status: "developed"`, and remove
  its entry from `PENDING_BUY_BOXES`.
- **Add a new photo**: drop the file under `assets/5br/<category>/` (or a
  new `assets/<buy-box-id>/<category>/`), then reference it via
  `photo(relPath, alt, caption)` in `data.js`.
- **Regenerate the map data**: `python3 scripts/generate_webpage_map_data.py`
  from this directory whenever the underlying workbook changes.

## What NOT to assume

- No build/bundle/minify step, no package manager.
- `data/listings.json` is machine-generated; don't hand-edit it.
- The ZIP-area circles on the map are an approximation, not real ZCTA
  boundaries — see the ZIP overlay note above.
- No STR regulation, permit, or HOA figures are shown for the 5BR+ buy box
  because none have been researched yet — this is deliberate (see
  `REGULATION_NOTE` in `data.js`), not an oversight.
- Non-5BR+ listings never set the 5BR+ revenue tiers or underwriting ranges
  on this page — the market-wide thresholds used throughout ($78,801 /
  $52,526) are deliberately the whole market's, not a 5BR+-only decile; see
  the Performance Context section's own caution note for why that distinction
  matters here specifically.
- Lake/waterfront-flagged 5BR+ listings are excluded from every 5BR+ number
  on this page by design (see Geo Considerations in the 5BR+ deep dive) —
  not a data gap.
