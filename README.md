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
- **Lake's bedroom/bathroom/sleeps capacity analysis AND amenity analysis
  are both built**, even though Lake is still a "pending" tab overall — see
  `../notebooks/charlotte_lake_buybox.ipynb` and the "Pending boxes can show
  real partial evidence" section below for how a pending box shows this
  without claiming to be a full deep dive. **The page mostly follows
  Clearwater's 5BR structure — short text-per-section plus real photos, not
  a wall of matplotlib charts — with two explicit, narrow exceptions where
  the team asked for charts back**: the amenity data (a compact 2-up
  prevalence-bar + presence-heatmap pair, right before Must-Have's — "it
  must be there") and Traveler ICP (two small comparison bars replacing
  prose). `charlotte_lake_buybox.ipynb` itself has the fuller chart-based
  analysis this page doesn't otherwise surface (a Shenandoah-style capacity
  4-panel + tiered-comparison chart, plus the same amenity prevalence/
  heatmap pair now also on the live page) — all 4 PNGs under
  `assets/lake/charts/` are now referenced from `data.js` (the two capacity
  ones under Bedrooms & Bathrooms, the two amenity ones under Amenity
  Prevalence By Tier); none remain orphaned. The live page's sections
  (`pendingSections` in `data.js`, see below) mirror Clearwater's real
  order: an `overview` hero card (see "Pending boxes can show real partial
  evidence" below) → Property Profile (Bedrooms & Bathrooms, now with the
  capacity-4panel/by-tier evidence charts → Sleep Count → Architectural
  Style → Backyard) → Amenities (Amenity Prevalence By Tier → Must-Have,
  one segment — Fire Pit, Waterfront, Lake Access, the only amenities at
  100% prevalence among Lakeside's Top 10%; no Auto-Add tier → Nice-to-
  Have, Ranked) → Geo Considerations (an embedded copy of the Section 3
  map, in place of separate View/Waterfront/Privacy prose) → Property
  Locations (one short paragraph, same map referenced above) → Traveler
  Demographics (the two ICP bars) → Comp Set (Comp-Set Visual Comparison,
  then the Alexandria link). Architectural Style and Backyard are left
  genuinely empty (no photos supplied yet) rather than filled with invented
  text. Three real room photos sit under Sleep Count: the two original
  reference photos (a bunk room and the comp set's first property), plus
  one sourced directly from Lakeside's Top 10% comp set itself — see
  "AI-sourced comp photos" below. Every `niceToHaveRanked` item has an
  empty `images: []` slot ready for reference photos once supplied. An
  earlier version of this page put all of the chart-based analysis
  directly on the site and the ranked list rendered every item (even thin
  ones) as a full card — both correct but far too dense for a presentation
  page; cut down after the team's own "this is taking way too much space"
  review.
- **Comp-Set Visual Comparison is now in progress on the live page**,
  replacing the earlier "still pending" note. Lake's 8-listing Top 10% comp
  set (`../LakeBuyBox/Compset.csv`) is tiered by literal CSV row order
  (top 2 by Revenue Potential = High, next 4 = Mid, remaining 2 = Low)
  across 2 photo categories (Exterior, Bedrooms) shown as Top/Mid/Low
  columns side by side — see `compSetComparison` under "Pending boxes can
  show real partial evidence" below. Photos are being supplied property-
  by-property (`../LakeBuyBox/Images/HeroPic/`, `.../Bedroom/`, named by
  comp rank e.g. `Property1.avif`) — any property without a photo yet in a
  given category shows a `pendingPhoto()` card linking to its real Airbnb
  listing instead. The per-category analyst write-up is a literal Lorem
  Ipsum placeholder, explicitly marked as such, until the real one is
  supplied.
- **Every buy box now opens with a Clearwater-style "Buy-Box Summary" hero
  card** (`box.overview`, rendered by the same `overviewBlock()` a
  developed box uses) — status badge, thesis, "why this works", spec
  chips, revenue chips, and a hero photo where one exists (Lake uses its
  own #1-by-revenue comp's exterior; Outskirts borrows one of Walid's
  Architecture reference photos; Downtown/Uptown has none yet and renders
  single-column instead of leaving a blank media panel). Purely additive —
  a box with no `overview` set (there are none currently) would render
  exactly as before.
- **AI-sourced comp photos live in their own folder, separate from the
  team's own curated photos.** `../LakeBuyBox/ai-gen/` (mirrored into
  `assets/lake/ai-gen/` for the live page) holds photos found by scrolling
  Lakeside's actual Top 10% comp-set Airbnb listings for amenity categories
  the team's own `../LakeBuyBox/Images/` didn't yet cover — kept in a
  separate folder specifically so it's never confused with the team's own
  photography. `../LakeBuyBox/ai-gen/SOURCE.md` documents what was searched
  and found: 5 amenities (Sauna, Mini Golf, Movie Theater, Golf Simulator,
  Pool Heater) are N=0 across the entire 39-listing Lakeside region and 2
  more (Pickleball, Playground) are N=0 among the Top 8 specifically — not
  worth searching; Gym and Pack N Play/Crib were checked in their one/few
  flagged listings' full photo galleries and not found staged; one genuine
  bonus — a six-bed built-in bunk room — was found and is now in Ideal
  Sleep Count.
- **Curated property photography, design comps, and acquisition-candidate
  screening remain deferred for Downtown/Uptown**, and for Lake beyond the
  photos above — no stock photos or invented images anywhere on this page.
- **Outskirts is filled in with a teammate's (Walid's) own buy-box
  research**, not built by this codebase's own analysis the way Lake's is.
  Walid filled in a copy of this same team's buy-box template
  ("`../Outskirts/Charlotte, NC Buy Boxes.docx`") and supplied a
  photo/chart folder (`../Outskirts/`, `readme.txt` there maps every folder
  to a section) — 76 real reference photos across 10 categories (2 acceptable
  architectural styles, backyard/outdoor living, must-have amenities,
  nice-to-have amenities, top interior/exterior designs, revenue comps by
  tier, and analyst-notes/photography-quality examples) plus 5 charts
  (bedroom/sleeps/bath size distribution, revenue-by-size box plots,
  amenity penetration, an ideal-locations map, and a traveler-ICP pie).
  Outskirts' `pendingSections` mirrors Lake's own mechanism and component
  vocabulary exactly (`groupTitle`/`title`/`body`/`items`/`images`/
  `charts`/`chartsRow`/`ranked`/`mapEmbed`), extended with 3 groups Lake's
  page doesn't have (Comp Set's Design/Revenue split, Analyst Notes,
  Projections) because Walid's material covers real content there Lake's
  doesn't have yet — per the team's explicit "add the extra content... use
  everything he provided." Every photo's caption/alt text and destination
  filename slug was generated by actually viewing that photo (not guessed
  from its original filename, most of which were opaque upload UUIDs); two
  photos Walid filed under "Nice-to-haves" but that actually depict a game
  room and a fire pit were moved into Must-Have's images instead, by what's
  in the photo rather than by source folder. `niceToHaveRankedItem()` in
  `render.js` was extended to render whichever stats a ranked item actually
  has (Walid's Pool/Hot Tub items only have a bare revenue-uplift %, no
  score/hit-rate-uplift/N the way Lake's composite score has) instead of
  crashing on `.toFixed()` of an undefined score or printing a literal
  "undefined" into a stat the source never supplied.

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
- **Section 3's map was swapped out entirely**, and rebuilt twice more.
  First, the reference site's native Leaflet market-wide tier map
  (`js/map.js`'s `initMap()`, reading `data/listings.json`) was replaced
  with an `<iframe>` embed of `assets/overview/charlotte_overview_map.html`
  — a folium map built in `charlotte_overview.ipynb`. That map originally
  split only the Top 10% into four KMeans-derived micro-clusters
  (Uptown/NoDa/South End, Steele Creek/Lake Wylie, Ballantyne/Matthews/
  SouthPark, East Charlotte/Mint Hill); it was then rebuilt to plot **all
  719 listings**, first as two *independent* toggle axes (revenue tier and
  Walid's region classification, each listing plotted twice), then rebuilt
  again into a **combined AND filter**: one marker per listing (no
  duplication), added directly to the map rather than into folium
  `FeatureGroup`s, with a small custom JS panel (checkboxes for the 3 tiers
  and 3 regions, bottom-left) that shows a listing only when *both* its
  tier checkbox and its region checkbox are checked — e.g. checking only
  "Top 10%" and "Lakeside" isolates exactly that region's top performers
  (verified: 8 markers, matching the notebook's own count). Folium's native
  `LayerControl` (top-right) still handles the 3 landmark overlays
  independently, since those aren't part of the tier/region filter. Getting
  this right took two passes: a first attempt referenced the map's JS
  variable before it was defined on the page (a script-ordering bug, fixed
  by deferring the filter setup to `window.addEventListener("load", ...)`),
  and a second attempt had an f-string brace-escaping bug in the fix itself
  (`});` instead of `}});`) — both caught by testing the actual filter
  behavior in a browser (via `path.leaflet-interactive` DOM counts), not
  just checking that the notebook executed without error. `js/map.js`'s
  `initMap()` is consequently unused (the `#leaflet-map` container it
  targets no longer exists in `index.html`, so it now no-ops) — kept in
  place rather than deleted, in case a native filterable map is wanted
  again later (see "How to extend"). A small function,
  `renderLocationInterpretation()` in `render.js`, prints
  `MAP_CONFIG.marketInterpretation` plus `MAP_CONFIG.regionBullets`
  (renamed from `clusterBullets` when the map pivoted to regions) under the
  embedded map; it's called from `main.js` in place of the old `initMap()`
  call.

Beyond the above and the pending-box image system described next, no other
line of `render.js`, `map.js`, `charts.js`, `main.js`, or `css/styles.css`
was touched (one added `.embedded-map--tall` CSS rule for the taller
Section-3 iframe) — everything else is a byte-for-byte copy of the
reference site's files. `js/render.js`'s `fourBrCompMapBlock()`/
`oneTwoBrCompMapBlock()` and `js/map.js`'s corresponding init/cleanup
functions are Shenandoah-specific (4BR/1-2BR embedded Leaflet comp maps) and
are unused dead code here — none of the three current buy boxes reference
those section keys.

## Pending boxes can show real partial evidence

A pending box needs to show whatever real analysis IS finished — with its
own section flow, like a developed box gets — without claiming to be a
full deep dive. `renderDeepDive()` in `render.js` supports an optional
opening hero plus two shapes for the body, checked in this order:

**0. `overview`** (all three pending boxes set this) — Clearwater's "1.
Buy-Box Summary" hero card (`{ statusBadge, thesis, whyItWorks, heroImage?,
chips, revenueChips }`), rendered via the *same* `overviewBlock()` a
developed box's `NARRATIVE_BLOCKS.overview` uses — reused as-is, not
reimplemented, so a pending box gets the identical at-a-glance opening
(status badge, thesis, "why this works", spec chips, revenue chips) instead
of starting cold on "Property Profile". `heroImage` is optional: Downtown/
Uptown has no photos yet, so it renders `.bb2-hero--no-media` (single
column, no blank media panel) instead of the two-column layout — set
whenever `box.overview` lacks a `heroImage`, checked in `overviewBlock()`
itself so callers never have to think about it.

**1. `pendingSections`** (preferred — this is what Lake and Outskirts use)
— an ordered array of named, titled sections, each rendered via
`renderPendingSection()` with its own `<h3>`. This is what gives a pending
box real presentation flow instead of one undifferentiated blob of
images/text. Lake's own sections mirror the team's own template outline
(which itself mirrors Clearwater's 5BR order almost exactly), grouped under
6 headings: Property Profile (Bedrooms & Bathrooms, Ideal Sleep Count,
Architectural Style, Backyard Size) → Amenities (Amenity Prevalence By
Tier, Must-Have's, Nice-to-Have's) → Geo Considerations (Waterfront, View &
Privacy) → Property Locations (Ideal Location(s) & Popular Places) →
Traveler Demographics (Traveler ICP) → Comp Set (Comp-Set Visual
Comparison, Alexandria Comp Set). Each section object supports, all
optional:

- **`groupTitle`** — a bare divider heading (`<h2>`, one tier above a
  regular section's `<h3>`) grouping the ordinary sections that follow it —
  e.g. `{ groupTitle: "Property Profile" }`. Renders nothing else; use this
  for the 5 group headings above, as their own array entries ahead of the
  sections they group.
- **`title`** — rendered as an `<h3 class="dd-block__title">`. Omit it if
  the section's own content already self-titles (see `ranked` below).
- **`pendingLabel`** — for a section with no data yet (Lake's View and
  Privacy / Seclusion): renders just the title plus this one muted, italic
  line, e.g. "Not yet analyzed — no reference photos supplied yet." Nothing
  else in the section renders when `pendingLabel` is set.
- **`body`** — arbitrary HTML (short paragraphs, bullets), rendered via
  `innerHTML` like every other narrative field on this page.
- **`items`** — a plain string array, rendered via the existing
  `amenityChecklist()` helper (a checkmark list) — used for Lake's
  Must-Have section (one segment only, no Auto-Add tier, matching
  Clearwater's structure exactly per the team's explicit instruction).
- **`images`** — a `photo()`/`pendingPhoto()` array, rendered through the
  same `renderImageGrid()`/lightbox system every developed box's photos use
  — but always with the compact `dd-block__images--geo-compact` grid
  (max 360px per figure), forced by `renderPendingSection()` itself rather
  than left to the caller: a page whose photos are a reference library
  (`../LakeBuyBox/Images/`, not curated comp photography yet) shouldn't
  render the ones that do exist huge just because the grid has room. Lake's
  16 photos are all placed by subject (bedroom/bunk photos under Ideal
  Sleep Count, exterior/interior under Architectural Style, pool/porch
  under Backyard Size, fire-pit-at-the-water under Must-Have, one per
  amenity under its own Nice-to-Have item) — every photo supplied so far is
  used somewhere, none invented or left generically in one gallery.
- **`charts`** — same idea, but for wide analysis figures (a 4:3-cropped
  photo grid badly clips a multi-panel chart), rendered through
  `renderWideImageBlock()` instead: one full-width, uncropped figure per
  row (`photo-figure--wide` in `styles.css` — `aspect-ratio: auto` and
  `object-fit: contain` instead of the 4:3 `cover` crop). Still lightboxed.
- **`chartsRow`** — the same uncropped/natural-aspect-ratio treatment as
  `charts`, but 2-up side by side in a `.chart-row` grid instead of one per
  row — for a pair of charts meant to be read together and compact, not
  full-width alone. Lake's "Amenity Prevalence By Tier" section (right
  before Must-Have's, per explicit "it must be there" feedback) uses this
  for `amenity_prevalence.png` + `amenity_heatmap.png`
  (`assets/lake/charts/`, copied from `charlotte_lake_buybox.ipynb`'s
  figures) — the aggregate-by-tier bar chart and the per-listing heatmap
  together justify the Must-Have list right above where it's decided,
  without either chart sprawling full-width on its own.
- **`mapEmbed`** — `{ url, title?, className? }`, rendered via the same
  `renderEmbeddedMap()` iframe helper Section 3 and the 4BR/1-2BR comp maps
  use. Lake's Geo Considerations section embeds the Section 3 map itself
  (`assets/overview/charlotte_overview_map.html` — already region/tier
  filterable and landmark-marked) in place of separate View/Waterfront/
  Privacy prose paragraphs, per explicit "why not use the map... too many
  words" feedback: one map replaces three short paragraphs' worth of
  geography claims a reader can now just go check directly.
- **`icpCharts`** — `true` renders two small comparison bar charts (ids
  `chart-lake-icp-group`/`chart-lake-icp-kids`, built by
  `renderLakeIcpCharts()` in `charts.js` from `LAKE_ICP_DEMOGRAPHICS` in
  `data.js`) in place of Traveler ICP's prose — same "use charts, not
  paragraphs" feedback as `mapEmbed` above. Chart.js needs its `<canvas>`
  already attached to the live document before it can size itself, and a
  pending section's `wrap` isn't attached to `#deep-dive-content` yet at
  the point `renderPendingSection()` builds it — so the two canvases are
  created here but the actual `new Chart(...)` calls are queued
  (`pendingChartJobs` in `render.js`) and only run after
  `renderDeepDive()` appends the whole section tree to the live DOM.
- **`ranked`** — a scored, ordered amenity list matching Clearwater's 5BR
  `niceToHaveRanked` structure, rendered via `niceToHaveRankedBlock()`
  (also reused on a *developed* box via `amenityStackBlock()`, so it isn't
  pending-only). Each item is `{ name, score, revenueUplift, p90Uplift, n,
  note, images }`, or `{ name, n, thinData: true, note, images }` for an
  amenity too thin to rank. `niceToHaveRankedBlock()` renders its own
  "Nice-to-Have, Ranked" `<h4>` — leave the section's own `title` unset for
  a `ranked` section, or the heading prints twice (a real bug from an
  early version of this page, caught by testing the rendered page). A
  thin-data item collapses to one dense line (`.nice-ranked__item--thin`:
  no card, no score, just name + note on a dashed-bottom-border row) rather
  than a full card — an earlier version gave every item, thin or not, a
  full padded card, which was most of what made the page "take way too
  much space" per the team's own review. `images` is always present on
  every item, even if empty. A thin item's image renders as a tiny 48px
  inline thumbnail (`.nice-ranked__thin-thumb`, via `renderImage()`
  directly, not `renderImageGrid()`) rather than a full geo-compact figure
  — an early attempt used the same 220-360px grid figure here too, and a
  360px-tall image towering over a one-line "N=3, too thin to rank
  reliably" row was exactly the kind of oversized-for-its-content mismatch
  the team's "do not make them huge" feedback was about; caught the same
  way, by looking at the actual rendered page. Still fully lightboxed on
  click despite the tiny inline size.
- **`compSetComparison`** — `{ intro?, categories: [{ title, interpretation?,
  tiers: { high, mid, low } }] }`, rendered via `compSetComparisonBlock()`
  (Clearwater's exact "Comp-Set Visual Comparison" structure: named photo
  categories, each split into Top/Mid/Low tier columns side by side via the
  same `.bb2-tier-compare__*` CSS the reference site ships). Each tier is
  an array of properties — `{ title, url?, stats?, images, note? }` — one
  `compSetPropertyCard()` per property, stacked vertically within its tier
  column (`renderImageGrid(prop.images, { small: true })`, so a property
  with several photos doesn't force an unreadably tall column). Lake's own
  usage: 8 properties from `../LakeBuyBox/Compset.csv`, tiered by literal
  CSV row order (top 2 rows = High, next 4 = Mid, remaining 2 = Low, sorted
  by Revenue Potential) across 2 categories (Exterior, Bedrooms) — the
  categories a teammate has actually started supplying property-numbered
  photos for (`../LakeBuyBox/Images/HeroPic/`, `.../Bedroom/`) as of this
  writing; more may be added the same way as more categories get photos.
  Any property whose photo for that category hasn't been supplied yet gets
  a `pendingPhoto(url, label)` card instead of an invented image — it
  links straight to that listing's real Airbnb URL from the CSV. Category
  `interpretation` text is a **literal Lorem Ipsum placeholder** for now,
  explicitly prefixed `[Analyst opinion — placeholder text below, to be
  replaced]` so it's never mistaken for real analysis — swap it for the
  real write-up once supplied, the same way a `pendingPhoto()` gets swapped
  for a real `photo()` once that property's image arrives.
**2. The older flat fields** — `pendingIntro`, `pendingImages`,
`pendingCharts`, `niceToHaveRanked` set directly on the box (not nested in
`pendingSections`) — still supported as a fallback for a box that hasn't
been organized into sections yet. Downtown/Uptown is the one box that only
sets `pendingNote` today and renders exactly as before (no source material
has been supplied for it yet); Lake and Outskirts both use `pendingSections`
now (see Status above for Outskirts' own content and provenance).

`pendingNote` itself always renders last, section-structured or not — the
one constant "footer" (comp-set link, closing caveats) regardless of how
the rest of the box is organized. One more small fix that came out of
building this: `.deep-dive--pending`'s `text-align: center` (fine for a
short one-line note) reads badly for a bullet list — `.deep-dive--pending
.dd-block__body` is now explicitly left-aligned, and only content wrapped
in that class is affected.

## Content style: compact, bulleted narrative fields

Every narrative string in `data.js` (thesis, `whyItWorks`, `recommended`,
`caution`, etc.) is rendered via `innerHTML`, not `textContent`. Write
narrative fields as a short lead-in sentence (if any) plus a tight 2-4 item
bullet list (bold lead-ins via `<strong>`, an emoji accent per item where it
adds scannability), not a wall of text — see `MARKET_OVERVIEW.paragraphs`'s
third paragraph and `MAP_CONFIG.regionBullets` for the current examples.
**This is the template going forward** for any narrative field, including
whichever buy box gets a full deep dive first.

## STR Regulations (Section 5)

A city/county-wide fact, not a buy-box-specific one — Charlotte's STR
regulatory environment is identical whether the property is Downtown,
Outskirts, or Lake. It lives once, as its own top-level page section
(`#regulations`, between Traveller Demographics and Buy-Box Deep Dive,
with its own nav link), not repeated inside every buy-box tab. **This is
a correction**: it was first built as a `{ regulations: true }`
`pendingSections` entry duplicated inside Outskirts' and Lake's own tabs,
right after their own Traveler ICP section — the team's own wording ("add
it after Traveler ICP") was ambiguous between "after the buy-box-level
Traveler ICP section" and "after the page's own Traveller Demographics
section, in the shared overview flow, not per box" until clarified
directly; the fix removed both per-box copies and moved the content to
its own Section 5.

`CHARLOTTE_STR_REGULATIONS` in `data.js` holds the content, sourced from a
supplied PDF ("Charlotte, NC Overview.pdf" — a Short-Term Rental
Regulatory Due Diligence Report). Its category structure — **Regulation
Tier Overall** (a tier badge + one-sentence note), **Permit / Residency**,
**Operating Limits**, **Investor Notes** — matches the team's own buy-box
template exactly (the same 4 categories used, and left entirely blank, at
the top of Outskirts' `Charlotte, NC Buy Boxes.docx`), populated here with
the PDF's real findings for the first time. `sources` are the report's
named official resources (Charlotte UDO Portal, Municode, the county tax
office); their hyperlink targets weren't extractable from the PDF text,
so they're listed as plain labels rather than guessing at a URL.

`regulationsCardBody()` in `render.js` renders all three category rows as
bulleted lists via the existing `listHtml()`/`dd-row` pattern — no
paragraphs — per explicit "visually attractive, bullet points, minimize
text usage" instruction; `renderRegulationsSection()` populates the
`#regulations-body` host on `DOMContentLoaded` (see `main.js`), the same
pattern every other top-level section (`renderMarketOverview()`,
`renderDemographics()`, etc.) already uses.

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
  Lake also sets `pendingIntro`/`pendingImages`/`pendingCharts` for its real
  bedroom/bathroom/sleeps evidence — see "Pending boxes can show real
  partial evidence" above.
- **`js/charts.js`** — Chart.js: the market-wide Revenue Potential histogram
  (colored by revenue-tier band), the two Section-4 demographics charts
  (review-composition pie + by-bedroom stacked bar), and
  `renderLakeIcpCharts()` (two small Market-wide/Lakeside-wide/Lakeside-Top-
  10% comparison bars for Lake's Traveler ICP section, from
  `LAKE_ICP_DEMOGRAPHICS` in `data.js` — see `icpCharts` above).
- **`js/map.js`** — Leaflet/OpenStreetMap map reading `data/listings.json`,
  filterable by revenue tier (top10/top25/bottom75, market-wide), plus a
  ZIP-area overlay toggle (approximate centroid+radius circles, same
  documented limitation as the reference site — see below). **Currently
  unused** on this page — Section 3 embeds `charlotte_overview_map.html`
  instead (see "Code changes from the reference site" above) — kept working
  and in place as a documented fallback/extension point, not deleted.
- **`js/main.js`** — bootstraps everything on `DOMContentLoaded`; nav
  scroll-spy; lightbox open/close wiring. Unmodified from the reference site.
- **`css/styles.css`** — the design system. Originally the reference site's
  unmodified, plus the small scoped additions already noted above
  (`.embedded-map--tall`; `.photo-figure--wide`/`.dd-block__wide-images`/
  `.deep-dive--pending .dd-block__body` for the pending-box image system).
  Since redesigned for a more formal/restrained look, per explicit "colors
  and borders are horrible... make them formal and elegant" feedback — the
  brand palette (forest green + amber, still not brown/tan) is unchanged,
  but: (1) every dashed border (informal-looking) is now a solid hairline
  (`--hairline: 1px solid var(--color-border)`); (2) the scattered one-off
  `color-mix()` tint percentages that had accumulated across components
  (3/4/5/6/8/10/16%, no shared rhythm) are consolidated into four tokens —
  `--surface-tint`/`--surface-tint-strong` (neutral forest-tinted
  backgrounds) and `--accent-tint`/`--accent-tint-strong` (amber-tinted);
  (3) the loud 2px solid-amber top border on `.pending-section--group`
  (every group heading like "Amenities", "Geo Considerations") is now a
  plain hairline with a small-caps amber eyebrow label instead — a report
  reads as more formal when its section accent is restrained typography,
  not a repeated bright color bar; (4) colored left/top borders elsewhere
  (`.dd-block--priority`, `.dd-block--contrast`, `.declaration-card--lead`)
  went from 4px to 3px, and the pending-status badge
  (`--status-pending-bg`/`--status-pending-text`) now derives from
  `--brand-amber-dark` instead of its own separately-tuned orange, so it
  reads as the same accent color everywhere rather than two different
  oranges.
- **`data/listings.json`** — generated by `scripts/generate_webpage_map_data.py`
  from `Charlotte NC - Market Eval - FINAL.xlsx`; safe to re-run, do not
  hand-edit. Includes a `zipApprox` array (see ZIP overlay note below) and an
  `isLake` flag per listing (amenity-flag-based, not the same as Walid's
  Lakeside region — not read by the currently-unused `map.js` yet).
- **`assets/overview/charlotte_overview_map.html`** — the live Section 3
  map, generated by `charlotte_overview.ipynb`. Regenerate by re-running
  that notebook and copying its output here (see "How to extend").
- **`assets/lake/{rooms,exterior,indoor,porch,firepit,hottub,pool,pooltable,
  gameroom}/`** — all 16 real reference photos on the Lake tab, sourced
  from `../LakeBuyBox/Images/` — a real Charlotte-market image library, not
  stock photos, organized by subject to match where each is used
  (`rooms/` under Ideal Sleep Count, `exterior/`+`indoor/` under
  Architectural Style, `porch/`+one `exterior/` file under Backyard Size,
  `firepit/` under Must-Have and Waterfront, the rest one per Nice-to-Have
  item). **`assets/lake/charts/`** — the 4 capacity/amenity
  charts generated by `charlotte_lake_buybox.ipynb`. **Orphaned, not
  deleted** — `data.js` doesn't reference them (see Status above; the live
  page follows Clearwater's text-and-photo structure, no charts), same
  treatment as `assets/5br/` below.
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
  `PENDING_BUY_BOXES`. Give it its own deep-dive notebook first — Lake has
  one now (`charlotte_lake_buybox.ipynb`); Downtown/Uptown and Outskirts
  don't yet (the old bedroom-count stub notebooks
  `charlotte_3br_buybox.ipynb`/`charlotte_4br_buybox.ipynb` no longer
  correspond to any current buy box). In the meantime, a box can show real
  partial evidence (a chart, a couple of photos) while still `"pending"` via
  `pendingIntro`/`pendingImages`/`pendingCharts` — see "Pending boxes can
  show real partial evidence" above; that's how Lake's capacity analysis
  went up before its comp set was ready.
- **Add a new photo**: drop the file under
  `assets/<buy-box-id>/<category>/`, then reference it via
  `photo(relPath, alt, caption)` in `data.js`. If it was sourced from a
  comp-set listing's own photos rather than supplied directly by the team,
  put it under `assets/<buy-box-id>/ai-gen/` instead (mirroring
  `../<BuyBox>/ai-gen/` alongside the team's own `Images/` folder) and note
  the source listing in that folder's `SOURCE.md` — see Lake's for the
  pattern.
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
