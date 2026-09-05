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
  // No curated Charlotte hero photo yet -- omitted rather than forced into a
  // pendingPhoto() card, since that component's label always reads "view on
  // Airbnb" and there's no single Airbnb listing this general market section
  // should point to -- none of the three current buy boxes are developed
  // enough yet to have a hero image of their own either (see BUY_BOXES).
  heroImage: null,
  paragraphs: [
    "Charlotte is North Carolina's largest city and the anchor of a metro area of roughly 2.8 million people, sitting inside the \"Charlanta\" megaregion that stretches from Atlanta to Raleigh. It's the country's second-largest banking center after New York — Bank of America is headquartered here, and Charlotte's skyline, corporate travel demand, and weekday business-trip base are all downstream of that fact.",
    "Charlotte Douglas International Airport (CLT) is a major American Airlines hub, one of the busiest airports in the country by traffic — this is a fly-in market as much as a drive-in one, and short-term rental demand reflects both a corporate/business-travel base and event-driven leisure groups.",
    "The market splits into three geography-defined regions — <strong>Downtown / Uptown</strong> (the walkable urban core plus Bank of America Stadium and Spectrum Center, largest inventory pool at 51% of the market), <strong>Outskirts</strong> (the broadest region geographically, 2.5–14 miles out, the largest pool of big group-oriented houses), and <strong>Lakeside</strong> (the Lake Wylie / Mountain Island pocket, smallest by count but the strongest revenue performer) — which is what the location analysis below is built around.",
  ],
  sources: [
    { label: "Charlotte Douglas International Airport — About CLT", url: "https://www.cltairport.com/about/" },
    { label: "Charlotte Regional Business Alliance — Charlotte USA facts", url: "https://charlotteusa.com/" },
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
    pendingNote:
      "Downtown / Uptown is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=368, the market's largest single region (51% of all 719 listings), but the lowest Top 10% hit rate of the three (8%), driven mostly by a smaller-bedroom product mix (51% of Downtown listings are 1-2BR, vs. 27% in Outskirts and 33% in Lakeside). It still produces the single highest-revenue listing in the market (\"Spacious 8BR Duplex, Sleeps 20, Walk to Breweries,\" $199,741). Full deep-dive analysis (comp sets, revenue tiering, amenity evidence, buy-box template) has not been built yet.",
  },

  // ---------------------------------------------------------------------------
  // Outskirts — the broadest region geographically and the largest pool of
  // big-bedroom inventory, but intentionally coarse (see the notebook's own
  // caution about internal variation).
  // ---------------------------------------------------------------------------
  {
    id: "outskirts",
    label: "Outskirts Buy Box",
    status: "pending",
    name: "Charlotte Outskirts",
    thesis: "The broadest region geographically (2.5–14 miles from Uptown) and the largest pool of big, group-oriented houses — Top 10% hit rate roughly climbs with that size mix.",
    atAGlance: {
      bedBath: "Any bedroom count (312 listings; 32% are 4BR+, the highest big-house share of the three regions)",
      sleeps: "TBD",
      heroMechanism: "TBD",
      revenue: "N=312 listings · 11% reach market Top 10% ($78,801+)",
      primaryRequirement: "TBD",
    },
    pendingNote:
      "Outskirts is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=312, the broadest region geographically (2.5–14 miles from Uptown, mean 7.1 miles) and the market's largest pool of big-bedroom (4BR+) inventory (32%), 11% Top 10% hit rate. Note: this region is intentionally coarse — it spans everything from close-in SouthPark-adjacent ZIPs to far exurbs, and likely hides real internal variation a finer cut would separate out (see the notebook's own caution in \"Tying It Together\"). Full deep-dive analysis has not been built yet.",
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

    // Presentation flow follows Clearwater's 5BR buy box section-by-section:
    // Architectural Style -> Bedrooms & Bathrooms -> Sleep Count -> Backyard
    // -> Must-Have -> Nice-to-Have, Ranked (no Auto-Add tier -- one
    // must-have segment only, matching Clearwater's own structure exactly).
    // Architectural Style and Backyard are left genuinely empty (no photos
    // supplied yet) rather than filled with invented text -- see
    // renderPendingSection's pendingLabel handling in render.js. No charts
    // in any section here: Clearwater's own reference is text + real photos,
    // not matplotlib charts -- the fuller chart-based analysis (capacity
    // 4-panel/tiered/amenity-prevalence/heatmap) lives in
    // charlotte_lake_buybox.ipynb, which has more room for it than a
    // presentation page does.
    pendingIntro:
      "Lake is scoped in ../notebooks/charlotte_overview.ipynb (\"Why Lake Is Now a Core Buy Box, Not a Bonus\") — N=39, defined by the Lakeside region's geography (the pocket near Lake Wylie / Mountain Island) rather than the HAS_waterfront/HAS_lake_access amenity flags alone (which alone covered only N=27, too thin to underwrite on its own).",

    pendingSections: [
      {
        title: "Architectural Style",
        pendingLabel: "Not yet analyzed — no reference photos supplied yet.",
      },
      {
        title: "Bedrooms & Bathrooms",
        body:
          "<p><strong>Target range:</strong> 4+ bedrooms; 2 bathrooms minimum.</p>" +
          "<p><strong>Bathrooms:</strong> 2 is a hard floor, not just a preference — 0% of Lakeside listings below 2 baths have ever reached the market's Top 10%. 3+ is the real \"nice to have\" above that floor; 2.5 does not show a clean improvement over 2.0 in this sample.</p>" +
          "<p><strong>Bedrooms:</strong> 1-3BR essentially never reach the market's Top 10% within Lakeside (0-8% hit rate); 4BR/5BR do (50-60%).</p>",
      },
      {
        title: "Sleep Count",
        body:
          "<p><strong>Comfortable capacity:</strong> 8+ required — every Lakeside listing that has ever reached the market's Top 10% sleeps 8 or more, none below it.</p>" +
          "<p><strong>Beds per bedroom:</strong> no requirement — bunk density doesn't predict revenue on its own here (r=0.03); a real bunk room is still a legitimate way to reach the sleeps floor, it just isn't what separates high and low performers.</p>",
        images: [
          photo("lake/rooms/bunk-room.avif", "Built-in dual bunk room with four beds and access ladders", "A built-in bunk room — real, dedicated sleep capacity like this is one legitimate way to clear the sleeps 8+ floor above."),
          photo("lake/rooms/comp-primary-bedroom.avif", "Spacious primary bedroom suite with a sitting area and ensuite bathroom", "The primary bedroom from the first property in this buy box's comp set — see the full comp set link below."),
        ],
      },
      {
        title: "Backyard / Outdoor Space",
        pendingLabel: "Not yet analyzed — no reference photos supplied yet.",
      },
      {
        title: "Must-Have",
        body: "<p>The only amenities present in 100% of Lakeside's Top 10% listings (N=8) — everything else is a nice-to-have, ranked below.</p>",
        items: ["Fire Pit", "Waterfront", "Lake Access"],
        images: [],
      },
      // Nice-to-Have, Ranked -- Clearwater's 5BR structure (score / revenue
      // uplift / Top-10%-hit-rate uplift / N per item, thin-data items
      // flagged rather than dropped, no Auto-Add tier). Score here is our
      // own transparent composite (revenue uplift + hit-rate uplift +
      // sample size, each min-max normalized across the rankable amenities)
      // since Clearwater's exact weights weren't supplied to us -- same
      // shape, our own math. Photos pending for every item -- add via
      // photo(relPath, alt, caption) into each item's `images` once supplied.
      {
        // No outer `title` here -- niceToHaveRankedBlock() already renders
        // its own "Nice-to-Have, Ranked" <h4>, so an outer <h3> with the
        // same text would just duplicate the heading.
        ranked: {
          note: "Ranked by composite score among amenities with N≥9 in Lakeside; everything thinner is flagged, not dropped, matching Clearwater's own treatment of its thin amenities (Movie Theater, Sauna, Golf Simulator). Photos pending for every item.",
          items: [
            { name: "Hot Tub", score: 0.67, revenueUplift: "+191%", p90Uplift: "+74pp", n: 9, note: "By far the strongest signal in Lakeside — 78% of hot-tub-flagged listings reach the market's Top 10%, vs. 3% without. N=9 is still small; treat as directional, not proven.", images: [] },
            { name: "Outdoor Dining Area", score: 0.37, revenueUplift: "+40%", p90Uplift: "+23pp", n: 24, note: "Already the region's most common non-must-have amenity (24 of 39) — a real but smaller relative lift than Hot Tub.", images: [] },
            { name: "Pack 'N Play / Travel Crib", score: 0.12, revenueUplift: "+24%", p90Uplift: "+27pp", n: 13, note: "Weakest of the rankable amenities — present, but not a strong differentiator here.", images: [] },
            { name: "Crib", n: 5, thinData: true, note: "N=5, too thin to rank reliably.", images: [] },
            { name: "Gym", n: 4, thinData: true, note: "N=4, too thin to rank reliably.", images: [] },
            { name: "Pool", n: 3, thinData: true, note: "N=3, too thin to rank reliably.", images: [] },
            { name: "Game Room", n: 3, thinData: true, note: "N=3, too thin to rank reliably.", images: [] },
            { name: "Pool Table", n: 2, thinData: true, note: "N=2, too thin to rank reliably.", images: [] },
            { name: "Pickleball", n: 1, thinData: true, note: "N=1, too thin to rank reliably.", images: [] },
            { name: "Playground", n: 1, thinData: true, note: "N=1, too thin to rank reliably.", images: [] },
            { name: "Sauna", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Mini Golf", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Movie Theater", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Golf Simulator", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
            { name: "Pool Heater", n: 0, thinData: true, note: "Never observed in Lakeside (N=0).", images: [] },
          ],
        },
      },
    ],

    pendingNote:
      "<strong>Comp set:</strong> <a href=\"https://alexandria.strsearch.com/compsets?market=8&tag=7759fdb2-77e7-4e4c-8f3a-0bff87b79569&tab=view\" target=\"_blank\" rel=\"noopener\">view on Alexandria ↗</a>. 20 of the 39 Lakeside-region listings have neither the waterfront nor lake-access amenity flag set — proximity to the lake, not a tagged amenity, is what the geography captures that the flag missed. 21% Top 10% hit rate market-wide within this region, more than double Downtown's (8%), driven by ADR rather than occupancy (r=0.92 between revenue and ADR within this region). Analyst-reviewed, execution-tiered comp-set photo evidence beyond the two room photos above is still pending. Full chart-based analysis (capacity by bedroom/bathroom/tier, amenity prevalence, amenity presence heatmap): <code>../notebooks/charlotte_lake_buybox.ipynb</code>.",
  },
];

const PENDING_BUY_BOXES = [
  { label: "Downtown / Uptown Buy Box", note: "N=368, largest region by inventory (51% of the market), 8% Top 10% hit rate. See the pending Downtown / Uptown Buy Box tab above for what's scoped so far." },
  { label: "Outskirts Buy Box", note: "N=312, broadest region geographically, 11% Top 10% hit rate. See the pending Outskirts Buy Box tab above for what's scoped so far." },
  { label: "Lake Buy Box", note: "N=39, geography-defined (Lakeside region, not amenity-flag-only), 21% Top 10% hit rate — more than double Downtown's. See the pending Lake Buy Box tab above." },
];
const PENDING_BUY_BOXES_NOTE =
  "All three buy boxes — Downtown / Uptown, Outskirts, and Lake — are named and scoped in charlotte_overview.ipynb's region-based buy-box segmentation, with real N and Top 10% hit-rate figures, but their full deep-dive analysis has not been built out yet. Map and structure come first, per the team's current call.";
