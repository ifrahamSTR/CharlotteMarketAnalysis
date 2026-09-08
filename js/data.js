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
  // Top 10% hit rate at the region-wide level (atAGlance.revenue/overview
  // below). Scoped in charlotte_overview.ipynb's region-based buy-box
  // segmentation. The pendingSections below (Property Profile through
  // Projections) are this team's own Downtown comp research, built from the
  // large-group Downtown/Uptown population: 4+ bedrooms, sleeps 10+, n=39 --
  // see
  // ../docs/downtown_comp_review/DOWNTOWN_WEBPAGE_SECTION_DECISIONS.md for
  // the full decisions memo this section is wired from, and
  // ../docs/downtown_comp_review/downtown_map_dataset_REGION_AUDIT.csv for
  // the underlying rows. Do not confuse this n=39 comp set with the
  // region-wide N=368 stat in atAGlance/overview below (a different,
  // region-level analysis, not comp-set-filtered) or with the legacy 47-row
  // raw Region=Downtown set the team has since moved off of.
  // ---------------------------------------------------------------------------
  {
    id: "downtown",
    label: "Downtown / Uptown Buy Box",
    status: "pending",
    name: "Charlotte Downtown / Uptown",
    thesis: "The market's largest region by inventory (51% of all listings), but the weakest by Top 10% hit rate overall. Within its large-group (4BR+, sleeps 10+) slice, the winning product is a detached, neighborhood-appropriate group-stay house with a fully programmed outdoor amenity zone — not simply a bigger bedroom count.",
    atAGlance: {
      bedBath: "Target 4–6 bedrooms (7–8BR possible but treat with caution — thinner evidence, often confounded by duplex/two-structure products) · 3.5+ baths preferred for 10–12 guests · 3 baths is the workable floor · 2 baths is low-tier/caution only",
      sleeps: "Sleeps 10–14, underwriting center 12 (sleeps 16 can work with real beds, enough bathrooms, and no duplex/second-unit confound — avoid underwriting to inflated sleeps 18–20+ marketing claims)",
      heroMechanism: "Location (Uptown, South End/Wilmore, NoDa, Plaza Midwood) paired with a fully programmed outdoor/group-stay amenity bundle — hot tub/spa hook, fire pit, games, dining/lounge seating — driving adult group-trip demand (bachelor/bachelorette, birthday weekends, sports/concert weekends), not a couples-getaway or family-vacation-first ICP",
      revenue: "Modeled/directional Revenue Potential across the Downtown large-group comp set (n=39): median $78,594, roughly $37,500–$165,000 excluding one structural-confound duplex outlier (itself modeling to $199,741) — directional evidence, not a confirmed underwriting range",
      primaryRequirement: "A compact urban lot must photograph as a complete group-stay product — one fully programmed outdoor amenity zone — not just clear a bedroom-count threshold. See Property Profile / Amenities below",
    },
    // Clearwater's "1. Buy-Box Summary" hero card, reused for pending boxes
    // too (see overviewBlock() in render.js). whyItWorks/chips/revenueChips
    // describe the region-wide N=368 stat (charlotte_overview.ipynb) and are
    // left as-is; heroImage/statusBadge are updated now that Property
    // Profile through Projections below exist for this box.
    overview: {
      statusBadge: "Downtown large-group comp research complete (n=39) — Property Profile through Projections built out below; acquisition price/revenue underwriting targets still pending",
      thesis: "The market's largest region by inventory (51% of all listings), but the weakest by Top 10% hit rate — capped mostly by a smaller-bedroom product mix.",
      whyItWorks:
        "This region wins on inventory scale, not amenity/product fit — 51% of the market's listings sit here, but the same small-unit mix that drives that scale (51% are 1-2BR) also caps its Top 10% hit rate at 8%, the lowest of the three regions.",
      heroImage: photo("downtown/abnb_1108803702700685352/front_exterior.avif", "Cedar-and-black-panel modern infill home in NoDa", "Modern Infill — Cedar/Black Panel, NoDa. The fanciest true exterior in the Downtown comp set — see Property Profile below."),
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

    // Sourced from this team's own Downtown comp research (the large-group
    // Downtown/Uptown population: 4+ bedrooms, sleeps 10+, n=39 -- see the
    // decisions memo referenced above), not charlotte_overview.ipynb's
    // region-level stats used in atAGlance/overview. Follows the same
    // pendingSections vocabulary/grouping Walid's Outskirts section
    // established (groupTitle/title/body/items/images/charts/chartsRow/
    // ranked/mapEmbed). Airbnb/listing photos throughout are internal-use
    // only unless rights are separately cleared -- do not present any of
    // these images as public/client-safe. "Downtown large-group comp set" /
    // "Downtown target comp set" / "Downtown large-format comps" is this
    // section's client-readable name for the n=39 population; avoid the
    // word "corrected" in any webpage-visible copy below.
    pendingSections: [
      { groupTitle: "Property Profile" },
      {
        title: "Bedrooms & Bathrooms",
        body:
          "<p><strong>Target: 4–6 bedrooms.</strong> 7–8BR is possible but should be treated with caution — the evidence is thinner and is often confounded by duplex/two-structure products (several of the largest-bedroom comps in this comp set are structural confounds, not clean single-home revenue proof).</p>" +
          "<p><strong>Preferred bathroom target: 3.5+ baths for 10–12 guests.</strong> Workable floor: 3 baths. 2 baths is low-tier/caution only — not the main acquisition target.</p>",
        chartsRow: [
          photo("downtown/charts/downtown_size_distribution.png", "Bedroom, bathroom, and sleeps count histograms for the Downtown large-group comp set", "Bedroom/bathroom/sleeps distribution across the Downtown large-group comp set (n=39) — supports the bedroom/bathroom target and the ideal sleep count."),
          photo("downtown/charts/downtown_revenue_by_size.png", "Box plots of modeled Revenue Potential by bedroom count and sleeps for the Downtown large-group comp set", "Modeled Revenue Potential by bedroom count / sleeps (n=39) — supports the size/revenue relationship."),
        ],
      },
      {
        title: "Ideal Sleep Count",
        body:
          "<p><strong>Target: sleeps 10–14.</strong> Clean underwriting center: sleeps 12. Sleeps 16 can work, but only with real beds, enough bathrooms, and no duplex/second-unit confound. Avoid underwriting to inflated sleeps 18–20+ marketing claims unless bed layout and structure are independently verified.</p>" +
          "<p>Beds should be mostly real beds — sofa beds / air mattresses should only be a minority of overflow capacity, and must be clearly disclosed.</p>",
      },
      {
        title: "Architectural Style",
        body:
          "<p>Downtown Charlotte does not require one exact architectural style. Winning comps are detached, neighborhood-appropriate homes with a clear visual identity: urban farmhouse, modern infill, renovated bungalow, or historic home with STR-ready upgrades. The common thread is that the exterior reads like a credible group-stay product and supports the location/amenity thesis.</p>",
        images: [
          photo("downtown/abnb_1217644555390940891/front_view.avif", "Two-story urban farmhouse with a full-width front porch", "Urban Farmhouse — Two-Story, Full-Width Porch. Two-story urban farmhouse with a full-width front porch, showing how a detached Downtown STR can lead with a clear, ownable exterior identity rather than generic rental curb appeal."),
          photo("downtown/abnb_1409730515899310183/front_view.avif", "Contemporary infill home on a compact urban lot", "Modern Infill — Compact Lot, Contemporary Massing. Contemporary infill on a compact urban lot, showing the most reproducible Downtown build/renovation template when the buyer wants modern event-house positioning near the core."),
          photo("downtown/abnb_1108803702700685352/front_exterior.avif", "Cedar-and-black-panel modern infill home in NoDa", "Modern Infill — Cedar/Black Panel, NoDa. Cedar-and-black-panel modern infill in NoDa, showing that a high-design exterior can support the location thesis when capacity is underwritten to real beds rather than headline sleeps. Caveat: revenue/sleep claim is capacity-adjusted to roughly 10 real sleeps — do not cite the listing's headline sleep count without this adjustment."),
          photo("downtown/abnb_659409220270509844/front_view.avif", "Renovated bungalow with modest Craftsman massing", "Renovated Bungalow — Craftsman Massing, Modern Program. Renovated bungalow exterior with modest Craftsman massing, showing that a normal neighborhood facade can still work when the backyard and amenity program carry the STR identity."),
          photo("downtown/abnb_1492847561370946959/exterior.avif", "Historic porch-front home on a streetcar-era block", "Historic Home — Victorian-Era Porch, Streetcar Block. Historic porch-front home on a streetcar-era block, showing the acceptable low-tier architecture floor and why character alone should not be mistaken for ceiling revenue. Present as floor-tier evidence, not a ceiling example."),
        ],
      },
      {
        title: "Backyard Size",
        body:
          "<p>For Downtown Charlotte, the winning lot does not need to be huge, but it must photograph as a complete outdoor group zone. The best comps show compact urban yards converted into full amenity bundles: hot tub/pool or swim spa, fire feature, games, dining/lounge space, lighting, and clear circulation.</p>",
        images: [
          photo("downtown/abnb_1409730515899310183/entire_backyard_containing_hottub_cornhole_minigolf_firepit_stringlights.avif", "Compact backyard programmed with hot tub, games, fire seating, and string lights", "Compact Yard, Full Amenity Bundle — Hot Tub, Games, Fire, Lighting. Compact backyard programmed with hot tub, games, fire seating, and string lights, showing that Downtown yard size matters less than whether the lot photographs as one complete group-entertainment zone."),
          photo("downtown/abnb_659409220270509844/backyard_showing_swimspa_integrated_hot_tub_firepit_dining_area_under_pergola.avif", "Swim spa, fire pit, and pergola-covered dining in one backyard", "Swim Spa, Fire Pit, and Covered Dining in One Yard. Swim spa, fire pit, and pergola-covered dining in one backyard, showing the compact South End/Wilmore-style layout that turns a small urban lot into a full outdoor stay experience."),
        ],
      },

      { groupTitle: "Amenities" },
      {
        title: "Amenity Prevalence",
        body:
          "<p>The Downtown amenity chart should be read as conservative directional evidence, not a full amenity survey: the source file has no dedicated amenity flags, so amenities are counted only when they appear explicitly in the title or analyst role fields. Even with that limitation, the pattern is useful. Game/arcade features are the most common text signal (8 of 39, 21%), fire pits are most concentrated in the High/Ceiling tier (7 of 39 overall, 3 of 6 in High/Ceiling — 50%), and hot tub/spa, outdoor lounge/dining (each 6 of 39, 15%), pool/swim-spa, rooftop/skyline (4 of 39, 10%), gym, and wellness features appear as selective differentiators rather than universal requirements.</p>",
        charts: [
          photo("downtown/charts/downtown_amenity_prevalence_by_tier.png", "Bar chart of text-derived amenity prevalence by revenue tier for the Downtown large-group comp set", "Amenity prevalence by revenue tier (n=39, Downtown large-group comp set) — text-derived from title/final_comp_role/design_role fields, not explicit amenity flags. Treat as a conservative floor on true prevalence, not a full amenity survey."),
        ],
      },
      {
        title: "Must-Have's",
        body:
          "<p>Must-have amenities are not a random checklist. The Downtown product needs a programmed outdoor gathering area with dining/lounge seating, a fire pit or equivalent group anchor, a hot tub/spa-style hook or substitute premium outdoor feature, at least one intentional game/entertainment element, and a kitchen/dining setup that supports group stays.</p>",
        items: [
          "Outdoor gathering area",
          "Outdoor dining / lounge seating",
          "Fire pit or equivalent gathering anchor",
          "Hot tub / spa-style anchor, or a clear substitute premium outdoor hook",
          "Game / entertainment feature",
          "High-quality kitchen / group meal setup",
        ],
        images: [
          photo("downtown/abnb_1409730515899310183/firepit.avif", "Dedicated dusk fire-pit area with grouped seating", "Fire Pit Gathering Anchor. Dedicated dusk fire-pit area with grouped seating, showing the gathering anchor that makes an outdoor zone usable for event-weekend and nightlife-driven groups. Fire pit is the strongest tier signal in the chart: 50% of High/Ceiling comps versus 18% overall."),
          photo("downtown/abnb_1409730515899310183/hottub.avif", "Hot tub staged as an evening amenity", "Hot Tub / Spa-Style Hook. Hot tub staged as an evening amenity, showing the spa-style hook that helps a compact Downtown yard feel premium instead of merely functional."),
          photo("downtown/abnb_1409730515899310183/gameroom_arcade_focus.avif", "Finished arcade room with multiple cabinets and a coherent theme", "Arcade / Game-Room Feature. Finished arcade room with multiple cabinets and a coherent theme, showing the intentional entertainment feature expected in a group-stay Downtown product. Game/arcade/putting green is the highest overall text-derived amenity signal at 21%."),
          photo("downtown/abnb_659409220270509844/covered_patio_tv_skyline_view.avif", "Covered patio with lounge seating and TV", "Covered Lounge / Outdoor Living Zone. Covered patio with lounge seating and TV, showing how outdoor dining/lounge seating becomes a weather-protected second living room for groups."),
          photo("downtown/abnb_659409220270509844/kitchen.avif", "Large kitchen with oversized island seating", "Group-Ready Kitchen. Large kitchen with oversized island seating, showing the group-meal setup needed for pregame, breakfast, and shared meals in a sleeps-10+ house."),
          photo("downtown/abnb_1409730515899310183/indoor_dining_table.avif", "Long dining table staged for a large group meal", "Dedicated Group Dining Setup. Long dining table staged for a large group meal, showing why the Downtown product needs real dining capacity rather than only bar stools or scattered seating."),
        ],
      },
      {
        // No outer `title` here -- niceToHaveRankedBlock() already renders
        // its own "Nice-to-Have, Ranked" <h4>, matching Lake's convention.
        ranked: {
          note: "Nice-to-have amenities are premium hooks, not baseline requirements. Pool / swim spa, rooftop or skyline features, a real gym, and sauna/cold-plunge wellness can improve the story when the property already clears the core buy box, but the Downtown evidence is directional rather than causal: amenity signals are text-derived, sample sizes are small, and Revenue Potential is modeled. The right move is to secure the must-have group-stay bundle first, then add one or two differentiators that fit the specific lot, structure, and neighborhood.",
          items: [
            {
              name: "Pool / swim spa",
              revenueUplift: "+30% avg / +49% median",
              n: 3,
              note: "Ceiling-tier hit-rate delta: -17pp. Strongest premium outdoor differentiator when the lot can support it — pool/swim-spa comps sit above the population on modeled revenue, but all three are Mid-tier rather than Ceiling. Treat as a premium visual hook, not a proven top-tier hit-rate driver.",
              images: [
                photo("downtown/abnb_659409220270509844/backyard_swim_spa_hot_tub.avif", "Focused swim-spa / hot-tub view in a compact yard", "Pool / Swim Spa as a Premium Outdoor Hook. Focused swim-spa / hot-tub view in a compact yard, showing pool/spa as a premium visual hook that can strengthen the story without being a proven ceiling-tier driver."),
              ],
            },
            {
              name: "Rooftop / skyline feature",
              revenueUplift: "+25% avg / +48% median",
              n: 4,
              note: "Ceiling-tier hit-rate delta: +11pp. Best urban-specific differentiator — reinforces the Downtown/event thesis and shows a positive ceiling-tier signal, but the sample is thin and the best visual comp is downweighted for national-brand/platform effect.",
              images: [
                photo("downtown/abnb_708767588165071588/rooftop_deck_gazebo_lounge_wide.jpeg", "Rooftop deck with covered lounge seating", "Rooftop Lounge / Skyline-Oriented Outdoor Room. Rooftop deck with covered lounge seating, showing the urban-specific version of outdoor premium space. Caveat: this comp is downweighted for national-brand/platform effect."),
              ],
            },
            {
              name: "Gym / fitness feature",
              revenueUplift: "+64% avg / +104% median",
              n: 3,
              note: "Ceiling-tier hit-rate delta: +56pp. Strongest statistical signal in the amenity set — two of three gym-flagged comps are Ceiling-tier, but the amenity is capital-intensive and should remain a high-end differentiator, not a baseline requirement.",
              images: [
                photo("downtown/abnb_1217644555390940891/gym.avif", "Dedicated gym-style room with real equipment and glass doors", "Gym / Fitness Feature. Dedicated gym-style room with real equipment and glass doors, showing the fitness feature as a capital-intensive differentiator rather than a baseline Downtown requirement."),
              ],
            },
            {
              name: "Sauna / cold plunge / wellness",
              revenueUplift: "+1% avg / +21% median",
              n: 2,
              note: "Ceiling-tier hit-rate delta: -16pp. Emerging premium wellness layer — the photo value is strong, but the current Downtown sample is too thin to prove a revenue or ceiling-tier advantage.",
              images: [
                photo("downtown/abnb_1286598604898666052/barrel_sauna.avif", "Barrel sauna staged in the backyard", "Sauna / Wellness Add-On. Barrel sauna staged in the backyard, showing the wellness layer as a photo-forward add-on when the core group-stay buy box is already satisfied."),
                photo("downtown/abnb_1286598604898666052/cold_plunge.png", "Standalone cold-plunge tub detail", "Cold Plunge Detail. Standalone cold-plunge tub detail, showing how the wellness thesis works best as a package with sauna/spa positioning rather than as an isolated item."),
              ],
            },
          ],
        },
      },

      { groupTitle: "Geo Considerations" },
      {
        title: "View / Waterfront / Privacy-Seclusion",
        body:
          "<p>Views and waterfront are not core requirements. Downtown Charlotte is not a lake or view-driven buy box. Skyline views can strengthen the marketing story when already present, but they should not substitute for verified proximity to named demand drivers. Waterfront is not relevant here. For privacy, the target is not seclusion; it is a contained, guest-ready outdoor environment where the hot tub, fire pit, dining/lounge, and games feel private enough to photograph and operate well in an urban neighborhood.</p>" +
          "<p>This map should not be read as a ZIP-boundary map. Every marker is in the Downtown target comp set, but marker color reflects comp usability: clean reproducible revenue/design comps, caution cases, counterexamples, and structural confounds. The default view shows client-map-eligible comps first (16 of 39); use the filters to reveal the full internal evidence base before drawing acquisition conclusions.</p>",
        images: [
          photo("downtown/abnb_1108803702700685352/view_of_uptown_skyline.avif", "Clear Uptown skyline view from a NoDa-adjacent ceiling comp", "Skyline View as a Bonus, Not the Thesis. Clear Uptown skyline view from a NoDa-adjacent ceiling comp, showing view upside when it is already present while reinforcing that Downtown demand is still driven by location and product execution. Best available skyline image, and it comes from a Ceiling comp — use it to show upside when present, not as a requirement."),
        ],
        mapEmbed: {
          url: "assets/downtown/downtown_comp_map.html",
          title: "Interactive map — Downtown large-group comp set (n=39), filterable by revenue tier, comp status, and client-map eligibility",
        },
      },

      { groupTitle: "Property Locations" },
      {
        title: "Ideal Location(s) & Popular Places",
        body:
          "<p>The target is not \"any house near Uptown.\" The strongest acquisition zones are Plaza Midwood, South End/Wilmore, NoDa, Dilworth, and select Uptown/Third-Fourth Ward adjacent parcels where the address has a specific demand-driver story. ZIP code alone is not enough: the same ZIPs contain clean comps, caution cases, and counterexamples. A candidate should be screened by named-neighborhood fit, walkability or short-drive proximity to a real demand driver, parking, safety, and whether the lot can support the outdoor amenity bundle.</p>" +
          "<ol>" +
          "<li><strong>Plaza Midwood</strong> — best-evidenced overall and the lead acquisition zone; the strongest existing acquisition-pricing support is here.</li>" +
          "<li><strong>South End / Wilmore</strong> — strongest walkability and full-execution STR product signal.</li>" +
          "<li><strong>NoDa</strong> — strong revenue/design support; promising if the acquisition basis is better than Plaza Midwood / South End.</li>" +
          "<li><strong>Dilworth</strong> — valid target zone; walkable location plus host trust can win even with a sparse amenity stack, so price discipline matters.</li>" +
          "<li><strong>Uptown / Third-Fourth Ward adjacent</strong> — strong demand-driver proximity, but the weakest literal acquisition target because single-family inventory is thin; best pursued through adjacent, walkably proximate parcels.</li>" +
          "<li><strong>Secondary / verify-per-address zones</strong> — Belmont, Wesley Heights, Elizabeth, Fourth-Ward-adjacent pockets, and the LoSo brewery corridor can work only when the specific address proves the demand-driver connection.</li>" +
          "</ol>" +
          "<p>Popular-place logic should focus on named demand drivers, not generic proximity claims. The strongest Downtown comps tie themselves to Bank of America Stadium, Uptown/Center City, South End/Wilmore, NoDa, Plaza Midwood, Dilworth, brewery/nightlife corridors, parks, and event venues. Attractions like the Convention Center, Spectrum Center, NASCAR Hall of Fame, Camp North End, Optimist Hall, and Music Factory help the broader travel story, but the acquisition screen should still start with the specific neighborhood/corridor, not a citywide attractions list.</p>" +
          "<table class=\"summary-sheet-table\">" +
          "<tr><td>Event / urban core</td><td>Bank of America Stadium, Spectrum Center, Uptown / Center City, Charlotte Convention Center, NASCAR Hall of Fame — supports sports, concerts, conventions, and event-weekend group demand.</td></tr>" +
          "<tr><td>Nightlife / dining corridors</td><td>South End, NoDa, Plaza Midwood, brewery corridors, Optimist Hall, Music Factory — supports bachelor/bachelorette, birthday, friend-group, and weekend leisure demand.</td></tr>" +
          "<tr><td>Parks / neighborhood anchors</td><td>Dilworth, Freedom Park, Latta Park, Camp North End — supports neighborhood credibility, walkable-adjacent stays, and non-nightlife group trips.</td></tr>" +
          "<tr><td>Transit support</td><td>LYNX Blue Line, CityLYNX Gold Line — a helpful access layer, but not the core thesis by itself.</td></tr>" +
          "</table>",
      },

      { groupTitle: "Traveler Demographics" },
      {
        title: "Traveler ICP",
        body:
          "<p><strong>Primary: adult group trips.</strong> In the Downtown large-format comp set, group-trip review share averages 61.8%, far above family, pet, or other stay types. The target guest is not a couples getaway or generic family vacation; it is a large group choosing a house over hotels because they need shared gathering space, real beds, a kitchen/group-meal setup, outdoor amenities, and easier coordination around Uptown, South End, NoDa, Plaza Midwood, and event-weekend demand.</p>" +
          "<p>Families and wedding-adjacent groups matter, but they are secondary. Pet-first and couples-first positioning should not drive the buy box.</p>",
        charts: [
          photo("downtown/charts/downtown_traveler_icp.png", "Pie chart of traveler ICP for the Downtown large-format comp set: 61.8% group trip, 15.1% stayed with kids, 3.6% stayed with pet, 19.5% other", "Traveler ICP — Downtown large-format comps. Group trip 61.8%, stayed with kids 15.1%, stayed with pet 3.6%, other 19.5% — workbook review-demographic fields, directional evidence, not a complete guest survey."),
        ],
      },

      { groupTitle: "Comp Set" },
      {
        title: "Design Comp Set",
        body:
          "<p>The Design Comp Set is not a revenue-tier ranking. It shows the design language Downtown buyers should study: statement dining rooms, finished entertainment rooms, premium kitchen/bath finishes, work/lounge zones, and distinctive details that make a large urban STR feel intentional rather than generic. Front exteriors are not used here — exterior style is already covered in Property Profile / Architectural Style.</p>",
        images: [
          photo("downtown/abnb_1409730515899310183/indoor_dining_table.avif", "Long dining table under a saturated pink ceiling", "Statement Group Dining — Pink Ceiling, Long Table. Long dining table under a saturated pink ceiling, showing the kind of memorable group-meal room that makes a Downtown STR feel designed for celebrations, not just furnished."),
          photo("downtown/abnb_1409730515899310183/interior_2.avif", "Bold lounge/living area with color, pattern, and styled seating", "Color-Forward Lounge / Living Room. Bold lounge/living area with color, pattern, and styled seating, showing how Downtown design can be louder and more event-oriented than a neutral suburban rental."),
          photo("downtown/abnb_1409730515899310183/gameroom_interior_and_shuffleboard_table.avif", "Finished game room with shuffleboard and mural graphics", "Finished Game Room — Shuffleboard and Mural Wall. Finished game room with shuffleboard and mural graphics, showing the difference between a themed entertainment room and a random game table placed in spare space."),
          photo("downtown/abnb_1217644555390940891/dining_area.avif", "Sculptural dining area with statement lighting, art, and wine-cart styling", "Sculptural Dining Moment. Sculptural dining area with statement lighting, art, and wine-cart styling, showing how furnishing details can give a group room a distinct design point of view."),
          photo("downtown/abnb_1217644555390940891/wine_cellar.avif", "Dedicated wine-storage detail", "Wine Cellar / Premium Detail. Dedicated wine-storage detail, showing the kind of small premium moment that helps a listing photograph like a curated stay instead of a basic rental."),
          photo("downtown/abnb_1108803702700685352/kitchen.avif", "Dark modern kitchen with stone counters and full-height cabinetry", "Modern Dark Kitchen — Stone and High-Contrast Finishes. Dark modern kitchen with stone counters and full-height cabinetry, showing the finish-level reference for a design-forward infill comp without making a revenue claim by itself."),
          photo("downtown/abnb_1108803702700685352/bathroom.avif", "Bathroom with pink accent wall, black fixtures, and marble-look shower", "Design-Forward Bath — Pink Wall and Marble Shower. Bathroom with pink accent wall, black fixtures, and marble-look shower, showing that the design story should carry into secondary spaces guests will remember and photograph."),
          photo("downtown/abnb_1108803702700685352/office.avif", "Moody workroom with dark walls, large windows, and a finished palette", "Moody Office / Workroom. Moody workroom with dark walls, large windows, and a finished palette, showing how flex rooms can become intentional design moments instead of leftover rooms."),
          photo("downtown/abnb_1409730515899310183/living-room.png", "Styled living-room image from the strongest Downtown template", "Additional Styled Living Room. Styled living-room image from the strongest Downtown template, showing the lounge-side design language that supports an event-house product beyond the backyard."),
          photo("downtown/abnb_708767588165071588/rooftop_cabana_daybed_design_detail.jpeg", "Rooftop cabana/daybed detail", "Rooftop Cabana / Daybed Detail. Rooftop cabana/daybed detail, showing the urban outdoor design moment that can make a Downtown stay feel photo-forward when rooftop space is available."),
          photo("downtown/abnb_1286598604898666052/plunge_pool.avif", "Compact plunge-pool detail", "Plunge Pool / Wellness Design Detail. Compact plunge-pool detail, showing the wellness-design angle as a visual concept rather than treating it as a proven Mid-tier revenue driver."),
        ],
      },
      {
        title: "Revenue Comp Set — High Tier",
        body:
          "<p>The High Tier revenue gallery shows ceiling-level product execution without reusing the strongest images already assigned to Property Profile, Amenities, Geo, Nice-to-Have's, or Design Comp Set. No front exteriors here; the gallery is still product-led, but through interiors, outdoor living, bedrooms, baths, fitness, and dining support.</p>",
        images: [
          photo("downtown/abnb_1217644555390940891/living_room.avif", "Open living/kitchen great-room view from a ceiling comp", "Ceiling Interior Scale. Open living/kitchen great-room view from a ceiling comp, showing the interior scale and finish baseline expected before a Downtown property can underwrite to the high tier."),
          photo("downtown/abnb_1217644555390940891/bathroom_1.avif", "Large bath with freestanding tub and walk-in shower", "Premium Bath Finish. Large bath with freestanding tub and walk-in shower, showing that high-tier execution depends on bathroom quality and capacity, not only headline outdoor amenities."),
          photo("downtown/abnb_1217644555390940891/patio_with_sofa_tv.avif", "Covered outdoor lounge with sofa seating and TV", "Covered Outdoor Living. Covered outdoor lounge with sofa seating and TV, showing the kind of added living area that supports high-tier group stays without relying on bedroom count alone."),
          photo("downtown/abnb_1108803702700685352/gym.avif", "Finished gym with real equipment", "Ceiling Fitness Amenity. Finished gym with real equipment, showing a ceiling-tier amenity that can lift the product when paired with strong location and design rather than standing alone."),
          photo("downtown/abnb_1108803702700685352/bedroom.avif", "Large staged bedroom with modern finish quality and natural light", "Polished Bedroom / Sleep Product. Large staged bedroom with modern finish quality and natural light, showing that high-tier revenue still depends on real bedroom comfort, not inflated sleep claims."),
          photo("downtown/abnb_1108803702700685352/dining_area.avif", "Dining area with visual separation and bar storage", "Group-Meal Support. Dining area with visual separation and bar storage, showing the group-meal infrastructure that supports ADR upside in a large-format Downtown comp."),
          photo("downtown/abnb_1409730515899310183/interior.avif", "Alternate interior angle from the strongest urban/event template", "Fresh Interior Angle from Top Template. Alternate interior angle from the strongest urban/event template, showing that the high-tier product carries its design identity indoors as well as outdoors."),
        ],
      },
      {
        title: "Revenue Comp Set — Mid Tier",
        body:
          "<p>The Mid Tier gallery shows strong but more uneven execution: real amenities, useful outdoor programming, and some attractive product features, but not the most premium wellness/rooftop imagery that would blur into High Tier or Design Comp Set.</p>",
        images: [
          photo("downtown/abnb_659409220270509844/arcades.avif", "Dedicated arcade/game room with a bolder theme", "Mid-Tier Finished Arcade Room. Dedicated arcade/game room with a bolder theme than the floor examples, showing how Mid-tier homes can compete through focused entertainment without becoming full ceiling products."),
          photo("downtown/abnb_659409220270509844/firepit.avif", "Backyard fire-pit area with grouped seating", "Mid-Tier Fire Pit Execution. Backyard fire-pit area with grouped seating, showing a real gathering anchor even when the scene is less comprehensive than the ceiling-tier backyard bundles."),
          photo("downtown/abnb_659409220270509844/hottub.avif", "Focused hot-tub image from a Mid-tier comp", "Mid-Tier Hot Tub Hook. Focused hot-tub image from a Mid-tier comp, showing that a premium hook can appear below the ceiling tier when the broader product is more uneven."),
          photo("downtown/abnb_659409220270509844/lounge_area.avif", "Compact outdoor lounge/pergola area", "Simple Lounge Zone. Compact outdoor lounge/pergola area, showing useful Mid-tier seating that supports groups without reading as a polished luxury scene."),
          photo("downtown/abnb_659409220270509844/lawngames_cornhole.jpg", "Casual cornhole setup with outdoor circulation", "Lawn Games / Casual Group Use. Casual cornhole setup with outdoor circulation, showing the practical entertainment layer that helps Mid-tier group stays feel active without heavy build-out."),
          photo("downtown/abnb_554940316762261190/fenced_backyard_artificial_turf_lawn.avif", "Fenced artificial-turf yard with simple outdoor usability", "Fenced Turf Yard. Fenced artificial-turf yard with simple outdoor usability, showing a functional Mid-tier yard that is organized but not a full premium amenity bundle."),
          photo("downtown/abnb_554940316762261190/backyard_above_ground_pool_flamingo_float_umbrellas.avif", "Above-ground pool with playful staging in a fenced yard", "Casual Above-Ground Pool. Above-ground pool with playful staging in a fenced yard, showing a water amenity that adds booking appeal without reading like a luxury pool/spa product."),
          photo("downtown/abnb_33718219/living_room.avif", "Clean, ordinary living-room view from a lower-mid clean comp", "Solid Normal Interior. Clean, ordinary living-room view from a lower-mid clean comp, showing the realistic interior standard below the more design-forward ceiling examples."),
        ],
      },
      {
        title: "Revenue Comp Set — Low / Below Floor",
        body:
          "<p>The Low / Below Floor gallery is educational, not aspirational. It shows that amenities can exist but still fail to create ceiling revenue when the product is thin, underprogrammed, basic, or capped by layout/bath ratio/condition.</p>",
        images: [
          photo("downtown/abnb_968427563297398451/minimal_interior.avif", "Clean but modest interior with limited premium finish signal", "Low-Tier Interior Baseline. Clean but modest interior with limited premium finish signal, showing the acceptable floor before the product starts to feel too thin for Downtown group pricing."),
          photo("downtown/abnb_968427563297398451/gameroom_foosball_arcade.avif", "Small game area with foosball and an arcade feature", "Modest Game Feature. Small game area with foosball and an arcade feature, showing that simply having games does not create a higher-tier product if the execution is modest."),
          photo("downtown/abnb_1057352920150323374/living_room.jpeg", "Tidy, ordinary living room with basic furnishings", "Clean But Basic Living Room. Tidy, ordinary living room with basic furnishings, showing the normal-buyer floor standard without the design depth needed for a stronger revenue tier."),
          photo("downtown/abnb_1057352920150323374/tidy_basic_backyard_with_patchy_lawn_garden_bed_and_screened_gazebo.jpeg", "Plain backyard with patchy lawn and screened gazebo", "Basic Yard / Screened Gazebo. Plain backyard with patchy lawn and screened gazebo, showing usable outdoor space that still falls short of a programmed Downtown group zone."),
          photo("downtown/abnb_1005261131730210520/gameroom_pooltable.webp", "Simple pool-table/game-room setup from a below-floor caution comp", "Amenity Present, Product Still Capped. Simple pool-table/game-room setup from a below-floor caution comp, showing that one amenity does not overcome broader product caps such as bath ratio or thin execution."),
          photo("downtown/abnb_968762804004766798/bakyard_with_no_visible_amenities.avif", "Backyard with no visible programmed amenity zone", "No Outdoor Amenity Story. Backyard with no visible programmed amenity zone, showing the below-floor risk when outdoor space exists but gives guests no reason to gather or pay more."),
          photo("downtown/abnb_51823657/backyard_mostly_empty.avif", "Mostly empty backyard with limited guest-use programming", "Underprogrammed Yard Space. Mostly empty backyard with limited guest-use programming, showing that yard size alone is not a revenue product unless it becomes a usable stay-defining zone."),
        ],
      },

      { groupTitle: "Analyst Notes" },
      {
        title: "Notes / Insights",
        body:
          "<p>The Downtown notes are the practical rules behind the buy box: what makes the house convert, what caps it, and what should show up in photos before a buyer spends on more square footage or more amenities.</p>" +
          "<ul>" +
          "<li><strong>Bathroom ratio is the silent limiter.</strong> Downtown groups are getting ready for dinners, games, weddings, sports weekends, and nights out. Location and amenities do not fully rescue a house where 10-12 guests are sharing too few baths.</li>" +
          "<li><strong>Outdoor lounge space is the conversion layer.</strong> The patio, deck, pergola, rooftop, or covered seating area is what turns the house from a place to sleep into a place to gather.</li>" +
          "<li><strong>Amenities need to feel like one programmed zone.</strong> The best homes do not just have a hot tub, fire pit, games, and seating; those pieces photograph and operate as one group experience.</li>" +
          "<li><strong>Downtown upside is ADR-driven.</strong> The winning play is charging more per night through location, design, group functionality, and event-weekend positioning, not simply assuming higher occupancy.</li>" +
          "<li><strong>Design should photograph loud.</strong> Downtown can support stronger visual identity than a generic suburban family rental: statement dining, mural game rooms, rooftop/cabana moments, wine details, colored ceilings, and moody work/lounge rooms.</li>" +
          "<li><strong>Kitchen + dining should read as group logistics.</strong> The photo should show island seating, serving space, dining nearby, and a layout where the group can gather before going out.</li>" +
          "<li><strong>Game rooms need a theme.</strong> A pool table or arcade cabinet alone is not enough; stronger comps make the room feel intentional with a mural, lighting, multiple games, seating, and a reason guests would photograph it.</li>" +
          "<li><strong>Evening staging matters.</strong> Downtown demand is event/nightlife-heavy, so fire pit, hot tub, string lights, skyline, TV lounge, and arcade photos should sell the start or end of a night out.</li>" +
          "<li><strong>Do not overpack the house.</strong> Sleeps 12-14 with real beds and breathing room is cleaner than inflated sleeps 18-20 with air mattresses and cramped shared spaces.</li>" +
          "<li><strong>Parking is part of the urban product.</strong> It is not the sexiest feature, but group trips often arrive in multiple cars; off-street parking reduces friction near Uptown, South End, NoDa, Plaza Midwood, and Dilworth.</li>" +
          "</ul>",
        images: [
          photo("downtown/abnb_659409220270509844/covered_patio_tv_skyline_view.avif", "Covered patio with lounge seating, TV, and skyline-oriented evening feel", "Outdoor Lounge Space Is the Conversion Layer. Covered patio with lounge seating, TV, and skyline-oriented evening feel, showing why Downtown patios need to read as real group hangout rooms."),
          photo("downtown/abnb_659409220270509844/backyard_showing_swimspa_integrated_hot_tub_firepit_dining_area_under_pergola.avif", "Swim spa, fire pit, covered dining, and lounge circulation in one yard", "Amenities as One Programmed Zone. Swim spa, fire pit, covered dining, and lounge circulation in one yard, showing how the strongest Downtown amenity stacks work as a single programmed scene."),
          photo("downtown/abnb_1409730515899310183/entire_backyard_containing_hottub_cornhole_minigolf_firepit_stringlights.avif", "Compact yard staged with hot tub, games, fire pit, and lighting", "Sell the Hangout, Not Just the Amenity. Compact yard staged with hot tub, games, fire pit, and lighting, showing how one photo can sell the start or end of a Downtown group night."),
          photo("downtown/abnb_708767588165071588/rooftop_deck_gazebo_lounge_wide.jpeg", "Rooftop deck with covered lounge seating", "Rooftop Lounge / Urban Photo-Op. Rooftop deck with covered lounge seating, showing the urban version of outdoor space: a polished photo-op and gathering layer, not secluded acreage."),
          photo("downtown/abnb_1092979037109147151/plain_patchy_backyard_with_small_basic_deck_and_mismatched_seating.avif", "Patchy backyard with small basic deck and mismatched seating", "Yard Space Without a Cohesive Product. Patchy backyard with small basic deck and mismatched seating, showing the negative lesson that outdoor space does not convert when it feels unplanned."),
          photo("downtown/abnb_51823657/backyard_mostly_empty.avif", "Mostly empty backyard with limited guest-use programming", "Empty Yard Space Is Not the Product. Mostly empty backyard with limited guest-use programming, showing why buyers should budget for an actual lounge/amenity plan instead of relying on lot size."),
        ],
      },

      { groupTitle: "Projections" },
      {
        title: "Revenue Potential & Candidate Listings",
        body:
          "<p><strong>Revenue Potential</strong> throughout this section is modeled/directional (reconciles closely to ADR × Occupancy × 365), not trailing actual revenue, and should never be presented as confirmed historical earnings. Underwriting (target purchase price, target Revenue Potential range) for the Downtown buy box has not been decided yet and is not invented here.</p>" +
          "<p><strong>Candidate listing found (Zillow):</strong></p>" +
          "<ul>" +
          "<li><a href=\"https://www.zillow.com/homedetails/1416-Parkwood-Ave-Charlotte-NC-28205/6187855_zpid/\" target=\"_blank\" rel=\"noopener\">1416 Parkwood Ave, Charlotte, NC 28205 ↗</a></li>" +
          "</ul>" +
          "<p>Current best internal tracking lead. Not offer-ready. Zillow facts live-pulled September 8, 2026 — reverify Zillow/MLS/county facts before any offer. Do not present as final underwriting.</p>",
      },
    ],

    pendingNote:
      "Downtown / Uptown is the market's largest region by inventory (51% of all listings) and the weakest Top 10% hit-rate region overall (8%). The section above focuses specifically on the Downtown large-group buy box — 4+ bedrooms, sleeps 10+, n=39. The single highest-revenue listing in the market (\"Spacious 8BR Duplex, Sleeps 20, Walk to Breweries,\" $199,741) is a structural-confound duplex, so it should not be treated as a clean single-home ceiling proof. Revenue Potential throughout is modeled/directional, not confirmed historical earnings. Airbnb/listing photos throughout this section are internal-use only unless rights are separately cleared.",
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
          "<p><strong>Target range:</strong> 3+ bedrooms (4-5 ideal); 2+ bathrooms (3+ ideal).</p>" +
          "<p><strong>Bathrooms:</strong> 2 is a hard floor, not just a preference — 0% of Lakeside listings below 2 baths have ever reached the market's Top 10%. 3+ is the real \"nice to have\" above that floor; 2.5 does not show a clean improvement over 2.0 in this sample.</p>" +
          "<p><strong>Bedrooms:</strong> 1-2BR never reach the market's Top 10% within Lakeside (0% hit rate, N=8 and N=5); 3BR is technically possible but rare (7.7%, 1 of 13); 4BR/5BR is where it reliably happens (50-60%).</p>" +
          "<p><strong>Comfortable capacity:</strong> 8+ sleeps required — every Lakeside listing that has ever reached the market's Top 10% sleeps 8 or more, none below it.</p>" +
          "<p><strong>Beds per bedroom:</strong> no requirement — bunk density doesn't predict revenue on its own here (r=0.03); a real bunk room is still a legitimate way to reach the sleeps floor, it just isn't what separates high and low performers.</p>",
        charts: [
          photo("lake/charts/bedroom_count_analysis.png", "Six charts: median revenue and Top 10% hit rate, each by bedroom count, sleeps, and bathroom count, for Lakeside listings", "Lakeside (N=39): median revenue and Top 10% hit rate, by bedroom count, sleeps, and bathroom count — all three show the same pattern, a threshold rather than a straight line."),
        ],
        images: [
          photo("lake/rooms/bunk-room.avif", "Built-in dual bunk room with four beds and access ladders", "A built-in bunk room — one legitimate way to clear the sleeps 8+ floor above."),
          photo("lake/rooms/comp-primary-bedroom.avif", "Spacious primary bedroom suite with a sitting area and ensuite bathroom", "The primary bedroom from the first property in this buy box's comp set."),
          photo("lake/ai-gen/comp-six-bunk-room.jpg", "Six-bed, three-tier built-in bunk room", "A second real bunk room, from another of Lakeside's Top 10% comp-set listings — see ../LakeBuyBox/ai-gen/SOURCE.md for how this was sourced."),
        ],
      },
      {
        title: "Architectural Style",
        body: "<p><strong>Normal houses work.</strong> Style isn't mandatory as long as the property has lake access and waterfront — no architectural style has been tied to performance here. These are reference photos of the market's product type (a mix of ranch and split-level lake houses with an open interior layout), not a claim that this exact style outperforms others.</p>",
        images: [
          photo("lake/exterior/aerial-wide.avif", "Aerial view of a single-story lake house with a pool, dock, and mature trees", "Reference example: a ranch-style lake house with pool and private dock."),
          photo("lake/exterior/aerial-close.avif", "Close aerial view of a lake house with a screened porch, pool, and landscaped terraces", "Reference example: a screened-porch, split-level layout stepping down toward the water."),
          photo("lake/indoor/open-living-dining.avif", "Open-concept kitchen, dining, and living space with lake-facing windows", "Reference example: an open-concept living/dining/kitchen layout, common across the reference photos supplied so far."),
        ],
      },
      {
        title: "Backyard Size",
        body: "<p><strong>Outdoor lounges, sofas, fire pits, lakeside hot tubs, and sitting areas</strong> — no numeric size or usability metric has been analyzed, but this is the outdoor program that's consistently present. <strong>Outdoor sitting areas are distinctive here</strong> — sofas and soft cushions turn up outdoors, not just inside. <strong>Balconies double as lounges</strong>, almost like open-air living rooms, not just a pass-through to the yard.</p>",
        images: [
          photo("lake/exterior/pool-dock-view.avif", "Pool deck with lounge chairs overlooking a private dock and the lake", "Reference example: pool deck stepping down to a private dock."),
          photo("lake/porch/covered-porch-dock-view.avif", "Covered porch with string lights and wicker seating overlooking a lake and dock", "Reference example: a covered porch overlooking the dock, sized for a full outdoor living/dining setup."),
          photo("lake/balcony/balcony-sitting-1.avif", "Screened porch with rocking chairs, a coffee table, and a wicker sofa overlooking a lake and dock", "Reference example: a screened porch furnished as a full lounge, not just a pass-through — rocking chairs, a sofa, and a coffee table."),
          photo("lake/balcony/outdoor-sitting-4.avif", "Outdoor sitting area with cushioned furniture overlooking the water", "Reference example: a dedicated outdoor sitting area."),
          photo("lake/firepit/firepit-5.avif", "Fire pit seating area", "Reference example: another fire pit setup."),
          photo("lake/firepit/firepit-7-beside-lake.avif", "Fire pit positioned right beside the lake", "Reference example: a fire pit positioned directly beside the water."),
          photo("lake/hottub/hottub-5.avif", "Lakeside hot tub", "Reference example: another lakeside hot tub setup."),
          photo("lake/hottub/hottub-8.avif", "Hot tub on an outdoor deck", "Reference example: a hot tub on an outdoor deck."),
        ],
      },
      { groupTitle: "Amenities" },
      {
        title: "Amenity Prevalence By Tier",
        body:
          "<p>Prevalence by revenue tier for every tracked amenity (N=39), and presence per listing across Lakeside's Top 10% comp set (N=8).</p>",
        chartsRow: [
          photo("lake/charts/amenity_prevalence.png", "Grouped bar chart of amenity prevalence by revenue tier for Lakeside listings, Top 10% drawn on top of each group", "Amenity prevalence by tier (N=39) — Top 10% (green) drawn on top of each group, then Top 25%, then Other 75%."),
          photo("lake/charts/amenity_presence_compset.png", "Heatmap of amenity presence per listing across Lakeside's 8 Top 10% comp-set listings", "Amenity presence, Lakeside's Top 10% comp set only (N=8)."),
        ],
      },
      {
        title: "Must-Have's",
        body: "<p>Clears the ≥40%-of-Top-10%-or-≥60%-of-whole-market bar (N=8 Top 10% / N=39 whole) — plus Crib, added regardless: it's a cheap amenity to provide either way.</p>",
        items: ["Fire Pit", "Outdoor Dining Area", "Waterfront", "Lake Access", "Pack 'N Play / Travel Crib", "Hot Tub", "Crib"],
        images: [
          photo("lake/firepit/beach-firepit-dock.avif", "Small fire bowl on a sandy lake beach with a dock in the background", "A fire pit set up right at the water's edge — Fire Pit and Waterfront together, not two separate features here."),
          photo("lake/firepit/beach-firepit-chairs.avif", "Adirondack chairs around a fire pit on a sandy beach facing the lake and a dock", "Adirondack-chair fire pit seating on the beach, facing the dock."),
          photo("lake/porch/screened-porch-firepit-table.avif", "Screened porch with a wicker sectional and a fire-pit dining table, lake visible through the windows", "Reference example: a screened porch combining outdoor dining and lounge seating."),
          photo("lake/hottub/covered-porch-lake-view.avif", "Hot tub on a covered porch overlooking a lake and dock", "Reference example: a covered-porch hot tub facing the lake."),
          photo("lake/hottub/night-lit.avif", "Hot tub lit blue at night in a backyard setting", "Reference example: a nighttime hot tub setup."),
        ],
      },
      // Nice-to-Have, Ranked -- Clearwater's 5BR structure (score / revenue
      // uplift / Top-10%-hit-rate uplift / N per item, thin-data items
      // flagged rather than dropped, no Auto-Add tier). Score here is our
      // own transparent composite (median revenue uplift + Top-10%-hit-rate
      // uplift + sample size, each min-max normalized across the rankable
      // amenities) since Clearwater's exact weights weren't supplied to us.
      // N=0 ("never observed") amenities are dropped entirely rather than
      // flagged -- there's nothing to say about an amenity Lakeside has
      // zero examples of.
      {
        // No outer `title` here -- niceToHaveRankedBlock() already renders
        // its own "Nice-to-Have, Ranked" <h4>, so an outer <h3> with the
        // same text would just duplicate the heading.
        ranked: {
          note: "N≥2 is the minimum to rank in Lakeside (was N≥9). Pickleball and Playground are N=1 -- flagged, not dropped, but below even that floor.",
          items: [
            { name: "Pool Table", score: 0.67, revenueUplift: "+280%", p90Uplift: "+84pp", n: 2, note: "Smallest sample of any ranked item (N=2), but both pool-table listings reach the market's Top 10% — the highest hit-rate uplift here.", images: [
              photo("lake/pooltable/lake-view-room.avif", "Living room with a pool table and sectional sofa, sliding doors opening to a lake and dock view", "Reference example: a pool table room opening directly onto a lake/dock view."),
            ] },
            { name: "Game Room", score: 0.60, revenueUplift: "+250%", p90Uplift: "+50pp", n: 3, note: "Second-highest revenue uplift of any Nice-to-Have, on N=3.", images: [
              photo("lake/gameroom/game-room-sign.avif", "Game room with a pool table, sectional sofa, and arcade cabinet under a GAME ROOM sign", "Reference example: a dedicated game room with a pool table and arcade cabinet."),
              photo("lake/gameroom/game-room-1.avif", "Game room with arcade cabinets and seating", "Reference example: another dedicated game room."),
              photo("lake/gameroom/game-room-3-sitting.avif", "Game room combined with a lounge seating area", "Reference example: a game room doubling as a lounge area."),
              photo("lake/gameroom/property-6-child-game-room.jpeg", "Colorful kids' playroom with a patterned area rug and toy storage", "Property 6 (Mid tier) — its kids'/family playroom, a different flavor of \"game room\" than the pool-table version above."),
            ] },
            { name: "Pool", score: 0.49, revenueUplift: "+168%", p90Uplift: "+50pp", n: 3, note: "Strong revenue signal, same hit-rate uplift as Game Room, on N=3.", images: [
              photo("lake/pool/aerial-kidney-pool.avif", "Aerial view of a kidney-shaped pool with a screened porch and brick patio", "Reference example: a kidney-shaped pool and brick patio."),
            ] },
            { name: "Gym", score: 0.22, revenueUplift: "+24%", p90Uplift: "+5pp", n: 4, note: "Weakest signal of the rankable amenities — present, but a marginal differentiator here.", images: [] },
            { name: "Pickleball", n: 1, thinData: true, note: "N=1 in all of Lakeside — below even the N≥2 minimum, and that one listing has lower revenue than the market without it. Not recommended, despite being a common ask.", images: [] },
            { name: "Playground", n: 1, thinData: true, note: "N=1, below the N≥2 minimum.", images: [] },
          ],
        },
      },

      { groupTitle: "Geo Considerations" },
      {
        title: "Waterfront, View & Privacy",
        body:
          "<p><strong>Waterfront: absolutely mandatory.</strong> 100% of Lakeside's Top 10% (N=8) are flagged waterfront + lake-access (see Must-Have above); 20 of 39 Lakeside listings have neither flag, real room to add one. <strong>View:</strong> a lake view is what matters, preferably from a front deck. <strong>Privacy / seclusion:</strong> not necessary — not a factor here the way it might be in other markets. Map below: toggle Lakeside + Top 10% to see exactly which properties this describes, alongside the region's landmarks.</p>",
        mapEmbed: {
          url: "assets/overview/charlotte_overview_map.html",
          title: "Interactive map — Lakeside properties, revenue tiers, and demand-driver landmarks",
        },
        images: [
          photo("lake/firepit/sunset-firepit-lake.avif", "Adirondack chairs around a fire pit on a beach at sunset, facing a lake with a dock", "Reference example: direct lake-edge access at sunset."),
          photo("lake/view/property-6-twilight.avif", "Twilight view over the lake from a property, with a boat dock visible below", "Property 6 — the lake view from a front deck at twilight."),
          photo("lake/view/property-5-aerial.avif", "Aerial view of a lake property with a pool and dock along a wooded shoreline", "Property 5 — aerial view of the lake frontage."),
          photo("lake/view/lake-aerial-wide.avif", "Aerial view of a lake house with a pool and dock surrounded by mature trees", "Reference example: a lake-house lot with pool and private dock, aerial view."),
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
          "<p><strong>Large groups and families with kids.</strong> Not supported: a couples-first positioning.</p>",
        charts: [
          photo("lake/charts/traveler_icp_pie_chart.png", "Pie chart of average review composition across all Lakeside listings: 26.3% group trip, 20.8% stayed with kids, 12.3% stayed with a pet, 40.5% other", "Average review composition, all Lakeside listings (not Top-10%-segmented) — Group Trip is the largest named share, ahead of Stayed with Kids and Stayed with a Pet."),
        ],
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
                    images: [
                      photo("lake/compset/exterior/property-6-exterior.avif", "Dusk exterior of a mid-century modern lake house with a tall gabled glass facade and a covered lower deck", "Property 6 (Mid tier, #6 by revenue) — exterior at dusk."),
                      photo("lake/compset/exterior/property-6-exterior-2.avif", "Fire pit patio with Adirondack chairs, the lit house visible on the hill behind it at dusk", "Property 6 — the backyard fire pit patio, house visible behind."),
                    ],
                  },
                ],
                low: [
                  {
                    title: "Castaway Cove— 5Bed Lake Retreat—Fire Pit—Hot Tub!",
                    url: "https://www.airbnb.com/rooms/52281872",
                    stats: "$99,613 · $466.33 ADR · 57.71% occ · 5BR/2BA, sleeps 14 · 4.9★ (97)",
                    images: [
                      photo("lake/compset/exterior/property-7-exterior.jpeg", "Aerial view of a wooded lakefront peninsula with several docks along the shoreline", "Property 7 (Low tier, #7 by revenue) — aerial exterior/grounds view."),
                      photo("lake/compset/exterior/property-7-exterior-2.avif", "Lake house exterior at twilight", "Property 7 — a second, twilight exterior view."),
                    ],
                  },
                  {
                    title: "Your Lake House Awaits!",
                    url: "https://www.airbnb.com/rooms/1294906461944120744",
                    stats: "$87,852 · $360.50 ADR · 67.04% occ · 3BR/2BA, sleeps 8 · 4.95★ (104)",
                    images: [photo("lake/compset/exterior/property-8-exterior.avif", "Ranch-style lake house exterior with a wraparound covered porch, lit up at dusk", "Property 8 (Low tier, #8 by revenue) — exterior at dusk.")],
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

      // Analyst Notes -- from the team's own filled-in buy-box template
      // (../LakeBuyBox/BuyBoxLakesideCharlotte.docx, "Analyst Notes ->
      // Notes/Insights"), same group Outskirts has.
      { groupTitle: "Analyst Notes" },
      {
        title: "Notes / Insights",
        // Each note paired with its own image(s), instead of one bulleted
        // list followed by a disconnected photo gallery -- rendered by
        // analystNotePairsBlock()/analystNotePairItem() in render.js.
        notes: [
          {
            text: "<strong>Waterfront is a must, and it effectively requires lake access too</strong> — properties without one reportedly underperform. Consistent with Lake Access already being a Must-Have above (100% of Top 10%, 46.2% of the whole market).",
            images: [
              photo("lake/pool/pool-6-beside-lake.avif", "Swimming pool positioned directly beside the lake", "Reference example: a property combining direct lake access with a pool right at the water's edge."),
            ],
          },
          {
            text: "<strong>Patios and sitting lounges</strong> are a recurring theme across top listings.",
            images: [
              photo("lake/balcony/lakeside-dining.avif", "Dining room with a long table set for eight, glass doors opening onto a lake-view patio", "Reference example: a patio/dining area opening straight onto the lake view."),
              photo("lake/balcony/outdoor-dining-1.avif", "Outdoor dining table and chairs on a patio", "Reference example: outdoor dining setup."),
              photo("lake/balcony/outdoor-dining-2.jpeg", "Outdoor dining area", "Reference example: another outdoor dining setup."),
              photo("lake/balcony/outdoor-dining-3.avif", "Outdoor dining table on a deck", "Reference example: a third outdoor dining setup."),
            ],
          },
          {
            text: "<strong>Indoor sitting areas show up everywhere, styled with clean colors.</strong>",
            images: [
              photo("lake/indoor/indoor-living-1.jpg", "Indoor living/sitting area with colorful decor", "Reference example: an indoor sitting area with clean, bright colors."),
              photo("lake/indoor/indoor-living-2.avif", "Indoor living area", "Reference example: another indoor sitting area."),
              photo("lake/indoor/indoor-living-5.avif", "Indoor living area", "Reference example: another indoor sitting area."),
              photo("lake/indoor/indoor-living-8.avif", "Indoor living area", "Reference example: another indoor sitting area."),
              photo("lake/indoor/bathroom-2.avif", "Bathroom", "Reference example: a bathroom, styled consistently with the rest of the interior."),
              photo("lake/indoor/kitchen-1.avif", "Kitchen", "Reference example: a kitchen."),
              photo("lake/indoor/kitchen-2.avif", "Kitchen", "Reference example: another kitchen."),
              photo("lake/indoor/kitchen-5.avif", "Kitchen", "Reference example: a third kitchen."),
            ],
          },
          {
            text: "<strong>Lake-activity imagery and accessories</strong> (kayaks, docks) are worth featuring.",
            images: [
              photo("lake/balcony/outdoor-activities.webp", "Two people in a small boat on the lake at golden hour, near a dock", "Reference example: lake-activity imagery (kayak/small boat) — the kind of accessory shot the analyst notes flag as worth featuring."),
            ],
          },
        ],
      },

      // Lakefront vs. Castaway -- both are already in the comp set (High
      // tier #1 and Low tier #7); every number in compStats is pulled
      // straight from Compset.csv, verified against the row data directly
      // before writing this, not re-derived or taken on faith. The photo
      // rows use each property's own real listing photos (downloaded from
      // its actual Airbnb gallery -- see ../LakeBuyBox/CompComparison/),
      // not stock/reference images.
      { groupTitle: "Comp Deep-Dive" },
      {
        title: "Lakefront vs. Castaway: Why the Revenue Gap",
        body:
          "<p>Both are 5BR Lake Wylie waterfront comps with a beach, dock, hot tub, and fire pit. Lakefront earns <strong>83% more revenue</strong> — at <strong>lower</strong> occupancy. Not a demand story.</p>" +
          "<ul>" +
          "<li><strong>Not an occupancy story.</strong> Castaway occupies more (57.7% vs. 54.7%) — Lakefront earns 83% more purely on rate (ADR +92%).</li>" +
          "<li><strong>Bathrooms: 3.5 vs. 2.</strong> ~4.6 guests/bath vs. 7 guests/bath at max capacity.</li>" +
          "<li><strong>Sleeping design, not just sleep count.</strong> 10 beds incl. a built-in 6-person bunk room vs. 6 beds.</li>" +
          "<li><strong>Game room, data-confirmed.</strong> Lakefront flags Game Room + Pool Table; Castaway flags neither.</li>" +
          "<li><strong>Same dock flag, different asset.</strong> Both flag Waterfront + Lake Access identically — real photos below show very different docks.</li>" +
          "<li><strong>Cleaning fee works against Castaway.</strong> $520 vs. $374, despite the lower nightly rate.</li>" +
          "</ul>",
        compStats: [
          { label: "Revenue Potential", lakefront: "$182,749", castaway: "$99,613" },
          { label: "ADR", lakefront: "$896.51", castaway: "$466.33" },
          { label: "Occupancy", lakefront: "54.65%", castaway: "57.71%" },
          { label: "Bedrooms", lakefront: "5", castaway: "5" },
          { label: "Sleeps", lakefront: "16", castaway: "14" },
          { label: "Beds", lakefront: "10", castaway: "6" },
          { label: "Bathrooms", lakefront: "3.5", castaway: "2" },
          { label: "Cleaning Fee", lakefront: "$374", castaway: "$520" },
          { label: "Min Stay", lakefront: "5 nights", castaway: "3 nights" },
          { label: "Rating", lakefront: "4.95★ (97)", castaway: "4.9★ (97)" },
        ],
      },
      {
        title: "Same Amenity, Different Asset — In Photos",
        body:
          "<p>Real photos from each listing's own gallery (Airbnb + Vrbo), not reference/stock images — every photo below was pulled from the listing's full photo set and viewed directly before writing its caption.</p>",
        compPhotoRows: [
          {
            note: "<strong>Lakefront's kitchen is built for a crowd</strong> — two islands, a wine fridge, a wine-glass rack, subway tile, waterfall marble. <strong>Castaway's kitchen is a normal house kitchen</strong> — one run of cabinets, granite, a single sink. Competent, not an amenity in itself.",
            lakefront: photo("lake/compcompare/lakefront/kitchen.jpg", "Large kitchen with two islands, one painted blue, marble waterfall countertops, glass-front cabinets, and a built-in wine rack", "Lakefront Estate — two islands, wine fridge, waterfall marble."),
            castaway: photo("lake/compcompare/castaway/kitchen.jpg", "Compact galley kitchen with granite countertops, white cabinets, a single sink, and a window over the sink", "Castaway Cove — a single run of cabinets, one sink, no island."),
          },
          {
            note: "<strong>Lakefront's great room is a vaulted, two-chandelier space</strong> with a round architectural window and a table seating 8+. <strong>Castaway's living room is a normal, low-ceilinged den</strong> with a sectional and a TV. Both comfortable — very different scale.",
            lakefront: photo("lake/compcompare/lakefront/living-room.jpg", "Vaulted great room with two ring chandeliers, a round oval window, an open kitchen beyond, and a long farmhouse dining table seating eight", "Lakefront Estate — vaulted great room, two chandeliers, table for 8+."),
            castaway: photo("lake/compcompare/castaway/living-room.jpeg", "Low-ceilinged living room with wood paneling, a beige sectional sofa, and a wall-mounted TV", "Castaway Cove — a normal den: sectional, TV, low pine-paneled ceiling."),
          },
          {
            note: "<strong>Lakefront's outdoor living is a grand covered porch</strong> — brick columns, poured concrete, rocking chairs, framed lake views. <strong>Castaway's is a plain wood deck</strong> with a patio table. Both genuinely nice — one reads as \"designed,\" the other as \"a deck.\"",
            lakefront: photo("lake/compcompare/lakefront/covered-porch.jpeg", "Covered porch with brick columns, poured concrete floor, and rocking chairs overlooking a lake and dock", "Lakefront Estate — a columned covered porch, framed lake views."),
            castaway: photo("lake/compcompare/castaway/deck.jpg", "Plain wood deck with a patio dining table and chairs, shaded by trees, lake visible beyond the railing", "Castaway Cove — a wood deck with a dining table, trees framing the lake."),
          },
          {
            note: "Both hot tubs sit with the water in view, but placed differently. <strong>Lakefront's is built into the same long covered porch</strong> as the rocking chairs — one stop along a whole outdoor sequence, not a standalone feature. <strong>Castaway's stands alone in the yard</strong>, angled straight down toward its own dock and pontoon boat.",
            lakefront: photo("lake/compcompare/lakefront/hottub-closeup.avif", "Hot tub on a covered brick-column porch, lake visible through the trees beyond", "Lakefront Estate — the hot tub as one stop along the covered porch."),
            castaway: photo("lake/compcompare/castaway/hottub-closeup.avif", "Hot tub beside the house with a dock and pontoon boat visible on the lake just beyond it, bare winter trees", "Castaway Cove — a freestanding hot tub facing straight down to the dock."),
          },
          {
            note: "Lakefront also runs this photo — the hot tub reduced to a small dark shape at the far end of the porch, past the rocking chairs. <strong>That's not bad photography — it's the point.</strong> They aren't selling the hot tub, they're selling the lake, the most expensive amenity in the frame. <strong>Castaway does the opposite</strong>: a tight, dedicated shot with no lake in view at all — here, the hot tub itself is the entire pitch.",
            quote: "&ldquo;The rocking chairs are a great way to enjoy your morning coffee with a view of the lake, don't forget to have a nice soak in the hot tub!&rdquo;<cite>— Lakefront Estate's own Airbnb caption for this exact photo.</cite>",
            lakefront: photo("lake/compcompare/lakefront/hottub-wide-porch.jpeg", "Long covered porch with rocking chairs and porch swings; a hot tub is barely visible as a small dark shape at the far end", "Lakefront Estate — the hot tub as an afterthought at the far end of the porch."),
            castaway: photo("lake/compcompare/castaway/hottub-closeup2.jpeg", "Close-up of a hot tub beside the house, no lake visible in frame, bare winter trees", "Castaway Cove — a second dedicated hot-tub shot; the amenity alone is the subject."),
          },
          {
            note: "Both listings flag Waterfront + Dock identically — the data can't see the scale gap. <strong>Lakefront's dock is a two-tier structure with its own stairs</strong>, visible past the beach and kayaks. <strong>Castaway's is a simple T-shaped floating dock</strong> for the pontoon boat, aerial view showing how modest the surrounding lot is by comparison.",
            lakefront: photo("lake/compcompare/lakefront/beach-dock-daylight.avif", "Sandy beach with kayaks and Adirondack chairs around a fire pit; a two-tier dock with stairs is visible in the distance", "Lakefront Estate — beach and kayaks in the foreground, the two-tier dock visible beyond."),
            castaway: photo("lake/compcompare/castaway/aerial-dock.avif", "Aerial view of a modest house and yard beside the lake, with a simple T-shaped floating dock and a pontoon boat", "Castaway Cove — aerial view of the property and its simple T-dock."),
          },
          {
            note: "<strong>Lakefront's bunk room is purpose-built</strong> — three built-in bunks, six real beds, its own design identity. <strong>Castaway's is one add-on bunk unit</strong> in an otherwise ordinary bedroom. \"Sleeps 16\" and \"sleeps 14\" undersell how differently that capacity is actually delivered.",
            lakefront: photo("lake/compcompare/lakefront/bunk-room-builtin.jpeg", "Custom built-in bunk room with three sets of bunk beds along the walls, six beds total, a round rug in the center", "Lakefront Estate — a purpose-built 6-bed bunk room."),
            castaway: photo("lake/compcompare/castaway/bunk-room-single.jpeg", "Bedroom with a single metal bunk bed frame against the wall, otherwise a plain guest room", "Castaway Cove — a single bunk unit added to an ordinary bedroom."),
          },
        ],
      },

      // Projections -- from the same filled-in template ("Projections ->
      // Revenue Potential" / "Purchase Price"). The three linked listings
      // are existing comp-set properties (High/Mid/Low tier, one each) used
      // as representative examples across the revenue range, not new
      // acquisition candidates the way Outskirts' Zillow addresses are.
      { groupTitle: "Projections" },
      {
        title: "Revenue Potential & Representative Listings",
        body:
          "<p><strong>Revenue Potential:</strong> Lower $93k · Median $124k · Upper $160k. <strong>Purchase Price:</strong> ~$750k.</p>" +
          "<p><strong>Representative comp-set listings across the range</strong> (one per tier, not new acquisition candidates):</p><ul>" +
          "<li><a href=\"https://www.airbnb.com/rooms/47855845\" target=\"_blank\" rel=\"noopener\">Lakefront Estate with Beach + Dock + Hot Tub ↗</a> — High tier, $182,749</li>" +
          "<li><a href=\"https://www.airbnb.com/rooms/1142965470924412498\" target=\"_blank\" rel=\"noopener\">Modern 4BR Lakefront Home w/Pool, Patio & Pets OK ↗</a> — Mid tier, $138,235</li>" +
          "<li><a href=\"https://www.airbnb.com/rooms/52281872\" target=\"_blank\" rel=\"noopener\">Castaway Cove— 5Bed Lake Retreat—Fire Pit—Hot Tub! ↗</a> — Low tier, $99,613</li>" +
          "</ul>",
      },

      // Buy-Box Summary -- one-page recap of everything above, in the team's
      // own buy-box template's category order (see BuyBoxLakesideCharlotte.docx).
      // STR Regulations excluded here on request -- it's market-wide, not
      // Lake-specific, and already covered once in Section 5.
      { groupTitle: "Buy-Box Summary" },
      {
        title: "One-Page Recap",
        body:
          "<table class=\"summary-sheet-table\">" +
          "<tr><td>Bedrooms / Baths</td><td>3+ bedrooms (4-5 ideal) · 2+ bathrooms (3+ ideal)</td></tr>" +
          "<tr><td>Ideal Sleep Count</td><td>8+ required (16 preferred)</td></tr>" +
          "<tr><td>Architectural Style</td><td>Normal houses work — not mandatory given lake access + waterfront</td></tr>" +
          "<tr><td>Backyard Size</td><td>Outdoor lounges, sofas, fire pits, lakeside hot tubs, sitting areas; balconies double as lounges</td></tr>" +
          "<tr><td>Must-Have's</td><td>Fire Pit, Outdoor Dining Area, Waterfront, Lake Access, Pack 'N Play / Travel Crib, Hot Tub, Crib</td></tr>" +
          "<tr><td>Nice-to-Have's</td><td>Pool Table, Game Room, Pool, Gym (ranked by revenue lift) — Pickleball excluded (N=1, negative signal)</td></tr>" +
          "<tr><td>View</td><td>Lake view, preferably from a front deck</td></tr>" +
          "<tr><td>Waterfront</td><td>Absolutely mandatory</td></tr>" +
          "<tr><td>Privacy / Seclusion</td><td>Not necessary</td></tr>" +
          "<tr><td>Ideal Location(s)</td><td>28278 (Steele Creek / Lake Wylie) — priority ZIP, 7 of 8 Top 10% listings</td></tr>" +
          "<tr><td>Traveler ICP</td><td>Large groups and families with kids</td></tr>" +
          "<tr><td>Property Comp Sets</td><td>Lakefront Estate ($182,749) vs. Castaway Cove ($99,613): bathrooms (3.5 vs. 2), kitchen/living-room scale, and hot-tub/dock execution explain most of the 83% gap</td></tr>" +
          "</table>" +
          "<p style=\"margin:16px 0 4px;\"><strong>Analyst Notes — Acquisition Target Profile:</strong> turning Lakefront Estate's formula into a repeatable \"Lake Wylie Large-Group Waterfront\" buy box. Buy the bones, not an already-finished 5BR — manufacture the bunk room, entertainment space, and outdoor product ourselves.</p>" +
          "<table class=\"summary-sheet-table\">" +
          "<tr><td>Geography</td><td>Charlotte side of Lake Wylie, preferably the same 28278 / western Charlotte orbit as Lakefront Estate</td></tr>" +
          "<tr><td>Bedrooms</td><td>4-5BR at acquisition, with a realistic path to 5BR</td></tr>" +
          "<tr><td>Bathrooms</td><td>3.5+ finished target</td></tr>" +
          "<tr><td>STR capacity</td><td>14-16 guests</td></tr>" +
          "<tr><td>Size</td><td>Roughly 3,500-5,000+ sqft preferred</td></tr>" +
          "<tr><td>Waterfront</td><td>True Lake Wylie frontage, not just lake access</td></tr>" +
          "<tr><td>Dock</td><td>Existing dock strongly preferred; otherwise confirmed dockability before acquisition</td></tr>" +
          "<tr><td>Shoreline</td><td>Usable shoreline; private/sandy beach potential is a major plus</td></tr>" +
          "<tr><td>Lot</td><td>Enough land for several independent outdoor zones</td></tr>" +
          "<tr><td>Interior</td><td>Large kitchen/island + large great room + second social space</td></tr>" +
          "<tr><td>Basement</td><td>Walkout lower level is extremely attractive</td></tr>" +
          "<tr><td>Sleeping layout</td><td>Adult bedrooms + purpose-built 4-6 person bunk room</td></tr>" +
          "<tr><td>Outdoor product</td><td>Deck + covered area + hot tub + firepit + waterfront seating + kayaks/paddleboards</td></tr>" +
          "<tr><td>Entertainment</td><td>Proper game/lounge space: billiards, shuffleboard, arcade, bar, big TV etc.</td></tr>" +
          "<tr><td>Pool</td><td>Nice to have, not required</td></tr>" +
          "<tr><td>Design</td><td>Good architectural bones; design can be improved after acquisition</td></tr>" +
          "</table>" +
          "<table class=\"summary-sheet-table\">" +
          "<tr><td>Revenue Potential</td><td>Lower $93k · Median $124k · Upper $160k</td></tr>" +
          "<tr><td>Purchase Price</td><td>~$750k</td></tr>" +
          "</table>",
      },
    ],

    pendingNote:
      "Source notebook for the full underlying analysis: <code>../notebooks/charlotte_lake_buybox.ipynb</code>. Analyst notes and projections above are from the team's own filled-in template, <code>../LakeBuyBox/BuyBoxLakesideCharlotte.docx</code>.",
  },
];

const PENDING_BUY_BOXES = [
  { label: "Downtown / Uptown Buy Box", note: "N=368, largest region by inventory (51% of the market), 8% Top 10% hit rate. See the pending Downtown / Uptown Buy Box tab above for what's scoped so far." },
  { label: "Outskirts Buy Box", note: "N=312, broadest region geographically, 11% Top 10% hit rate. See the pending Outskirts Buy Box tab above for what's scoped so far." },
  { label: "Lake Buy Box", note: "N=39, geography-defined (Lakeside region, not amenity-flag-only), 21% Top 10% hit rate — more than double Downtown's. See the pending Lake Buy Box tab above." },
];
const PENDING_BUY_BOXES_NOTE =
  "All three buy boxes — Downtown / Uptown, Outskirts, and Lake — are named and scoped in charlotte_overview.ipynb's region-based buy-box segmentation, with real N and Top 10% hit-rate figures, but their full deep-dive analysis has not been built out yet. Map and structure come first, per the team's current call.";
