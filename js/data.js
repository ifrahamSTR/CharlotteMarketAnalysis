/**
 * Central content/config layer for the Charlotte, NC STR buy-box presentation
 * webpage.
 *
 * This is the ONLY place buy-box specs, comps, revenue tiers, and analyst
 * notes should live. Rendering code (render.js, map.js, charts.js) reads
 * from this file; it never hardcodes content.
 *
 * Architecture, section-key vocabulary, and every CSS class this page uses
 * are copied verbatim from the Shenandoah Valley reference site
 * (rafidislam07.github.io/shenandoah) — this is the same template, not a
 * redesign. The only code changes made to render.js/map.js were making the
 * hardcoded ", VA " state suffix and one hardcoded interpretation sentence
 * data-driven via MAP_CONFIG.stateAbbr / MAP_CONFIG.marketInterpretation, so
 * the same files work for a North Carolina market without a Virginia-specific
 * bug. See README.md for the full list.
 *
 * SOURCE OF TRUTH: `Charlotte NC - Market Eval - FINAL.xlsx` -> `Cleaned_Data`
 * sheet (719 listings, single snapshot dated 2026-08-14), joined against a
 * teammate's (Walid's) `Charlotte NC - Market Eval - Walid.xlsx` ->
 * `Cleaned_Data_With_Region` sheet for the Downtown/Outskirts/Lakeside region
 * classification (verified 719/719 exact Property ID match, zero revenue
 * mismatches), and the analysis already built in
 * ../notebooks/charlotte_overview.ipynb. Every number below traces to that
 * notebook or to scripts/generate_webpage_map_data.py.
 *
 * STATUS (see README.md for detail): the buy-box structure pivoted from
 * bedroom-count-first (3BR/4BR/5BR+, plus a bonus Lake box) to region-first
 * (Downtown/Uptown, Outskirts, Lake) once the team adopted Walid's region
 * classification — it gave Lake enough sample depth (N=39 vs. the earlier
 * amenity-flag-only N=27) to run as a core box, not a bonus one. The earlier
 * 5BR+ deep dive (fully developed, bedroom-count-based) has been retired from
 * this page; its notebook, ../notebooks/charlotte_5br_plus_buybox.ipynb,
 * still exists on disk but is no longer the source for anything here. All
 * three current buy boxes are named and scoped (real N, real Top 10% hit
 * rates) but not yet built out as full deep dives — map and structure come
 * first, per the team's current call. They render as "pending" tabs, the
 * same pending-state the template already supports natively (no placeholder
 * data is invented for them). Curated property photography, design comps,
 * and acquisition-candidate screening remain deferred for all three.
 */

// ---------------------------------------------------------------------------
// Photo-evidence helper. Every file lives under webpage/assets/<category>/.
// ---------------------------------------------------------------------------
function photo(relPath, alt, caption) {
  return { file: "assets/" + relPath, alt: alt, caption: caption };
}

// A bare-Airbnb-link reference for comps/hero spots with no stored photo yet.
function pendingPhoto(url, label) {
  return { pending: true, url: url, label: label };
}

// ---------------------------------------------------------------------------
// Section 2 — Market context
// ---------------------------------------------------------------------------
const MARKET_OVERVIEW = {
  heading: "What Charlotte is",
  heroImage: photo(
    "overview/charlotte-skyline-stadium.jpg",
    "Aerial dusk view of Bank of America Stadium and the Uptown Charlotte skyline under a pink and purple sky",
    "Uptown Charlotte at dusk, with Bank of America Stadium in the foreground."
  ),
  paragraphs: [
    "Charlotte — the \"Queen City\" — is North Carolina's largest city, the country's second-largest banking center, and a self-styled \"Energy Capital\": the National Center for the energy industry is based here alongside Bank of America's headquarters.",
    "Charlotte anchors a metro area of roughly 2.8 million people, sitting inside the \"Charlanta\" megaregion that stretches from Atlanta to Raleigh — Charlotte's skyline, corporate travel demand, and weekday business-trip base are all downstream of its banking core.",
    "Charlotte Douglas International Airport (CLT) is a major American Airlines hub, one of the busiest airports in the country by traffic — this is a fly-in market as much as a drive-in one, and short-term rental demand reflects both a corporate/business-travel base and event-driven leisure groups.",
    "The market splits into three geography-defined regions — <strong>Downtown / Uptown</strong> (the walkable urban core plus Bank of America Stadium and Spectrum Center, largest inventory pool at 51% of the market), <strong>Outskirts</strong> (the broadest region geographically, 2.5–14 miles out, the largest pool of big group-oriented houses), and <strong>Lakeside</strong> (the Lake Wylie / Mountain Island pocket, smallest by count but the strongest revenue performer) — which is what the location analysis below is built around.",
  ],
  attractions: [
    "<strong>NASCAR Hall of Fame</strong> — celebrates the history and heritage of stock car racing.",
    "<strong>Carowinds</strong> — a massive amusement park straddling the South Carolina border.",
    "<strong>Discovery Place Science</strong> — an interactive science museum in Uptown Charlotte.",
    "<strong>Uptown</strong> — the bustling downtown core of museums, restaurants, and entertainment venues.",
  ],
  visitorStats: {
    headline: "33 million visitors a year, a $1.2 billion economic impact",
    breakdown: [
      "<strong>Leisure &amp; Neighborhood Tourism — $640.2M:</strong> visitors flock to distinct neighborhoods like South End, NoDa, and Plaza Midwood for the culinary scene, local breweries, and arts.",
      "<strong>Sports Travel — $333.5M:</strong> Bank of America Stadium, Spectrum Center, Charlotte Motor Speedway, and the NASCAR Hall of Fame anchor a packed events calendar.",
      "<strong>Business &amp; Conventions — $102.9M:</strong> the nation's second-largest banking hub; the expanded Charlotte Convention Center hosts 100+ major conferences a year, driving mid-week corporate demand.",
      "<strong>Relocation &amp; VFR:</strong> roughly 157 people move to Charlotte every day — incoming residents and the friends/family visiting them are a steady, non-seasonal share of demand.",
    ],
  },
  sources: [
    { label: "Charlotte Douglas International Airport — About CLT", url: "https://www.cltairport.com/about/" },
    { label: "Charlotte Regional Business Alliance — Charlotte USA facts", url: "https://charlotteusa.com/" },
    // Visitor-volume/economic-impact breakdown as supplied by the user, without
    // a resolvable citation URL -- named, not linked, per this project's
    // no-fabricated-links discipline (see README.md).
    { label: "Visit Charlotte / CRVA — regional tourism economic impact reporting" },
  ],
};

const REGULATION_NOTE =
  "STR regulatory, permitting, and HOA diligence is address-level and deferred to acquisition screening for any specific candidate property. No jurisdiction-wide regulatory determination has been made for this market.";

// ---------------------------------------------------------------------------
// Market-wide revenue distribution (Section 2 plot) — computed directly from
// Charlotte NC - Market Eval - FINAL.xlsx's Revenue Potential field (all 719
// listings, all bedroom counts). See scripts/generate_webpage_map_data.py for
// the exact computation (pandas .quantile(), linear interpolation). Do not
// hand-edit; regenerate from the workbook if the underlying data changes.
// ---------------------------------------------------------------------------
const REVENUE_DISTRIBUTION = {
  totalCount: 719,
  medianRevenue: 39941,
  p75: 52526.0,
  p90: 78800.6,
  histogram: [
    { binStart: 11338.0, binEnd: 20758.2, count: 45 },
    { binStart: 20758.2, binEnd: 30178.3, count: 121 },
    { binStart: 30178.3, binEnd: 39598.4, count: 189 },
    { binStart: 39598.4, binEnd: 49018.6, count: 148 },
    { binStart: 49018.6, binEnd: 58438.8, count: 73 },
    { binStart: 58438.8, binEnd: 67858.9, count: 44 },
    { binStart: 67858.9, binEnd: 77279.1, count: 22 },
    { binStart: 77279.1, binEnd: 86699.2, count: 23 },
    { binStart: 86699.2, binEnd: 96119.3, count: 15 },
    { binStart: 96119.3, binEnd: 105539.5, count: 7 },
    { binStart: 105539.5, binEnd: 114959.6, count: 7 },
    { binStart: 114959.6, binEnd: 124379.8, count: 5 },
    { binStart: 124379.8, binEnd: 133800.0, count: 7 },
    { binStart: 133800.0, binEnd: 143220.1, count: 4 },
    { binStart: 143220.1, binEnd: 152640.2, count: 4 },
    { binStart: 152640.2, binEnd: 162060.4, count: 2 },
    { binStart: 162060.4, binEnd: 171480.5, count: 1 },
    { binStart: 171480.5, binEnd: 180900.7, count: 0 },
    { binStart: 180900.7, binEnd: 190320.9, count: 1 },
    { binStart: 190320.9, binEnd: 199741.0, count: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Section 4 — Traveller Demographics. Review-derived guest-composition
// signals (share of reviews mentioning kids/group trips/pets — not verified
// traveler demographics), computed directly from the raw workbook. Do not
// hand-edit; regenerate via scripts/generate_webpage_map_data.py if the data
// changes.
// ---------------------------------------------------------------------------
const DEMOGRAPHICS = {
  marketWide: {
    n: 719,
    kids: 15.4,
    group: 22.6,
    pet: 10.1,
    other: 51.9,
  },
  byBedroom: [
    { label: "1BR", n: 122, kids: 4.3, group: 0.3, pet: 8.7, other: 86.7 },
    { label: "2BR", n: 161, kids: 12.0, group: 2.5, pet: 15.2, other: 70.2 },
    { label: "3BR", n: 251, kids: 19.7, group: 24.8, pet: 10.9, other: 44.6 },
    { label: "4BR", n: 121, kids: 19.6, group: 46.2, pet: 6.1, other: 28.1 },
    { label: "5BR", n: 51, kids: 21.9, group: 60.1, pet: 4.5, other: 13.5 },
    { label: "6BR+", n: 13, kids: 14.9, group: 71.6, pet: 3.0, other: 10.4 },
  ],
  note: "These are review-derived guest-composition signals (share of reviews mentioning stays with kids, group trips, or pets), not verified traveler demographics. Group-trip share climbs steadily and sharply with size — from near-zero at 1-2BR to 72% at 6BR+ — while stayed-with-kids share rises from 1BR through 5BR then dips slightly at 6BR+. Charlotte's larger-bedroom inventory is overwhelmingly a group-trip product, not a family-vacation-first one.",
};

// Lake buy box's Traveler ICP, as two market-wide/Lakeside-wide/Lakeside-Top-
// 10% comparison bars (charlotte_overview.ipynb's Lakeside region review-
// composition breakout) instead of prose -- reuses DEMOGRAPHICS.marketWide
// as the baseline and adds the two Lakeside-specific populations. Rendered
// by renderLakeIcpCharts() in charts.js.
const LAKE_ICP_DEMOGRAPHICS = {
  groupTrip: { marketWide: DEMOGRAPHICS.marketWide.group, lakesideWide: 26, lakesideTop10: 46 },
  kids: { marketWide: DEMOGRAPHICS.marketWide.kids, lakesideWide: 21, lakesideTop10: 25 },
};

// ---------------------------------------------------------------------------
// Section 3 — Location analysis (map)
// ---------------------------------------------------------------------------
const MAP_CONFIG = {
  dataUrl: "data/listings.json",
  center: [35.223, -80.835],
  zoom: 10,
  stateAbbr: "NC",
  tierColors: { top10: "#b9752b", top25: "#1e3d32", bottom75: "#8b94a3" },
  tierLabels: {
    top10: "Top 10% revenue (market-wide, P90 = $78,801)",
    top25: "Next 15% (top 25% excl. top 10%, P75 = $52,526)",
    bottom75: "Bottom 75%",
  },
  marketInterpretation:
    "The map combines two filters (check both a tier and a region to isolate a slice — e.g. Top 10% + Lakeside): <strong>revenue tier</strong> (Top 10% / Top 25% / Other 75%, market-wide) and <strong>region</strong> — a geography-based split (Downtown / Uptown, Outskirts, Lakeside) from a teammate's independent analysis of the same 719 listings, now the basis for this market's buy-box structure:",
  // One line per region (N, Top 10% hit rate, and the distinguishing trait
  // from charlotte_overview.ipynb's region story text), rendered as a bullet
  // list under the map by renderLocationInterpretation() in render.js.
  regionBullets: [
    "🏙️ <strong>Downtown / Uptown</strong> — the largest region: N=368 (51% of the market), but the weakest performer, 8% reach Top 10% — capped mostly by a smaller-bedroom product mix (51% are 1-2BR).",
    "🏡 <strong>Outskirts</strong> — the broadest region geographically (2.5–14 miles out): N=312, 11% reach Top 10% — the largest pool of big, group-oriented houses, though the region itself is coarse and hides real internal variation.",
    "🌊 <strong>Lakeside</strong> — smallest by count, strongest by far: N=39, 21% reach Top 10% (more than double Downtown's) — geography, not just the waterfront amenity flag, is what earns the premium here.",
  ],
  // No embedded per-buy-box Leaflet comp map is used on this page yet (none
  // of the three current buy boxes are developed enough for one) -- kept as
  // an empty object, not omitted, because map.js reads Object.keys(...) on
  // this at load time.
  fourBrCompCategories: {},
};

// Not used yet (no 1-2BR-equivalent segment map on this page) -- declared as
// an empty stub so map.js's shared code has something defined to reference.
const ONE_TWO_BR_MAP_CONFIG = { tierColors: {}, tierLabelPrefix: {}, compStyle: {} };

// ---------------------------------------------------------------------------
// STR Regulations — a city/county-wide fact, not buy-box-specific, so this
// lives once in Section 5 (see renderRegulationsSection() in render.js),
// not repeated inside every buy-box tab. Category structure (Regulation
// Tier Overall / Permit & Residency / Operating Limits / Investor Notes)
// matches the team's own buy-box template exactly (the same 4 categories
// used in Outskirts' "Charlotte, NC Buy Boxes.docx", left entirely blank
// there). Content is from "Charlotte, NC Overview.pdf" (Short-Term Rental
// Regulatory Due Diligence Report: Charlotte, North Carolina), supplied
// directly by the team. `sources` are the report's named official
// resources; their hyperlink targets weren't extractable from the PDF
// text, so they're listed as plain labels, not linked, rather than
// guessing at a URL.
// ---------------------------------------------------------------------------
const CHARLOTTE_STR_REGULATIONS = {
  tier: "Investor-Friendly",
  tierNote:
    "Charlotte operates under one of the most open municipal regulatory environments for STRs among major U.S. cities. Following North Carolina court precedent, Charlotte removed STR-specific restrictions from its Unified Development Ordinance (UDO) — STRs are treated as standard residential use, not a special category.",
  permitResidency: [
    "Permit / license required? No — $0 to apply, $0/year, no municipal STR registration or licensing at all.",
    "Primary residence required? No — investor-owned, non-owner-occupied STRs are fully permitted.",
  ],
  operatingLimits: [
    "No citywide caps, quotas, unit-per-parcel/owner limits, or distance/radius buffers.",
    "No annual rental-night limit — up to 365 nights/year.",
    "Occupancy: no explicit STR guest cap; the UDO defines a dwelling as serving \"no more than one family\" — implies a ceiling around 6 unrelated adults, regardless of bed count.",
    "Taxes: 8% Mecklenburg County Room Occupancy Tax + 7.25% NC Sales Tax.",
  ],
  investorNotes: [
    "Allowed by-right in every residential/commercial zoning district — no Conditional Use Permit or public hearing.",
    "No permit or license system — no active moratorium or waitlist, and no permit-transfer process at resale.",
    "Required: smoke alarms every unit, ≥1 CO alarm per level, safety equipment verified every 6 months.",
    "Airbnb/Vrbo auto-collect and remit both taxes on platform bookings; direct bookings need a separate NC DOR Certificate of Registration + county tax account.",
    "Private restrictions (HOA covenants, condo bylaws, master leases) can still apply even though the city itself imposes none.",
  ],
  sources: ["Charlotte UDO Portal", "Charlotte Municipal Code (Municode)", "Mecklenburg County Room Occupancy Tax Office"],
};

// BUY_BOXES — ordered by Top 10% hit rate, weakest to strongest: Downtown /
// Uptown, Outskirts, Lake. Region classification is Walid's (see the file
// header comment); hit rates are the OVERALL market's Top 10% threshold
// ($78,801) applied within each region, not a threshold recomputed inside
// each region. None are built out as full deep dives yet — map and
// structure come first, per the team's current call — so all three render
// as "pending" tabs with real N and hit-rate figures, no invented content.
const BUY_BOXES = [
  // ---------------------------------------------------------------------------
  // Downtown / Uptown — the largest region by inventory, the weakest by
  // Top 10% hit rate. Scoped in charlotte_overview.ipynb's region-based
  // buy-box segmentation.
  // ---------------------------------------------------------------------------
  {
    id: "downtown",
    label: "Downtown / Uptown Buy Box",
    status: "pending",
    name: "Charlotte Downtown / Uptown",
    thesis: "The market's largest region by inventory (51% of all listings), but the weakest by Top 10% hit rate — capped mostly by a smaller-bedroom product mix.",
    atAGlance: {
      bedBath: "Any bedroom count (368 listings; 51% are 1-2BR, the highest small-unit share of the three regions)",
      sleeps: "TBD",
      heroMechanism: "TBD",
      revenue: "N=368 listings · 8% reach market Top 10% ($78,801+)",
      primaryRequirement: "TBD",
    },
    // Clearwater's "1. Buy-Box Summary" hero card, reused for pending boxes
    // too (see overviewBlock() in render.js) -- no heroImage yet since no
    // photos have been supplied for this box (renders single-column, no
    // blank media panel).
    overview: {
      statusBadge: "Named and scoped — no photos or deep-dive template supplied yet",
      thesis: "The market's largest region by inventory (51% of all listings), but the weakest by Top 10% hit rate — capped mostly by a smaller-bedroom product mix.",
      whyItWorks:
        "This region wins on inventory scale, not amenity/product fit — 51% of the market's listings sit here, but the same small-unit mix that drives that scale (51% are 1-2BR) also caps its Top 10% hit rate at 8%, the lowest of the three regions.",
      chips: [
        { label: "51% of market inventory (N=368)" },
        { label: "51% are 1-2BR" },
        { label: "8% reach Top 10%" },
      ],
      revenueChips: [
        { label: "Top 10% threshold", value: "$78,801+" },
        { label: "Highest single listing", value: "$199,741" },
      ],
    },
    pendingNote:
      "Downtown / Uptown is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=368, the market's largest single region (51% of all 719 listings), but the lowest Top 10% hit rate of the three (8%), driven mostly by a smaller-bedroom product mix (51% of Downtown listings are 1-2BR, vs. 27% in Outskirts and 33% in Lakeside). It still produces the single highest-revenue listing in the market (\"Spacious 8BR Duplex, Sleeps 20, Walk to Breweries,\" $199,741). Full deep-dive analysis (comp sets, revenue tiering, amenity evidence, buy-box template) has not been built yet.",
  },

  // ---------------------------------------------------------------------------
  // Outskirts — the broadest region geographically and the largest pool of
  // big-bedroom inventory, but intentionally coarse (see the notebook's own
  // caution about internal variation). Property Profile through Projections
  // below is a teammate's (Walid's) own buy-box research -- see
  // ../Outskirts/readme.txt for the folder-to-section source mapping.
  // ---------------------------------------------------------------------------
  {
    id: "outskirts",
    label: "Outskirts Buy Box",
    status: "pending",
    name: "Charlotte Outskirts",
    thesis: "The broadest region geographically (2.5–14 miles from Uptown) and the largest pool of big, group-oriented houses — Top 10% hit rate roughly climbs with that size mix.",
    atAGlance: {
      bedBath: "4+ bedrooms · 3+ bathrooms (5BR is the single most common count among the region's Top 10% listings)",
      sleeps: "10+ minimum, ideally 16 — the two most common sleep counts among Top 10% listings",
      heroMechanism: "Group-trip volume — business conventions, sports events, and bachelor/bachelorette parties, not a lake or view amenity",
      revenue: "N=312 listings · 11% reach market Top 10% ($78,801+)",
      primaryRequirement: "4+ bedrooms and 3+ bathrooms — see Property Profile below for the size-distribution evidence",
    },
    // Clearwater's "1. Buy-Box Summary" hero card, reused for pending boxes
    // too (see overviewBlock() in render.js). heroImage borrows one of
    // Walid's own Architecture reference photos (see Property Profile
    // below) since none of his material is a dedicated "hero" shot.
    overview: {
      statusBadge: "Teammate-supplied buy-box research — Alexandria comp-set links and acquisition underwriting pending",
      thesis: "The broadest region geographically (2.5–14 miles from Uptown) and the largest pool of big, group-oriented houses — Top 10% hit rate roughly climbs with that size mix.",
      whyItWorks:
        "Outskirts has the market's largest pool of big-bedroom inventory (32% are 4BR+), and Walid's own analysis of its Top 10% listings (N=32) found the demand is group-trip and business-travel driven, not lake- or view-driven — concentrated in the eastern half of the metro, empty to the west.",
      heroImage: photo("outskirts/architecture/modern-black-board-batten-cube.jpg", "Two-story home with dark charcoal vertical wood siding and angular flat-roof geometric massing, set among trees", "One of the two acceptable architectural styles for this buy box — see Architectural Style below."),
      chips: [
        { label: "4+ bedrooms · 3+ bathrooms" },
        { label: "Sleeps 10+, ideally 16" },
        { label: "Group-trip / business-travel ICP" },
      ],
      revenueChips: [
        { label: "N=312 listings", value: "11% reach Top 10%" },
        { label: "Revenue Potential", value: "$95k–120k" },
      ],
    },

    // Sourced from a teammate's (Walid's) own buy-box research: a filled-in
    // copy of this same team's buy-box template ("Charlotte, NC Buy
    // Boxes.docx") plus a photo/chart folder (../Outskirts/, readme.txt
    // there maps every folder to a section) -- not an independent notebook
    // analysis the way Lake's is. Presentation flow mirrors Lake's own
    // pendingSections mechanism and grouping exactly (same component
    // vocabulary: groupTitle/title/body/items/images/charts/chartsRow/
    // ranked/mapEmbed), extended with 3 groups Lake's page doesn't have
    // (Comp Set's Design/Revenue split, Analyst Notes, Projections) because
    // Walid's own material covers real content there that Lake's doesn't
    // yet have -- "add the extra content... use everything he provided."
    pendingSections: [
      { groupTitle: "Property Profile" },
      {
        title: "Bedrooms & Bathrooms",
        body:
          "<p><strong>4+ bedrooms, 3+ bathrooms.</strong> Among the region's Top 10% listings (N=32, $82,516–$150,606), 5BR is the single most common bedroom count (16 of 32) and 2.5–3.5 baths covers the bulk of the set (25 of 32) — see the size and revenue-by-size evidence below.</p>",
        chartsRow: [
          photo("outskirts/charts/size_distribution_chart.png", "Bedroom, sleeps, and bathroom count histograms for Outskirts' Top 10% revenue listings", "Bedroom/sleeps/bathroom distribution across Outskirts' Top 10% listings (N=32, $82,516–$150,606) — from Walid's own analysis."),
          photo("outskirts/charts/revenue_size_box_plots.png", "Box plots of revenue potential by bedroom count, sleeps, and bathroom count for Outskirts", "Revenue Potential by bedroom count / sleeps / bathroom count, as box plots — from Walid's own analysis."),
        ],
      },
      {
        title: "Ideal Sleep Count",
        body:
          "<p><strong>10+ minimum, ideally 16.</strong> Sleeps 10 is the single most common capacity among Top 10% listings (10 of 32); sleeps 16 is the next-largest non-trivial cluster (7 of 32) and sits at the top of the revenue range in the box plot above.</p>",
      },
      {
        title: "Architectural Style",
        body:
          "<p>Two acceptable vocabularies: <strong>Traditional / Classic</strong> (brick or vinyl-sided colonials and craftsman-gabled homes) and <strong>Modern Farmhouse / Contemporary Wave</strong> (board-and-batten siding, angular flat or shed rooflines, dark monochrome or cedar-accented exteriors).</p>",
        images: [
          photo("outskirts/architecture/modern-black-board-batten-cube.jpg", "Two-story home with dark charcoal vertical wood siding and angular flat-roof geometric massing, set among trees", "Two-story home clad in dark charcoal vertical board-and-batten siding with an angular, cube-like flat-roof massing and oversized steel-framed windows, exemplifying the Modern Farmhouse / Contemporary Wave style's bold monochrome geometry."),
          photo("outskirts/architecture/modern-farmhouse-dark-gray-duplex.jpg", "Dark gray board-and-batten duplex with steep white-trimmed gables and a black standing-seam metal roof over a shared columned porch", "Dark gray board-and-batten duplex-style new build with steep white-trimmed gable peaks and a black standing-seam metal portico roof over a shared columned porch, a textbook Modern Farmhouse facade."),
          photo("outskirts/architecture/modern-cedar-accent-shed-roof.jpg", "Contemporary two-story house with gray siding, cedar-toned wood accent panels, and an asymmetric sloped roofline, flanked by similar new-build homes", "Contemporary two-story house combining gray fiber-cement siding with warm cedar-toned wood accent panels under an asymmetric shed roofline and dark modern garage door, illustrating the Contemporary Wave half of the style."),
          photo("outskirts/architecture/traditional-white-gabled-dusk-porch.jpg", "White two-story house at dusk with black shutters, dormer-like gables, and a lit covered front porch with red rocking chairs", "White two-story home photographed at dusk with a front-gabled roof, black shutters, brick porch columns, and red rocking chairs on the covered entry porch, representative of the Traditional / Classic Vocabulary style."),
          photo("outskirts/architecture/traditional-taupe-craftsman-gable-timber.jpg", "Large taupe two-story home with a steep front gable, exposed timber brackets over the entry, and a curved driveway on a wooded lot", "Large taupe-sided two-story home with a dramatic steep front gable, exposed timber knee brackets over the entry, dark shutters, and a curved concrete driveway, showing the more craftsman-inflected end of the Traditional / Classic Vocabulary style."),
          photo("outskirts/architecture/traditional-red-brick-colonial-shutters.jpg", "Red brick two-story colonial home with black shutters, a white-columned entry portico with red door, and a side-facing white garage", "Red brick two-story colonial with black shutters, white-trimmed windows, a small white-columned entry portico with a red door, and an attached side-facing white garage, a clear example of the Traditional / Classic Vocabulary style."),
          photo("outskirts/architecture/traditional-white-vinyl-gable-porch-dusk.jpg", "White vinyl-sided two-story house at dusk with a covered front porch furnished with blue rocking chairs and an attached two-car garage", "White vinyl-sided two-story home at dusk with a front-gabled roof, black shutters, brick watertable, and a covered front porch furnished with blue rocking chairs beside an attached two-car garage, another instance of the Traditional / Classic Vocabulary style."),
        ],
      },
      {
        title: "Backyard Size",
        body:
          "<p>Large enough for shaded outdoor dining, a pool, and a fire pit — the combination Top 10% backyards tend to have, not any single feature alone.</p>",
        images: [
          photo("outskirts/backyard/fenced-pool-deck-pergola-lounge.jpg", "Rectangular in-ground pool enclosed by a white safety fence, with a wood deck in the foreground, a palm tree, and a covered pergola with sectional lounge seating in the background of a wooded backyard.", "Fenced in-ground pool with a raised deck and a separate pergola-covered lounge seating area, showing the pool and shaded-seating components of the required backyard on one wooded lot."),
          photo("outskirts/backyard/aerial-firepit-seating-hot-tub-yard.jpg", "Aerial nighttime view of a fenced backyard with a lit in-ground hot tub on a side patio and a separate gravel seating area with a rectangular fire pit surrounded by lounge chairs.", "Aerial night shot of a grass backyard showing a built-in fire pit ringed by lounge chairs on one side and a hot tub on the patio, but no pool or dining table visible."),
          photo("outskirts/backyard/aerial-lap-pool-spa-dining-deck.jpg", "Aerial daytime view of a narrow backyard between neighboring houses with a long lap pool, an attached spa, lounge chairs on a white paved patio, and a raised wood deck with an outdoor dining table under a pergola.", "Aerial view of a narrow modern backyard combining a lap pool with attached spa, poolside lounge chairs, and a pergola-covered outdoor dining table on the upper deck, with a turf strip alongside but no dedicated fire pit visible."),
        ],
      },

      { groupTitle: "Amenities" },
      {
        title: "Amenity Prevalence",
        body:
          "<p>Outdoor Dining Area (71.9%) and Fire Pit (65.6%) are the two highest-penetration amenities among Top 10% listings — both are Must-Haves below. Game Room (50.0%) and its Pool Table (25.0%) are mid-penetration, not universal; Workspace isn't a flagged amenity in this dataset at all (see Analyst Notes) but is called out as a Must-Have on staging/photography grounds. Pool (28.1%) and Hot Tub (34.4%) are this buy box's two Nice-to-Haves, ranked below by revenue uplift.</p>",
        charts: [
          photo("outskirts/charts/amenity_penetration.png", "Horizontal bar chart of amenity penetration percentages across Outskirts' Top 10% listings", "Amenity penetration across Top 10% listings — from Walid's own analysis."),
        ],
      },
      {
        title: "Must-Have's",
        body:
          "<p>Two of the ten photos below were filed under Walid's \"Nice-to-haves\" folder but actually show a game room and a fire pit — placed here by what's actually in the photo, not by source folder.</p>",
        items: ["Game Room with Pool Table", "Workspace", "Fire Pit", "Outdoor Dining Area"],
        images: [
          photo("outskirts/musthaves/game-room-pool-table-disco-ball-neon-lounge.jpg", "Basement game room with a pool table, disco ball, arcade cabinets, and a neon sign reading 'A little party never killed nobody'", "Basement game room centered on a pool table with racked balls, backed by arcade cabinets, a disco-ball cluster, and teal lounge seating."),
          photo("outskirts/musthaves/game-room-pool-table-dartboard-garage-mural.jpg", "Converted garage game room with a pool table in the foreground and a dartboard, cue rack, and bar stools against a geometric black-and-white mural", "Garage game room with a racked pool table, wall-mounted dartboard and cue rack, and bar stools set against a bold geometric mural."),
          photo("outskirts/musthaves/workspace-desk-nook-green-wall-balcony.jpg", "Home office nook with a wood desk and green chair set into a green accent wall with cork boards, next to sliding glass doors to a balcony", "Built-in desk nook with a wood writing desk, task chair, and cork pin-boards, located beside sliding glass doors that open to a balcony."),
          photo("outskirts/musthaves/fire-pit-adirondack-chairs-backyard-charlotte-mural.jpg", "Backyard fire pit surrounded by teal Adirondack chairs at dusk, with string lights, a basketball court, and a mural referencing Charlotte", "Backyard fire pit ringed by teal Adirondack chairs at dusk, with string lights and a backyard basketball court in the background."),
          photo("outskirts/musthaves/game-room-pool-table-pacman-arcade-checkered-wall.jpg", "Game room with a pool table, a yellow Pac-Man arcade cabinet, a shuffleboard table, and a blue-and-white checkered accent wall with a bar and TV", "Game room featuring a pool table, a Pac-Man arcade cabinet, a shuffleboard table, and a bar area with a TV against a checkered accent wall."),
          photo("outskirts/musthaves/game-room-pool-table-black-striped-rug-lounge.jpg", "Game room with a black pool table on a black-and-white striped rug, a dartboard, an arcade cabinet, and an orange sofa lounge area", "Game room with a black pool table racked and ready on a striped rug, flanked by a dartboard, arcade cabinet, and an adjoining sofa lounge."),
          photo("outskirts/musthaves/outdoor-dining-table-umbrella-brick-patio.jpg", "Outdoor wood dining table with place mats set for six under a large umbrella, surrounded by wicker chairs on a brick patio", "Outdoor dining table set with place mats for six diners under a market umbrella, ringed by wicker chairs on a brick patio."),
          photo("outskirts/musthaves/workspace-round-table-bookshelves-blue-study.jpg", "Home office study with a round sculptural wood table and chair flanked by two bookshelves full of books, under a starburst light fixture on a blue wall", "Study/workspace with a sculptural round wood table and task chair flanked by bookshelf towers, set against a deep blue accent wall."),
          photo("outskirts/nicetohaves/game-room-billiards-foosball-charlotte-decor.jpg", "Indoor game room with a black billiards table, foosball table, wall-mounted mini basketball hoop, wall-mounted TV, and Charlotte skyline wall art on a brick accent wall", "Indoor game room with a billiards (pool) table, foosball table, and mini basketball hoop — this is a game-room pool table, not the swimming pool amenity, and no hot tub appears here."),
          photo("outskirts/nicetohaves/aerial-sport-court-firepit-backyard.jpg", "Aerial view of a red and light-blue backyard multi-sport court labeled 'THE WEEKENDER CLT' with basketball and pickleball lines, next to a gravel fire pit area with teal Adirondack chairs", "Aerial view of a custom backyard basketball/pickleball sport court and an adjacent fire pit lounge area — neither a swimming pool nor a hot tub is visible in this photo."),
        ],
      },
      // Nice-to-Have, Ranked -- same Clearwater-style structure Lake uses,
      // but Walid's own analysis only quantified a bare revenue-uplift %
      // per item (no score/hit-rate-uplift/N the way Lake's composite score
      // has) -- niceToHaveRankedItem() renders whichever stats are actually
      // present rather than fabricating the rest.
      {
        ranked: {
          note: "Only two nice-to-have amenities were quantified in Walid's analysis, both by revenue uplift alone — shown at full weight below despite there being no independent score/hit-rate-uplift/N figures the way Lake's composite score has.",
          items: [
            {
              name: "Pool",
              revenueUplift: "+41.7%",
              note: "The higher-uplift of the two nice-to-haves, despite lower Top 10% penetration (28.1%) than Hot Tub — real upside if added.",
              images: [
                photo("outskirts/nicetohaves/kidney-pool-yellow-umbrellas-patio.jpg", "Kidney-shaped in-ground swimming pool with a stone-edged patio, three yellow market umbrellas, lounge chairs, and a green kamado grill, surrounded by trees", "Kidney-shaped in-ground pool with a sun-deck patio, yellow umbrellas, and lounge chairs overlooking a wooded backyard."),
              ],
            },
            {
              name: "Hot Tub",
              revenueUplift: "+21.5%",
              note: "Lower uplift than Pool, but already the more common of the two at 34.4% Top 10% penetration.",
              images: [
                photo("outskirts/nicetohaves/hot-tub-dusk-steam-sauna-cabin.jpg", "In-ground hot tub with illuminated jets and rising steam at dusk, beside a lit wooden outdoor sauna cabin and cushioned lounge seating", "Hot tub with glowing jets and rising steam photographed at twilight, positioned beside a private cedar sauna cabin and an outdoor lounge seating area."),
              ],
            },
          ],
        },
      },

      { groupTitle: "Geo Considerations" },
      {
        title: "View, Waterfront & Privacy / Seclusion",
        body:
          "<p><strong>View and Waterfront: n/a</strong> — per Walid's own analysis, neither is a defining feature of this region. <strong>Privacy / Seclusion:</strong> Outskirts properties usually sit in ordinary neighborhoods, not isolated lots — a fenced backyard is the practical way to create privacy here, not lot selection. Map below: toggle Outskirts to see the region's own footprint alongside its landmarks.</p>",
        mapEmbed: {
          url: "assets/overview/charlotte_overview_map.html",
          title: "Interactive map — Outskirts properties, revenue tiers, and demand-driver landmarks",
        },
      },

      { groupTitle: "Property Locations" },
      {
        title: "Ideal Location(s) & Popular Places",
        body:
          "<p><strong>Exclude central/uptown Charlotte.</strong> Per Walid's analysis, listings generating $80k+ concentrate in the eastern half of the Charlotte metro — from just north of Uptown down through the southeast suburbs — with almost nothing to the west (Belmont, Mount Holly, Lowell, Tega Cay, and Fort Mill are all empty). See the map above for how that overlays this site's own region boundaries, and Walid's own location map below for his original evidence.</p><p><strong>Popular Places:</strong> NASCAR Hall of Fame, Carowinds, Discovery Place Science, and Uptown itself (museums, restaurants, entertainment) are the draws named in Walid's analysis — none of them lake- or view-driven, consistent with the group-trip/business-travel ICP below.</p>",
        charts: [
          photo("outskirts/charts/ideal_locations_map.png", "Dark-themed map of the Charlotte metro with red dots marking ideal property locations concentrated in the eastern half", "Ideal property locations across the Charlotte metro, sized by revenue — concentrated east of Uptown, essentially empty to the west (Mount Holly/Belmont/Lowell/Tega Cay/Fort Mill). From Walid's own analysis."),
        ],
      },

      { groupTitle: "Traveler Demographics" },
      {
        title: "Traveler ICP",
        body:
          "<p><strong>Primary: Group Trip.</strong> Guests here are people attending business conventions, sports events, and bachelor/bachelorette parties — not a family-vacation or couples-getaway ICP.</p>",
        charts: [
          photo("outskirts/charts/traveler_icp_pie_chart.png", "Pie chart of average review composition across all Outskirts listings: 49.2% group trip, 24.8% stayed with kids, 7.8% stayed with a pet, 18.1% other", "Average review composition, all Outskirts listings (not Top-10%-segmented) — 49.2% group trip, the largest single share. From Walid's own analysis."),
        ],
      },

      { groupTitle: "Comp Set" },
      {
        title: "Design Comp Set",
        body:
          "<p>Alexandria Design Comp Set link: pending — not yet supplied. Photos below show ten of Outskirts' top-performing comps by interior/exterior design, from Walid's own comp research.</p>",
        images: [
          photo("outskirts/topdesigns/olive-green-primary-bedroom-tray-ceiling.avif", "Olive green primary bedroom with white bouclé headboard and globe pendant lights", "Primary bedroom with olive-green walls, a wood-textured green accent wall, a tray ceiling, globe pendant sconces flanking a white bouclé headboard, a curved black bench, and a chevron-pattern area rug."),
          photo("outskirts/topdesigns/pergola-deck-pool-view-dining.avif", "Wood pergola-covered deck with a dining table overlooking a backyard lap pool", "Elevated wood pergola dining deck strung with string lights, looking down over a narrow turf-and-tile lap pool and lounge chairs in a wooded backyard."),
          photo("outskirts/topdesigns/white-built-in-desk-nook-moodboard.avif", "White built-in desk with matching drawer towers and a bouclé arch-back chair", "White built-in desk flanked by matching multi-drawer towers, centered on a bouclé arch-back chair and styled with a cork mood board and a grid of framed prints on the wall."),
          photo("outskirts/topdesigns/terracotta-office-nook-rattan-lamp.avif", "Small desk nook against a terracotta wall with a woven rattan lamp", "Corner desk nook against a terracotta/rust accent wall, pairing a white sit-stand desk with a woven rattan mushroom-shade lamp and an abstract framed painting."),
          photo("outskirts/topdesigns/living-room-mauve-pouf-ottomans-fluted-table.avif", "Living room with gray sofa, mauve velvet ottomans, and a round fluted coffee table", "Living room pairing a gray sofa with twin mauve velvet drum ottomans on brass bases, a round fluted white coffee table, and a brass arc-shaped mirror above a white console table."),
          photo("outskirts/topdesigns/dining-banquette-vintage-photo-gallery-wall.avif", "Curved white banquette dining nook beneath a gallery wall of vintage travel photos", "Curved white bouclé banquette dining nook with a round wood table, black-and-brass leather chairs, a woven drum pendant light, and a gallery wall of framed vintage travel snapshots with handwritten captions."),
          photo("outskirts/topdesigns/coffee-bar-condiment-drawer-organizer.webp", "Built-in drawer organizer stocked with coffee pods, creamers, and sweeteners", "Close-up of a built-in coffee station drawer neatly organized with K-cups, single-serve creamers, sweetener packets, and Nespresso capsules for guest self-service."),
          photo("outskirts/topdesigns/sculptural-wood-hand-stools-home-bar.jpeg", "Home bar corner with sculptural wood hand-shaped stools and a brass globe floor lamp", "Corner wet bar with a faceted black wood counter, sculptural carved-wood 'hand' bar stools, and a tall brass floor lamp of stacked glass globes beside a monstera plant."),
          photo("outskirts/topdesigns/green-wallpaper-bedroom-ribbed-nightstand.avif", "Bedroom nightstand with green textured wallpaper and a globe pendant light", "Bedroom vignette with textured green wallpaper, a globe pendant light over a sculptural ribbed-wood nightstand, and a breakfast tray of berries and a mimosa on the bed."),
          photo("outskirts/topdesigns/aerial-backyard-pool-turf-pergola-deck.avif", "Aerial view of three modern homes sharing a narrow pool and turf lawn between them", "Aerial view of three adjoining modern backyards centered on a narrow resort-style lap pool, spa, turf lawn strip, and pergola-covered deck dining area."),
        ],
      },
      {
        title: "Revenue Comp Set — High Tier",
        body: "<p>Alexandria Revenue Comp Set link: pending — not yet supplied.</p>",
        images: [
          photo("outskirts/revenuecomps-high/garage-game-room-pool-table-geometric-mural.jpg", "Converted garage game room with a pool table, dartboard, and bold black-and-white geometric painted walls", "Converted garage game room with a full-size pool table, wall-mounted dartboard, and bar stool seating under a bold black-and-white geometric mural."),
          photo("outskirts/revenuecomps-high/living-room-navy-sofa-bowl-coffee-table.jpg", "Living room corner with a navy sofa, white boucle armchair, large potted plant, and a rounded white coffee table facing a mounted TV", "Living room seating area with a navy sofa, boucle accent chair, and sculptural bowl-shaped coffee table arranged around a wall-mounted TV on a fluted media console."),
          photo("outskirts/revenuecomps-high/dining-room-floral-wallpaper-round-table.jpg", "Dining room with navy floral wallpaper, a round table set for six, and gold curtains opening to a screened porch", "Formal dining room with navy hydrangea wallpaper and a round table set for six, opening through gold drapes onto a furnished screened porch."),
          photo("outskirts/revenuecomps-high/backyard-pool-diving-board-wooded-lot.jpg", "Large in-ground backyard pool with a diving board, red lounge chairs, and a white farmhouse-style home surrounded by trees", "Large in-ground pool with a diving board and red lounge chairs set on a wooded lot behind a white farmhouse-style home with a screened porch and deck."),
          photo("outskirts/revenuecomps-high/basement-game-room-pool-table-shuffleboard-arcade.jpg", "Dark-walled basement game room with a pool table, shuffleboard table, dartboard, and arcade cabinets", "Basement entertainment room combining a pool table, shuffleboard table, dartboard, and arcade game cabinets alongside a mustard sofa."),
          photo("outskirts/revenuecomps-high/bedroom-queen-city-vibes-neon-mural.jpg", "Themed bedroom with a colorful Charlotte-doors mural, a pink neon Queen City Vibes sign, and a mustard velvet upholstered bed with sofa-arm sides", "Charlotte-themed bedroom with a hand-painted rowhouse-door mural, a glowing 'Queen City Vibes' neon sign, and a mustard velvet upholstered bed frame."),
          photo("outskirts/revenuecomps-high/bedroom-blue-accent-wall-orange-bedding.jpg", "Bedroom with a light blue textured accent wall, a king bed with orange and navy pillows, and a multicolor abstract area rug", "Bedroom with a light-blue grasscloth accent wall behind the headboard, orange and navy accent pillows, and a bold multicolor abstract area rug."),
          photo("outskirts/revenuecomps-high/sitting-room-french-doors-blue-chaise-chairs.jpg", "Small sitting room accessed through white French doors, with two navy blue chaise lounge chairs flanking a white writing desk", "Flex sitting room entered through glass-paned French doors, furnished with a pair of navy velvet chaise lounge chairs and a small white writing desk."),
          photo("outskirts/revenuecomps-high/aerial-view-house-pool-wooded-lot.jpg", "Aerial drone view of a house with a red metal roof accent, in-ground pool, and patio surrounded by dense mature trees", "Aerial view showing the property's in-ground pool, patio, and red-roofed home tucked into a heavily wooded, private lot."),
          photo("outskirts/revenuecomps-high/entryway-mustard-floral-wallpaper-desk.jpg", "Alcove with bold mustard and cream floral wallpaper, a wood writing desk, navy blue chair, and a tall potted tree", "Entry alcove featuring bold mustard floral wallpaper as a design statement behind a wood writing desk, navy accent chair, and potted tree."),
        ],
      },
      {
        title: "Revenue Comp Set — Mid Tier",
        images: [
          photo("outskirts/revenuecomps-mid/fenced-backyard-suburban-two-story.jpg", "Large fenced backyard behind a tan two-story house, with a storage shed and tree line at the back edge of the lawn", "Rear yard of a tan two-story suburban home with a fully fenced grass lawn, a covered grill, and a storage shed backing onto wooded tree cover."),
          photo("outskirts/revenuecomps-mid/foyer-staircase-wrought-iron-loft.jpg", "Two-story entry foyer with a dark wood staircase, wrought iron railing, and an open loft landing above overlooking the hallway", "Two-story foyer with a dark hardwood staircase and wrought-iron balusters leading up to an open loft landing above the entry hall."),
          photo("outskirts/revenuecomps-mid/log-cabin-bedroom-king-bed-desk.jpg", "Log cabin bedroom with a king bed with white bedding, wood beam ceiling fan, blue curtains, and a small desk with an office chair", "Log-walled primary bedroom with a king bed, white bedding, and a corner desk with office chair set beneath large forest-view windows."),
          photo("outskirts/revenuecomps-mid/log-cabin-open-kitchen-dining.jpg", "Open kitchen and dining area in a log cabin with white cabinetry, stainless steel refrigerator, wood beam ceiling, and a wooden dining table with mismatched chairs", "Open kitchen-dining great room in a log cabin, with a white cabinet island, stainless fridge, exposed wood beam ceiling, and a farmhouse-style dining table seating six."),
          photo("outskirts/revenuecomps-mid/bathroom-marble-shower-gold-fixtures.jpg", "Bathroom with a walk-in marble-tiled shower, gold hardware, dark navy vanity cabinet, and a gold-framed mirror", "Renovated bathroom featuring a walk-in marble-tile shower with gold fixtures and a navy vanity topped with white quartz and gold hardware."),
          photo("outskirts/revenuecomps-mid/outdoor-pergola-kitchen-gazebo-bar.jpg", "Concrete patio in a wooded lot with a pergola-covered outdoor kitchen on one side and a gazebo with bar seating on the other", "Outdoor entertaining patio with a pergola-covered built-in grill kitchen and a separate gazebo with bar-height table seating, set among trees on a wooded lot."),
          photo("outskirts/revenuecomps-mid/log-cabin-exterior-gambrel-roof-deck.jpg", "Log cabin style house exterior with a gambrel roof, attached two-car garage, wood deck with stairs, and gravel driveway surrounded by trees", "Front exterior of a log-sided cabin home with a gambrel roof, attached garage, and a covered wood entry deck on a wooded, gravel-drive lot."),
          photo("outskirts/revenuecomps-mid/modern-kitchen-waterfall-island-hood.jpg", "Modern kitchen with a white quartz waterfall-edge island, stainless range hood and cooktop, and stainless refrigerator, opening to a dining and living area", "Modern white kitchen with a quartz waterfall island, stainless cooktop and vent hood, opening onto a dining table and living area beyond."),
          photo("outskirts/revenuecomps-mid/bedroom-gray-upholstered-bed-rug.jpg", "Bedroom with a gray upholstered bed frame, gray comforter, patterned area rug, and geometric cube-pattern wall art", "Bedroom furnished with a gray upholstered bed, matching nightstands with lamps, and a large geometric-print canvas on the wall above a patterned area rug."),
        ],
      },
      {
        title: "Revenue Comp Set — Low Tier",
        body: "<p>The counterexamples — what underperforming comps in this region tend to look like: sparser furnishing, dated finishes, undeveloped yards despite available space.</p>",
        images: [
          photo("outskirts/revenuecomps-low/night-firepit-plastic-chairs-shed.jpg", "Backyard fire pit at night surrounded by white plastic lawn chairs, a storage shed, and a wood privacy fence.", "Nighttime fire-pit seating area furnished with mismatched white plastic lawn chairs beside a metal storage shed, reflecting a lower-budget backyard setup."),
          photo("outskirts/revenuecomps-low/sparse-living-room-empty-back-room.jpg", "Living room with a small green loveseat, round coffee table, and wood floors opening into a mostly empty adjoining room.", "Underfurnished living room holding only a compact loveseat and coffee table, opening into an almost bare secondary room with no seating."),
          photo("outskirts/revenuecomps-low/garage-converted-game-room.jpg", "Garage converted into a game room with a foosball table and ping pong table, garage door open to the driveway.", "Game room set up inside an unfinished two-car garage with exposed concrete floor and wire shelving still visible, rather than a dedicated finished bonus room."),
          photo("outskirts/revenuecomps-low/traditional-primary-bedroom-dated-ensuite.jpg", "Primary bedroom with a dark wood four-poster bed, light blue walls, carpet, and a glimpse of a dated ensuite bathroom.", "Traditional four-poster bedroom set on wall-to-wall carpet with a visibly dated ensuite bathroom showing tan tile and gold-toned fixtures through the open door."),
          photo("outskirts/revenuecomps-low/aerial-large-underused-backyard.jpg", "Aerial view of a large fenced backyard behind a row of townhomes, mostly open grass with minimal furniture.", "Drone shot of an oversized fenced backyard that sits largely undeveloped, holding only a few chairs and a small fire pit despite the available space."),
          photo("outskirts/revenuecomps-low/living-room-charlotte-skyline-mural.jpg", "Living room with people relaxing, a blue velvet sectional, and a large mural of the Charlotte skyline on the accent wall.", "Living room whose main design feature is a painted Charlotte-skyline mural wall paired with a blue velvet sectional and generic gray armchair."),
          photo("outskirts/revenuecomps-low/brick-ranch-exterior-bare-trees.jpg", "Single-story brick ranch house exterior viewed between two bare tree trunks, with a dark shingle roof.", "Compact single-story brick ranch home shot through bare winter trees, with a plain mulched yard dominating the foreground and little curb appeal."),
          photo("outskirts/revenuecomps-low/sunroom-recliners-vinyl-flooring.jpg", "Enclosed sunroom porch with three brown recliner chairs, a striped rug, and windows overlooking a wood privacy fence.", "Screened-in sunroom furnished with three matching brown recliners and vinyl plank flooring, with windows facing directly into a neighboring wood fence."),
          photo("outskirts/revenuecomps-low/bedroom-iron-bed-modern-neutral.jpg", "Bedroom with a black wrought iron bed frame, neutral white bedding, wood floors, and a black leather accent chair.", "Simply furnished neutral-toned bedroom with an iron bed frame and a small floating wood nightstand, modest in scale compared to higher-tier comps."),
          photo("outskirts/revenuecomps-low/cramped-living-dining-kitchen-combo.jpg", "Combined living and dining area with gray armchairs, a dark wood dining table, and a galley kitchen visible in the background.", "Tight open-plan living/dining/kitchen combo with mismatched dining chairs and a small pale coffee table crowded close to the seating area."),
          photo("outskirts/revenuecomps-low/deck-hot-tub-vinyl-siding.jpg", "Built-in hot tub on a wood deck against white vinyl siding, with a plain gravel and mulch yard behind it.", "Deck-mounted hot tub with a worn blue liner set against bare vinyl siding and an unlandscaped side yard."),
          photo("outskirts/revenuecomps-low/backyard-firepit-sport-court-no-pool.jpg", "Backyard fire pit with lime green Adirondack chairs next to a blue-surfaced sport court, no pool in view.", "Backyard amenity area centered on a fire pit and a painted multi-sport court, with inflatable pool flamingos sitting on the ground but no actual pool present."),
        ],
      },

      { groupTitle: "Analyst Notes" },
      {
        title: "Notes / Insights",
        body:
          "<ul><li><strong>Spacious over sleep count:</strong> properties generating $90k+ maintain a spacious look — prioritize that over pushing for more sleep count.</li><li><strong>Business travelers:</strong> a good share of guests come for business conventions — ensure a dedicated workspace and showcase it in listing photos.</li><li><strong>Kitchen island:</strong> a large kitchen is consistent across top listings — include an island that also seats more guests.</li><li><strong>Palette:</strong> modern all-white, or white plus one or two accent colors; fixtures should match. Prioritize lighter accent colors for a larger, more spacious look.</li></ul>",
        images: [
          photo("outskirts/notes/colorful-bedroom-mustard-sofa-spacious.jpg", "Large bedroom with a white bed topped with orange and navy pillows, a colorful striped area rug, and a mustard-green sofa against a white wall.", "Oversized bedroom devotes floor space to a separate mustard-green sofa seating area rather than an extra bed, reflecting top listings' priority on a spacious feel over maximizing sleep count."),
          photo("outskirts/notes/vaulted-ceiling-living-room-windows.jpg", "Living room with a two-story wall of windows overlooking trees, a light gray sofa, a wood media console with wall-mounted TV, and wicker dining chairs.", "Great room with double-height windows and an open, airy floor plan illustrates the spacious layout that top-performing listings favor over cramming in more beds."),
          photo("outskirts/notes/log-cabin-kitchen-island-dining.jpg", "Rustic log-cabin kitchen with a white quartz island, stainless refrigerator, and an open dining area with a wood table seating eight under exposed beams.", "Large white kitchen island with a bar stool opens directly onto an eight-person dining table, matching the pattern of top listings featuring a bigger island with more seating."),
          photo("outskirts/notes/open-concept-kitchen-blue-barstools.jpg", "Open-concept living and kitchen area with a gray sectional sofa, purple accent chair, bold patterned wallpaper accent wall, and three blue stools at a kitchen island.", "Kitchen island with three blue counter stools opens onto the living room, showing island seating for extra guests, though the multicolor palette departs from a white-plus-one-accent scheme."),
          photo("outskirts/notes/dining-table-navy-chairs-patterned-wall.jpg", "Dining room with a long white table, navy blue chairs, a bold orange-and-navy fan-pattern accent wall, and a white-cabinet kitchen visible beyond.", "Long dining table seating eight sits beside a white-cabinet kitchen, showing generous group seating, though the bold patterned accent wall is not the white-plus-single-accent look."),
          photo("outskirts/notes/floral-wallpaper-living-room-navy-curtains.jpg", "Living room with a bold mustard floral accent wall, navy curtains, heron bird artwork, and a beige sectional sofa on a striped rug.", "Living room built around a bold mustard floral accent wall and layered patterned textiles, a maximalist palette that contrasts with the white/light-plus-accent look top listings favor."),
          photo("outskirts/notes/bedroom-with-desk-workspace-blue-wallpaper.jpg", "Primary bedroom with a navy leaf-pattern accent wall, blue swivel chairs, a ceiling fan, and a desk with an office chair visible in the background near a fireplace.", "Spacious primary suite includes a dedicated desk and office chair tucked beyond the fireplace, directly illustrating the visible-workspace insight for business travelers."),
          photo("outskirts/notes/neutral-sitting-room-wine-cabinet.jpg", "Sitting room with taupe walls, a gray swivel accent chair, a wood wine-storage cabinet, a large abstract canvas, and a full-length leaning mirror.", "Uncluttered flex sitting room with dark hardwood floors and sparse furnishings shows the open, spacious feel prioritized over packing in more furniture or beds."),
          photo("outskirts/notes/grand-dining-room-capiz-chandeliers-seats-twelve.jpg", "Large dining room with two capiz-shell chandeliers over a long wood table set for twelve with woven rattan chairs and a green area rug.", "Dining room seats twelve at a single long table under a tray ceiling, exemplifying the spacious, group-friendly layout that top listings emphasize over squeezing in extra sleeping capacity."),
          photo("outskirts/notes/white-kitchen-black-accent-fixtures.jpg", "Modern galley kitchen with white wood-grain cabinets, white quartz countertops, black pendant lights, a black faucet, a black range hood, and a wine-and-cheese spread on the island.", "White cabinetry and countertops paired with matching black pendant lights, faucet, and range hood exemplify the all-white-plus-one-accent-color palette with coordinated fixtures."),
          photo("outskirts/photography/pickleball-court-friends-golden-light.avif", "Four women laughing together while holding colorful pickleball paddles on an outdoor court, with a blurred background of blue Adirondack chairs and people lounging.", "Four women laughing over pickleball paddles on a backyard court, shot with a shallow depth of field that blurs the background lounge area and keeps warm sunlight and genuine candid expressions sharp on the subjects."),
          photo("outskirts/photography/aerial-drone-pool-house-treeline.jpeg", "Overhead drone photo of a house with a rectangular pool and patio, surrounded by a dense tree canopy.", "Straight-down drone shot of the house, pool, and patio nestled in mature trees, using an aerial angle to convey the full lot layout and privacy that a ground-level photo could not capture."),
          photo("outskirts/photography/bedroom-nightstand-vignette-warm-globe-light.avif", "Styled bedroom nightstand vignette with a sculptural ribbed wood dresser, a two-tier glass globe pendant light, a snake plant, and a white upholstered headboard with a breakfast tray of berries and a drink.", "Close-up styled vignette of a sculptural ribbed nightstand beside a white boucle headboard, pairing a warm globe pendant against cool green textured wallpaper and a staged breakfast tray to create an inviting, magazine-style composition."),
        ],
      },

      { groupTitle: "Projections" },
      {
        title: "Revenue Potential & Candidate Listings",
        body:
          "<p><strong>Revenue Potential:</strong> $95k–120k. <strong>Purchase Price:</strong> ~$500k (Walid's own working estimate; no underwriting examples supplied yet).</p><p><strong>Candidate listings found (Zillow):</strong></p><ul>" +
          "<li><a href=\"https://www.zillow.com/homedetails/7323-Neal-Rd-Charlotte-NC-28262/338431200_zpid/\" target=\"_blank\" rel=\"noopener\">7323 Neal Rd, Charlotte, NC 28262 ↗</a></li>" +
          "<li><a href=\"https://www.zillow.com/homedetails/7319-Neal-Rd-Charlotte-NC-28262/2063448195_zpid/\" target=\"_blank\" rel=\"noopener\">7319 Neal Rd, Charlotte, NC 28262 ↗</a></li>" +
          "<li><a href=\"https://www.zillow.com/homedetails/3021-Cresthill-Dr-Charlotte-NC-28212/6252220_zpid/\" target=\"_blank\" rel=\"noopener\">3021 Cresthill Dr, Charlotte, NC 28212 ↗</a></li>" +
          "<li><a href=\"https://www.zillow.com/homedetails/8016-Painted-Pony-Ct-Charlotte-NC-28269/6144340_zpid/\" target=\"_blank\" rel=\"noopener\">8016 Painted Pony Ct, Charlotte, NC 28269 ↗</a></li>" +
          "<li><a href=\"https://www.zillow.com/homedetails/4432-Woodwind-St-Charlotte-NC-28213/339867125_zpid/\" target=\"_blank\" rel=\"noopener\">4432 Woodwind St, Charlotte, NC 28213 ↗</a></li>" +
          "</ul>",
      },
    ],

    pendingNote:
      "Outskirts is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=312, the broadest region geographically (2.5–14 miles from Uptown, mean 7.1 miles) and the market's largest pool of big-bedroom (4BR+) inventory (32%), 11% Top 10% hit rate. Note: this region is intentionally coarse — it spans everything from close-in SouthPark-adjacent ZIPs to far exurbs, and likely hides real internal variation a finer cut would separate out (see the notebook's own caution in \"Tying It Together\"). The content above (Property Profile through Projections) is a teammate's (Walid's) own buy-box research, not this notebook — see ../Outskirts/readme.txt for full source/provenance.",
  },

  // ---------------------------------------------------------------------------
  // Lake — promoted from a thin, amenity-flag-only "bonus" segment (N=27)
  // to a full geography-defined core buy box now that Walid's Lakeside
  // region gives it real sample depth (N=39). Scoped in
  // charlotte_overview.ipynb ("Why Lake Is Now a Core Buy Box, Not a Bonus").
  // ---------------------------------------------------------------------------
  {
    id: "lake",
    label: "Lake Buy Box",
    status: "pending",
    name: "Charlotte Lake (Lakeside Region)",
    thesis: "Smallest region by count, strongest by far on Top 10% hit rate — defined by geography (the Lakeside region near Lake Wylie / Mountain Island), not just the waterfront amenity flag.",
    atAGlance: {
      bedBath: "4+ bedrooms preferred · 2 bathrooms minimum (3+ nice to have)",
      sleeps: "8+ required — every Lakeside Top 10% listing sleeps 8 or more, none below it",
      heroMechanism: "Lake/waterfront setting — earns on ADR, not occupancy",
      revenue: "N=39 listings · 21% reach market Top 10% ($78,801+) — more than double Downtown's 8%",
      primaryRequirement: "Sleeps 8+ and 2+ bathrooms are both hard floors — 0% of Lakeside listings below either has ever reached the market's Top 10%",
    },
    // Clearwater's "1. Buy-Box Summary" hero card, reused for pending boxes
    // too (see overviewBlock() in render.js). heroImage is the #1-by-
    // revenue comp's own exterior (see Comp-Set Visual Comparison below).
    overview: {
      statusBadge: "Capacity & amenity analysis complete — comp-set photo evidence in progress",
      thesis: "Smallest region by count, strongest by far on Top 10% hit rate — defined by geography (the Lakeside region near Lake Wylie / Mountain Island), not just the waterfront amenity flag.",
      whyItWorks:
        "Lake is the smallest region by count but by far the strongest on Top 10% hit rate (21%, more than double Downtown's 8%) — driven by the Lakeside region's geography, not the waterfront/lake-access flags alone (which alone covered only N=27, too thin to underwrite on its own).",
      heroImage: photo("lake/compset/exterior/property-1-exterior.avif", "Blue two-story lakefront home with stone porch columns and a covered entry", "The #1-by-revenue listing in Lakeside's Top 10% comp set — see Comp-Set Visual Comparison below."),
      chips: [
        { label: "4+ bedrooms preferred" },
        { label: "2+ bathrooms (3+ nice to have)" },
        { label: "Sleeps 8+ required" },
        { label: "Waterfront + lake access, effectively required" },
      ],
      revenueChips: [
        { label: "N=39 listings", value: "21% reach Top 10%" },
        { label: "Top 10% threshold", value: "$78,801+" },
      ],
    },

    // Presentation flow follows Clearwater's 5BR buy box section-by-section,
    // grouped under 5 headings the same way the team's own template groups
    // them: Property Profile -> Amenities -> Geo Considerations -> Property
    // Locations -> Traveler Demographics -> Comp Set. No charts in any
    // section here: Clearwater's own reference is text + real photos, not
    // matplotlib charts -- the fuller chart-based analysis (capacity
    // 4-panel/tiered/amenity-prevalence/heatmap) lives in
    // charlotte_lake_buybox.ipynb, which has more room for it than a
    // presentation page does. Every photo grid uses the compact
    // (max 360px) layout -- see renderPendingSection in render.js -- since
    // none of this is curated comp photography yet, just a reference image
    // library (../LakeBuyBox/Images/); a handful of reference photos
    // shouldn't render huge just because the grid has room.
    pendingIntro:
      "Lake is scoped in ../notebooks/charlotte_overview.ipynb (\"Why Lake Is Now a Core Buy Box, Not a Bonus\") — N=39, defined by the Lakeside region's geography (the pocket near Lake Wylie / Mountain Island) rather than the HAS_waterfront/HAS_lake_access amenity flags alone (which alone covered only N=27, too thin to underwrite on its own).",

    pendingSections: [
      { groupTitle: "Property Profile" },
      {
        title: "Bedrooms & Bathrooms",
        body:
          "<p><strong>Target range:</strong> 4+ bedrooms; 2 bathrooms minimum.</p>" +
          "<p><strong>Bathrooms:</strong> 2 is a hard floor, not just a preference — 0% of Lakeside listings below 2 baths have ever reached the market's Top 10%. 3+ is the real \"nice to have\" above that floor; 2.5 does not show a clean improvement over 2.0 in this sample.</p>" +
          "<p><strong>Bedrooms:</strong> 1-3BR essentially never reach the market's Top 10% within Lakeside (0-8% hit rate); 4BR/5BR do (50-60%). Top 10% listings also sleep further (avg. 12.1) and have more beds/baths (7.0 beds, 3.1 baths) than Top 25% or the rest of the market — see the capacity-by-tier evidence below.</p>",
        chartsRow: [
          photo("lake/charts/capacity_4panel.png", "Four-panel chart: median revenue and Top 25%/10% hit rate, by sleeps and by bathroom count, for Lakeside listings", "Lakeside (N=39): capacity thresholds, not straight lines — median revenue and Top 25%/10% hit rate, by sleeps and by bathroom count."),
          photo("lake/charts/capacity_by_tier.png", "Grouped bar chart of average sleeps, beds, and baths for Lakeside's Top 10%, Top 25%, and Other 75% tiers", "Lakeside: average sleeps/beds/baths by market revenue tier (Top 10% vs. Top 25% vs. Other 75%)."),
        ],
      },
      {
        title: "Ideal Sleep Count",
        body:
          "<p><strong>Comfortable capacity:</strong> 8+ required — every Lakeside listing that has ever reached the market's Top 10% sleeps 8 or more, none below it.</p>" +
          "<p><strong>Beds per bedroom:</strong> no requirement — bunk density doesn't predict revenue on its own here (r=0.03); a real bunk room is still a legitimate way to reach the sleeps floor, it just isn't what separates high and low performers.</p>",
        images: [
          photo("lake/rooms/bunk-room.avif", "Built-in dual bunk room with four beds and access ladders", "A built-in bunk room — one legitimate way to clear the sleeps 8+ floor above."),
          photo("lake/rooms/comp-primary-bedroom.avif", "Spacious primary bedroom suite with a sitting area and ensuite bathroom", "The primary bedroom from the first property in this buy box's comp set."),
          photo("lake/ai-gen/comp-six-bunk-room.jpg", "Six-bed, three-tier built-in bunk room", "A second real bunk room, from another of Lakeside's Top 10% comp-set listings — see ../LakeBuyBox/ai-gen/SOURCE.md for how this was sourced."),
        ],
      },
      {
        title: "Architectural Style",
        body: "<p>No architectural style has been tied to performance yet — these are reference photos of the market's product type (a mix of ranch and split-level lake houses with an open interior layout), not a claim that this exact style outperforms others.</p>",
        images: [
          photo("lake/exterior/aerial-wide.avif", "Aerial view of a single-story lake house with a pool, dock, and mature trees", "Reference example: a ranch-style lake house with pool and private dock."),
          photo("lake/exterior/aerial-close.avif", "Close aerial view of a lake house with a screened porch, pool, and landscaped terraces", "Reference example: a screened-porch, split-level layout stepping down toward the water."),
          photo("lake/indoor/open-living-dining.avif", "Open-concept kitchen, dining, and living space with lake-facing windows", "Reference example: an open-concept living/dining/kitchen layout, common across the reference photos supplied so far."),
        ],
      },
      {
        title: "Backyard Size",
        body: "<p>No backyard size or usability metric has been analyzed yet — these are reference photos showing the pool-and-dock outdoor program typical of this market's product, not a stated size requirement.</p>",
        images: [
          photo("lake/exterior/pool-dock-view.avif", "Pool deck with lounge chairs overlooking a private dock and the lake", "Reference example: pool deck stepping down to a private dock."),
          photo("lake/porch/covered-porch-dock-view.avif", "Covered porch with string lights and wicker seating overlooking a lake and dock", "Reference example: a covered porch overlooking the dock, sized for a full outdoor living/dining setup."),
        ],
      },
      { groupTitle: "Amenities" },
      {
        title: "Amenity Prevalence By Tier",
        body:
          "<p><strong>Must-Have rule (updated):</strong> an amenity is a Must-Have if it clears <em>either</em> bar — ≥40% penetration among Lakeside's Top 10% listings (N=8), or ≥60% presence across the whole Lakeside market (N=39). Six amenities clear at least one: Fire Pit (100% Top 10% / 61.5% whole), Waterfront (100% / 46.2%), Lake Access (100% / 46.2%), Hot Tub (87.5% / 23.1%), Outdoor Dining Area (87.5% / 61.5%), and Pack 'N Play / Travel Crib (62.5% / 33.3%). <strong>Crib</strong> falls just short of both bars (37.5% Top 10% / 12.8% whole) despite being a related amenity to Pack 'N Play — it's ranked as the top Nice-to-Have below instead of a Must-Have. Everything else stays too flat across tiers to separate Top 10% from the rest. The heatmap shows the same data at the individual-listing level, sorted Top 10% → Top 25% → Other 75%.</p>",
        chartsRow: [
          photo("lake/charts/amenity_prevalence.png", "Grouped bar chart of amenity prevalence by revenue tier for Lakeside listings, Top 10% drawn on top of each group", "Amenity prevalence by tier (N=39) — Top 10% (green) drawn on top of each group, then Top 25%, then Other 75%."),
          photo("lake/charts/amenity_heatmap.png", "Heatmap of amenity presence per listing, sorted Top 10% to Other 75%", "Amenity presence by individual listing (N=39)."),
        ],
      },
      {
        title: "Must-Have's",
        body: "<p>Clears the ≥40%-of-Top-10%-or-≥60%-of-whole-market bar above (N=8 Top 10% / N=39 whole).</p>",
        items: ["Fire Pit", "Outdoor Dining Area", "Waterfront", "Lake Access", "Pack 'N Play / Travel Crib", "Hot Tub"],
        images: [
          photo("lake/firepit/beach-firepit-dock.avif", "Small fire bowl on a sandy lake beach with a dock in the background", "A fire pit set up right at the water's edge — Fire Pit and Waterfront together, not two separate features here."),
          photo("lake/firepit/beach-firepit-chairs.avif", "Adirondack chairs around a fire pit on a sandy beach facing the lake and a dock", "Adirondack-chair fire pit seating on the beach, facing the dock."),
          photo("lake/porch/screened-porch-firepit-table.avif", "Screened porch with a wicker sectional and a fire-pit dining table, lake visible through the windows", "Reference example: a screened porch combining outdoor dining and lounge seating."),
          photo("lake/hottub/covered-porch-lake-view.avif", "Hot tub on a covered porch overlooking a lake and dock", "Reference example: a covered-porch hot tub facing the lake."),
          photo("lake/hottub/night-lit.avif", "Hot tub lit blue at night in a backyard setting", "Reference example: a nighttime hot tub setup."),
        ],
      },
      // Amenity Evidence -- Clearwater's "Amenity Combination Evidence"
      // pattern (5BR buy box), ported to Lake per direct request: a median
      // with-vs-without revenue comparison per amenity, "where necessary" --
      // i.e. for the ambiguous Nice-to-Have candidates only, not the
      // Must-Haves above (already covered by the prevalence chart). This is
      // also what settles the open "Pickleball?" question: N=1 in all of
      // Lakeside, and that one listing underperforms -- excluded below.
      {
        title: "Amenity Evidence: With vs. Without",
        body:
          "<p>For each Nice-to-Have candidate below, Lakeside's median Revenue Potential with vs. without that amenity (N=39). Every \"with\" group is 1-5 listings — directional evidence only, not proof that the amenity itself causes the difference. This is also the evidence behind excluding Pickleball: its lone listing (N=1) actually earns less than the market without it.</p>",
        charts: [
          photo("lake/charts/amenity_with_without.png", "Six small bar charts, each comparing median Lakeside revenue with vs. without one amenity: Pool Table, Game Room, Pool, Crib, Gym, and Pickleball", "Pool Table (+280%), Game Room (+250%), Pool (+168%), and Crib (+173%) show the strongest separation; Gym (+24%) is marginal; Pickleball (-3%) is negative and N=1."),
        ],
      },
      // Nice-to-Have, Ranked -- Clearwater's 5BR structure (score / revenue
      // uplift / Top-10%-hit-rate uplift / N per item, thin-data items
      // flagged rather than dropped, no Auto-Add tier). Score here is our
      // own transparent composite (median revenue uplift + Top-10%-hit-rate
      // uplift + sample size, each min-max normalized across the rankable
      // amenities) since Clearwater's exact weights weren't supplied to us
      // -- same shape, same math as before, just re-run with the new N≥2
      // floor and Crib/Gym/Pool/Game Room/Pool Table now included (Hot Tub,
      // Outdoor Dining Area, and Pack 'N Play moved up to Must-Have above).
      {
        // No outer `title` here -- niceToHaveRankedBlock() already renders
        // its own "Nice-to-Have, Ranked" <h4>, so an outer <h3> with the
        // same text would just duplicate the heading.
        ranked: {
          note: "N≥2 is now the minimum to rank in Lakeside (was N≥9) — everything thinner (N≤1) is flagged, not dropped, matching Clearwater's own treatment of its thin amenities (Movie Theater, Sauna, Golf Simulator). Photos pending for Crib and Gym.",
          items: [
            { name: "Crib", score: 0.70, revenueUplift: "+173%", p90Uplift: "+45pp", n: 5, note: "Highest score of any Nice-to-Have — falls just short of the Must-Have bars above (37.5% of Top 10%, 12.8% of the whole market) but shows the strongest revenue signal.", images: [] },
            { name: "Pool Table", score: 0.67, revenueUplift: "+280%", p90Uplift: "+84pp", n: 2, note: "Smallest sample of any ranked item (N=2), but both pool-table listings reach the market's Top 10% — the highest hit-rate uplift here.", images: [
              photo("lake/pooltable/lake-view-room.avif", "Living room with a pool table and sectional sofa, sliding doors opening to a lake and dock view", "Reference example: a pool table room opening directly onto a lake/dock view."),
            ] },
            { name: "Game Room", score: 0.60, revenueUplift: "+250%", p90Uplift: "+50pp", n: 3, note: "Second-highest revenue uplift of any Nice-to-Have, on N=3.", images: [
              photo("lake/gameroom/game-room-sign.avif", "Game room with a pool table, sectional sofa, and arcade cabinet under a GAME ROOM sign", "Reference example: a dedicated game room with a pool table and arcade cabinet."),
            ] },
            { name: "Pool", score: 0.49, revenueUplift: "+168%", p90Uplift: "+50pp", n: 3, note: "Strong revenue signal, same hit-rate uplift as Game Room, on N=3.", images: [
              photo("lake/pool/aerial-kidney-pool.avif", "Aerial view of a kidney-shaped pool with a screened porch and brick patio", "Reference example: a kidney-shaped pool and brick patio."),
            ] },
            { name: "Gym", score: 0.22, revenueUplift: "+24%", p90Uplift: "+5pp", n: 4, note: "Weakest signal of the rankable amenities — present, but a marginal differentiator here.", images: [] },
            { name: "Pickleball", n: 1, thinData: true, note: "N=1 in all of Lakeside — below even the new N≥2 minimum, and that one listing has lower revenue than the market without it (see Amenity Evidence chart above). Not recommended, despite being a common ask.", images: [] },
            { name: "Playground", n: 1, thinData: true, note: "N=1, below the new N≥2 minimum.", images: [] },
            { name: "Sauna", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Mini Golf", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Movie Theater", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Golf Simulator", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Pool Heater", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
          ],
        },
      },

      { groupTitle: "Geo Considerations" },
      {
        title: "Waterfront, View & Privacy",
        body:
          "<p><strong>Waterfront is effectively required</strong> — 100% of Lakeside's Top 10% (N=8) are flagged waterfront + lake-access (see Must-Have above); 20 of 39 Lakeside listings have neither flag, real room to add one. The lake itself is the view; privacy/seclusion isn't separately analyzed yet. Map below: toggle Lakeside + Top 10% to see exactly which properties this describes, alongside the region's landmarks.</p>",
        mapEmbed: {
          url: "assets/overview/charlotte_overview_map.html",
          title: "Interactive map — Lakeside properties, revenue tiers, and demand-driver landmarks",
        },
        images: [
          photo("lake/firepit/sunset-firepit-lake.avif", "Adirondack chairs around a fire pit on a beach at sunset, facing a lake with a dock", "Reference example: direct lake-edge access at sunset."),
        ],
      },

      { groupTitle: "Property Locations" },
      {
        title: "Ideal Location(s) & Popular Places",
        body:
          "<p><strong>28278 (Steele Creek / Lake Wylie)</strong> is the priority ZIP — N=19, median $65,906, 7 of 8 Top 10% listings. 28214 (N=19, median $39,818) is the other core ZIP but performs far weaker. Lake Wylie / Mountain Island Lake itself is the demand driver, not Charlotte's usual landmarks — Lakeside sits furthest from the Airport, Banking District, and Sports Venues of any region. See the map above: landmarks and both ZIPs' properties are marked together.</p>",
      },

      { groupTitle: "Traveler Demographics" },
      {
        title: "Traveler ICP",
        body:
          "<p><strong>Group trip, primary; families, secondary.</strong> Not supported: a couples-first positioning.</p>",
        icpCharts: true,
      },

      { groupTitle: "Comp Set" },
      // Comp-Set Visual Comparison -- Clearwater's exact structure (Top/Mid/
      // Low tier columns side by side per photo category). Tiering rule is
      // literal row order in ../LakeBuyBox/Compset.csv, sorted by Revenue
      // Potential: top 2 rows = High, next 4 = Mid, remaining 2 = Low --
      // the same 8 listings used throughout this box (see Must-Have/Nice-
      // to-Have photos and ../LakeBuyBox/ai-gen/SOURCE.md). Photos are
      // being supplied property-by-property (HeroPic/BedroomN in
      // ../LakeBuyBox/Images/) -- any property without a photo yet shows a
      // pendingPhoto() card linking straight to its real Airbnb listing
      // instead of an invented placeholder image. Category interpretation
      // text is a literal placeholder (lorem ipsum) until the real
      // write-up is supplied -- do not mistake it for real analysis.
      {
        title: "Comp-Set Visual Comparison",
        body:
          "<p>Lakeside's 8 Top 10% comp-set listings, tiered by Revenue Potential (see <code>../LakeBuyBox/Compset.csv</code>): <strong>Top (High) tier</strong> is the top 2 by revenue, <strong>Mid tier</strong> is the next 4, <strong>Low tier</strong> is the remaining 2. Photos are being added property by property — a \"photo pending\" card links straight to that listing until its photo is in.</p>",
        compSetComparison: {
          categories: [
            {
              title: "Exterior",
              interpretation:
                "[Analyst opinion — placeholder text below, to be replaced] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              tiers: {
                high: [
                  {
                    title: "Lakefront Estate with Beach + Dock + Hot Tub",
                    url: "https://www.airbnb.com/rooms/47855845",
                    stats: "$182,749 · $896.51 ADR · 54.65% occ · 5BR/3.5BA, sleeps 16 · 4.95★ (97)",
                    images: [photo("lake/compset/exterior/property-1-exterior.avif", "Blue two-story lakefront home with stone porch columns and a covered entry", "Property 1 (High tier, #1 by revenue) — exterior.")],
                  },
                  {
                    title: "Lake front home away from home",
                    url: "https://www.airbnb.com/rooms/591945644640549600",
                    stats: "$151,170 · $738.15 ADR · 55.56% occ · 5BR/3.5BA, sleeps 16 · 4.9★ (149)",
                    images: [photo("lake/compset/exterior/property-2-exterior.avif", "Lake property exterior/grounds view", "Property 2 (High tier, #2 by revenue) — exterior.")],
                  },
                ],
                mid: [
                  {
                    title: "Modern 4BR Lakefront Home w/Pool, Patio & Pets OK",
                    url: "https://www.airbnb.com/rooms/1142965470924412498",
                    stats: "$138,235 · $795.41 ADR · 46.57% occ · 4BR/3.5BA, sleeps 11 · 4.9★ (32)",
                    images: [photo("lake/compset/exterior/property-3-exterior.avif", "Modern lakefront home exterior", "Property 3 (Mid tier, #3 by revenue) — exterior.")],
                  },
                  {
                    title: "Lake Wylie Lakefront | Hot Tub+Firepit | CLT, 20m",
                    url: "https://www.airbnb.com/rooms/1022667495215121231",
                    stats: "$126,895 · $793.71 ADR · 44.14% occ · 4BR/4BA, sleeps 14 · 5★ (56)",
                    images: [photo("lake/compset/exterior/property-4-exterior.avif", "Lakefront home exterior", "Property 4 (Mid tier, #4 by revenue) — exterior.")],
                  },
                  {
                    title: "Serene Lake Views • Hot Tub • BBQ • Kayaks",
                    url: "https://www.airbnb.com/rooms/49369858",
                    stats: "$121,486 · $523.86 ADR · 65.36% occ · 4BR/2.5BA, sleeps 10 · 4.8★ (95)",
                    images: [
                      photo("lake/compset/exterior/property-5-exterior.avif", "Lake home exterior view", "Property 5 (Mid tier, #5 by revenue) — exterior."),
                      photo("lake/compset/exterior/property-5-exterior-2.avif", "Lake home exterior, second view", "Property 5 — second exterior view."),
                    ],
                  },
                  {
                    title: "Mid-Century Modern Lake House with Stunning Views",
                    url: "https://www.airbnb.com/rooms/1405992491060136013",
                    stats: "$115,911 · $677.60 ADR · 52.22% occ · 4BR/3.5BA, sleeps 8 · 4.95★ (33)",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/1405992491060136013", "Exterior photo")],
                  },
                ],
                low: [
                  {
                    title: "Castaway Cove— 5Bed Lake Retreat—Fire Pit—Hot Tub!",
                    url: "https://www.airbnb.com/rooms/52281872",
                    stats: "$99,613 · $466.33 ADR · 57.71% occ · 5BR/2BA, sleeps 14 · 4.9★ (97)",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/52281872", "Exterior photo")],
                  },
                  {
                    title: "Your Lake House Awaits!",
                    url: "https://www.airbnb.com/rooms/1294906461944120744",
                    stats: "$87,852 · $360.50 ADR · 67.04% occ · 3BR/2BA, sleeps 8 · 4.95★ (104)",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/1294906461944120744", "Exterior photo")],
                  },
                ],
              },
            },
            {
              title: "Bedrooms",
              interpretation:
                "[Analyst opinion — placeholder text below, to be replaced] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              tiers: {
                high: [
                  {
                    title: "Lakefront Estate with Beach + Dock + Hot Tub",
                    url: "https://www.airbnb.com/rooms/47855845",
                    stats: "5BR / 10 beds / sleeps 16",
                    images: [photo("lake/compset/bedrooms/property-1-bedroom.avif", "Bedroom in the Property 1 listing", "Property 1 (High tier) — a bedroom.")],
                  },
                  {
                    title: "Lake front home away from home",
                    url: "https://www.airbnb.com/rooms/591945644640549600",
                    stats: "5BR / 9 beds / sleeps 16",
                    images: [photo("lake/compset/bedrooms/property-2-bunk.avif", "Built-in bunk room in the Property 2 listing", "Property 2 (High tier) — the built-in bunk room.")],
                  },
                ],
                mid: [
                  {
                    title: "Modern 4BR Lakefront Home w/Pool, Patio & Pets OK",
                    url: "https://www.airbnb.com/rooms/1142965470924412498",
                    stats: "4BR / 8 beds / sleeps 11",
                    images: [
                      photo("lake/compset/bedrooms/property-3-bedroom.avif", "Bedroom in the Property 3 listing", "Property 3 (Mid tier) — a bedroom."),
                      photo("lake/compset/bedrooms/property-3-bunk.avif", "Bunk room in the Property 3 listing", "Property 3 — the bunk room."),
                    ],
                  },
                  {
                    title: "Lake Wylie Lakefront | Hot Tub+Firepit | CLT, 20m",
                    url: "https://www.airbnb.com/rooms/1022667495215121231",
                    stats: "4BR / 9 beds / sleeps 14",
                    images: [
                      photo("lake/compset/bedrooms/property-4-bedroom.avif", "Bedroom in the Property 4 listing", "Property 4 (Mid tier) — a bedroom."),
                      photo("lake/compset/bedrooms/property-4-bunk.avif", "Bunk room in the Property 4 listing", "Property 4 — the bunk room."),
                      photo("lake/compset/bedrooms/property-4-couch.avif", "Living area with a couch in the Property 4 listing", "Property 4 — a sleeper-couch/living area."),
                    ],
                  },
                  {
                    title: "Serene Lake Views • Hot Tub • BBQ • Kayaks",
                    url: "https://www.airbnb.com/rooms/49369858",
                    stats: "4BR / 6 beds / sleeps 10",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/49369858", "Bedroom photo")],
                  },
                  {
                    title: "Mid-Century Modern Lake House with Stunning Views",
                    url: "https://www.airbnb.com/rooms/1405992491060136013",
                    stats: "4BR / 5 beds / sleeps 8",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/1405992491060136013", "Bedroom photo")],
                  },
                ],
                low: [
                  {
                    title: "Castaway Cove— 5Bed Lake Retreat—Fire Pit—Hot Tub!",
                    url: "https://www.airbnb.com/rooms/52281872",
                    stats: "5BR / 6 beds / sleeps 14",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/52281872", "Bedroom photo")],
                  },
                  {
                    title: "Your Lake House Awaits!",
                    url: "https://www.airbnb.com/rooms/1294906461944120744",
                    stats: "3BR / 3 beds / sleeps 8",
                    images: [pendingPhoto("https://www.airbnb.com/rooms/1294906461944120744", "Bedroom photo")],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        title: "Alexandria Comp Set",
        body:
          "<p><a href=\"https://alexandria.strsearch.com/compsets?market=8&tag=7759fdb2-77e7-4e4c-8f3a-0bff87b79569&tab=view\" target=\"_blank\" rel=\"noopener\">View the live comp set on Alexandria ↗</a>.</p>",
      },
    ],

    pendingNote:
      "Full chart-based analysis, including capacity by bedroom/bathroom/tier (not shown above): <code>../notebooks/charlotte_lake_buybox.ipynb</code>.",
  },
];

const PENDING_BUY_BOXES = [
  { label: "Downtown / Uptown Buy Box", note: "N=368, largest region by inventory (51% of the market), 8% Top 10% hit rate. See the pending Downtown / Uptown Buy Box tab above for what's scoped so far." },
  { label: "Outskirts Buy Box", note: "N=312, broadest region geographically, 11% Top 10% hit rate. See the pending Outskirts Buy Box tab above for what's scoped so far." },
  { label: "Lake Buy Box", note: "N=39, geography-defined (Lakeside region, not amenity-flag-only), 21% Top 10% hit rate — more than double Downtown's. See the pending Lake Buy Box tab above." },
];
const PENDING_BUY_BOXES_NOTE =
  "All three buy boxes — Downtown / Uptown, Outskirts, and Lake — are named and scoped in charlotte_overview.ipynb's region-based buy-box segmentation, with real N and Top 10% hit-rate figures, but their full deep-dive analysis has not been built out yet. Map and structure come first, per the team's current call.";
