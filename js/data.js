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
 * sheet (719 listings, single snapshot dated 2026-08-14), and the analysis
 * already built in ../notebooks/charlotte_overview.ipynb and
 * ../notebooks/charlotte_5br_plus_buybox.ipynb. Every number below traces to
 * one of those two notebooks or to scripts/generate_webpage_map_data.py.
 *
 * STATUS (see README.md for detail): the 5BR+ buy box is fully developed
 * below. 3BR, 4BR, and the bonus Lake buy box are named and scoped (real N,
 * real hit-rates, real revenue ceilings) but not yet built out — they render
 * as "pending" tabs with a pointer back to their own stub notebook, the same
 * pending-state the template already supports natively (no placeholder data
 * is invented for them). Curated property photography, design comps, and
 * acquisition-candidate screening — the "image-based visual analysis" — is
 * deferred for all four buy boxes; every image slot below is either a real
 * generated analysis chart (photo()) or an honest photo-pending card
 * (pendingPhoto()) linking straight to the real Airbnb listing.
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
  // should point to (unlike the 5BR+ buy box's own hero image below).
  heroImage: null,
  paragraphs: [
    "Charlotte is North Carolina's largest city and the anchor of a metro area of roughly 2.8 million people, sitting inside the \"Charlanta\" megaregion that stretches from Atlanta to Raleigh. It's the country's second-largest banking center after New York — Bank of America is headquartered here, and Charlotte's skyline, corporate travel demand, and weekday business-trip base are all downstream of that fact.",
    "Charlotte Douglas International Airport (CLT) is a major American Airlines hub, one of the busiest airports in the country by traffic — this is a fly-in market as much as a drive-in one, and short-term rental demand reflects both a corporate/business-travel base and event-driven leisure groups.",
    "Uptown, NoDa, and South End form the walkable urban core (breweries, nightlife, event venues), Bank of America Stadium (NFL) and Spectrum Center (NBA) anchor sports-driven group demand, and the outer suburbs — Ballantyne, Matthews, SouthPark, Steele Creek, Lake Wylie — carry a different, more suburban-family and lake-leisure demand profile. This mix of urban-core, sports, corporate, and suburban/lake demand is what the location analysis below is built to separate out.",
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
  bedroom4: { count: 64, median: 85346, p75: 114224.0, p90: 147874.6 }, // 5BR+ subset (all, incl. lake) -- field name kept as "bedroom4" to match the reference site's chart code, but holds the 5BR+ figures here (see charts.js interpretation text)
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
    "The market's top 10% (P90 = $78,801, N=72) splits into four geographic clusters, each with its own character:",
  // One line per Top 10% cluster (N, median revenue, and the distinguishing
  // trait from charlotte_overview.ipynb's cluster story text), rendered as a
  // bullet list under the map by renderLocationInterpretation() in render.js.
  clusterBullets: [
    "🏙️ <strong>Uptown / NoDa / South End</strong> — the volume leader: N=36 (half of all Top 10% listings), median $100,956, 92% Superhosts.",
    "🌊 <strong>Steele Creek / Lake Wylie</strong> — smallest by count, highest earner: N=9, median $126,895 — driven by the lake/waterfront amenity, not just geography.",
    "🏡 <strong>Ballantyne / Matthews / SouthPark</strong> — the steadiest performer: highest occupancy (63%) but the lowest ADR ($404) of the four.",
    "🎉 <strong>East Charlotte / Mint Hill</strong> — the event-house cluster: lowest occupancy (55%), tied-highest sleeps (12) — party-venue listings, not steady weekday demand.",
  ],
  // No embedded per-buy-box Leaflet comp map is used on this page yet (the
  // 5BR+ deep dive below embeds its own standalone folium map instead, via
  // locationGuidance.interactiveMapUrl) -- kept as an empty object, not
  // omitted, because map.js reads Object.keys(...) on this at load time.
  fourBrCompCategories: {},
};

// Not used yet (no 1-2BR-equivalent segment map on this page) -- declared as
// an empty stub so map.js's shared code has something defined to reference.
const ONE_TWO_BR_MAP_CONFIG = { tierColors: {}, tierLabelPrefix: {}, compStyle: {} };

// BUY_BOXES — ordered ascending by bedroom count (3BR, 4BR, 5BR+), Lake last
// as the cross-cutting bonus box, matching charlotte_master.ipynb's index.
const BUY_BOXES = [
  // ---------------------------------------------------------------------------
  // 3BR — named and scoped in charlotte_overview.ipynb's buy-box segmentation
  // (largest inventory pool), but not yet built out as its own deep dive.
  // ---------------------------------------------------------------------------
  {
    id: "3br",
    label: "3BR Buy Box",
    status: "pending",
    name: "Charlotte 3BR",
    thesis: "Entry-point buy box — largest inventory pool in the market, lowest Top 10% hit rate of the three core boxes.",
    atAGlance: {
      bedBath: "3 bedrooms",
      sleeps: "TBD",
      heroMechanism: "TBD",
      revenue: "N=251 listings",
      primaryRequirement: "TBD",
    },
    pendingNote:
      "3BR is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=251, the market's largest 3BR inventory pool, but with the lowest Top 10% hit rate (3%) of the three core buy boxes. Full deep-dive analysis (capacity, location clusters, amenity evidence, buy-box template) has not been built yet. See ../notebooks/charlotte_3br_buybox.ipynb for the current stub.",
  },

  // ---------------------------------------------------------------------------
  // 4BR — named and scoped, not yet built out.
  // ---------------------------------------------------------------------------
  {
    id: "4br",
    label: "4BR Buy Box",
    status: "pending",
    name: "Charlotte 4BR",
    thesis: "Middle buy box — Top 10% hit rate jumps sharply from 3BR.",
    atAGlance: {
      bedBath: "4 bedrooms",
      sleeps: "TBD",
      heroMechanism: "TBD",
      revenue: "N=121 listings",
      primaryRequirement: "TBD",
    },
    pendingNote:
      "4BR is scoped in ../notebooks/charlotte_overview.ipynb (\"Why These Buy Boxes\") — N=121, Top 10% hit rate 22% (up sharply from 3BR's 3%). Full deep-dive analysis has not been built yet. See ../notebooks/charlotte_4br_buybox.ipynb for the current stub.",
  },

  // ---------------------------------------------------------------------------
  // The 5BR+ buy box — fully developed. Source of truth:
  // ../notebooks/charlotte_5br_plus_buybox.ipynb (the deep dive built for
  // this buy box, modeled on the Shenandoah Valley 3BR deep dive's
  // structure), cross-checked against ../notebooks/charlotte_overview.ipynb
  // for the market-wide framing. Every comp below (name, revenue, ADR,
  // occupancy, ZIP, URL) was pulled directly from Charlotte NC - Market Eval
  // - FINAL.xlsx by Property ID.
  // ---------------------------------------------------------------------------
  {
    id: "5br-plus",
    label: "5BR+ Buy Box",
    status: "developed",
    name: "Charlotte 5BR+ Group House",
    thesis:
      "Acquire a non-lake 5BR+ group house — sleeps 14+, 4+ bathrooms where possible — inside or near Uptown / NoDa / South End, built around a real outdoor-dining/backyard setup, and let group-trip demand (not families) do the work of driving occupancy.",
    atAGlance: {
      bedBath: "5+ bedrooms / 4+ bathrooms preferred",
      sleeps: "14+ preferred (no ceiling observed)",
      heroMechanism: "Group-house capacity in Uptown/NoDa/South End, with a real Outdoor Dining Area setup",
      revenue: "N=58 non-lake 5BR+ listings · Top 10% (market-wide $78,801+) reached by 57% of this population",
      primaryRequirement: "Sleeps 14+ and 4+ bathrooms both show a real, still-climbing Top 10% hit rate at the top of their range — not just thresholds to clear",
    },

    buyBoxSections: [
      "overview", "performanceContext", "acquisitionSpec", "bedsAndBaths",
      "locationGuidance", "geoConsiderations", "travelerICP",
      "mustHaveAmenities", "revenueTiers", "analystNotes", "acquisition",
    ],

    overview: {
      statusBadge: "Evidence-backed recommendation — acquisition underwriting pending",
      thesis:
        "Acquire a non-lake 5BR+ group house — sleeps 14+, 4+ bathrooms where possible — inside or near Uptown / NoDa / South End, built around a real outdoor-dining/backyard setup, and let group-trip demand do the work of driving occupancy.",
      whyItWorks:
        "This size band already clears the market's Top 10% bar at a 57% rate — the evidence, in brief:" +
        "<ul>" +
        "<li><strong>Group-trip market</strong> — 64% group-trip share vs. 23% market-wide; this is a party-house product, not a family-vacation one.</li>" +
        "<li><strong>57% clear the market's Top 10%</strong> (N=33 of 58 non-lake) — far above 3BR (3%) or 4BR (22%).</li>" +
        "<li><strong>Sleeps and bathrooms keep paying off</strong> across the whole range, not just as thresholds to clear.</li>" +
        "<li><strong>Outdoor Dining Area</strong> is the one amenity that climbs cleanly toward the Top 10% (57% → 76%).</li>" +
        "</ul>",
      heroImage: pendingPhoto("https://www.airbnb.com/rooms/825605026061987286", "Charlotte 5BR+ hero photo — not yet curated; linked to the market's highest-revenue 5BR+ listing"),
      chips: [
        { label: "5+ bedrooms" },
        { label: "Sleeps 14+ preferred" },
        { label: "4+ bathrooms preferred" },
        { label: "Non-lake (waterfront tracked separately)" },
        { label: "Uptown / NoDa / South End preferred, but not exclusive" },
        { label: "Outdoor Dining Area required" },
      ],
      revenueChips: [
        { label: "Non-lake 5BR+ population", value: "N=58" },
        { label: "Market Top 10% threshold", value: "$78,801" },
        { label: "Market Top 25% threshold", value: "$52,526" },
        { label: "Max revenue observed", value: "$199,741" },
      ],
    },

    performanceContext: {
      stats: [
        { label: "Non-lake 5BR+ listings", value: "58" },
        { label: "Clear market Top 10% ($78,801+)", value: "33 (57%)" },
        { label: "Clear market Top 25% ($52,526+)", value: "50 (86%)" },
        { label: "Top 10% Revenue index", value: "128", compare: "vs. All-5BR+ median = 100" },
        { label: "Top 10% ADR index", value: "120" },
        { label: "Top 10% Occupancy index", value: "109" },
      ],
      note: "Thresholds here are the OVERALL Charlotte market's Top 10%/Top 25% ($78,801 / $52,526), not a threshold recomputed within the 5BR+ population itself — 5BR+ is a buy box precisely because most of it already clears the market-wide bar. The Top 10% outperforms on both price and fill rate, with ADR moving further than occupancy, the same pattern seen across the other Charlotte buy boxes. 6 lake/waterfront-flagged 5BR+ listings are excluded from every number on this page and tracked separately in the bonus Lake buy box.",
    },

    // Property Profile — bedrooms/baths/sleeps requirements.
    acquisitionSpec: {
      required: [
        "5+ bedrooms",
        "Non-lake — HAS_waterfront / HAS_lake_access-flagged properties are excluded from this buy box by design and tracked in the bonus Lake buy box instead",
        "Sleeps 14+ preferred — the Top 10% hit rate keeps climbing across the whole observed range (46% at Sleeps 10-11 -> 55% at 12-13 -> 70% at 14-16), unlike 3BR where sleeps mainly separated the bottom of the range",
        "4+ bathrooms preferred — median revenue steps from $68,742 at ≤3 baths to $130,991 at 4.5+ baths (a ~91% lift), and the Top 10% hit rate steps the same way (45% -> 60% -> 100%)",
      ],
      preferred: [
        "Location inside or near Uptown / NoDa / South End — the largest inventory cluster (N=33 of 58) among the three non-lake clusters, though East Charlotte / Mint Hill posts the single highest Top 10% hit rate (67%, N=12)",
        "A real Outdoor Dining Area setup — the one amenity shown to climb from the broader non-lake 5BR+ population toward its Top 10% (57% -> 76%)",
      ],
      images: [],
    },

    // Beds & Baths — the real capacity chart generated for this deep dive.
    bedsAndBaths: {
      roomImages: [],
      chartImages: [
        photo("5br/charts/03_capacity.png", "Median revenue and Top 25%/10% hit rate by sleeps bucket and bathroom bucket, Charlotte non-lake 5BR+", "Sleeps and bathroom capacity thresholds — Charlotte non-lake 5BR+ (N=58). Both keep paying off across the whole observed range, unlike the 3BR product elsewhere in this market."),
      ],
    },

    locationGuidance: {
      recommended:
        "Three non-lake clusters, ranked by Top 10% hit rate:" +
        "<ul>" +
        "<li>🥇 <strong>East Charlotte / Mint Hill</strong> — N=12, <strong>67%</strong> Top 10% hit rate. Charlotte's \"event-house\" cluster — lowest occupancy, tied-highest sleeps, party-venue listing titles (weddings, reunions).</li>" +
        "<li>🥈 <strong>Ballantyne / Matthews / SouthPark</strong> — N=13, <strong>62%</strong> Top 10% hit rate. Sits in between on both counts.</li>" +
        "<li>🥉 <strong>Uptown / NoDa / South End</strong> — N=33, <strong>52%</strong> Top 10% hit rate. The volume base (57% of this buy box's inventory), not the top performer.</li>" +
        "</ul>",
      caution:
        "<ul>" +
        "<li>Every cluster clears a <strong>majority</strong> Top 10% hit rate — even the weakest, Uptown / NoDa / South End, still reaches 52%. The gap is real but graded, not a hard geographic cutoff.</li>" +
        "<li>Per-cluster N (12-33) is decent but not as statistically deep as the ZIP-level cuts planned for the 3BR/4BR buy boxes.</li>" +
        "</ul>",
      diligence: "<strong>Steele Creek / Lake Wylie geography is deliberately excluded</strong> as a location advantage here — its strength is driven by the lake/waterfront amenity flag, which this buy box screens out by design (see Geo Considerations and the bonus Lake buy box).",
      interactiveMapUrl: "assets/5br/charlotte_5br_interactive_map.html",
    },

    geoConsiderations: {
      intro: "Lake/waterfront exposure is the one geographic factor this buy box explicitly screens out, not toward — every HAS_waterfront/HAS_lake_access-flagged 5BR+ listing is removed before any number above is computed.",
      factors: [
        {
          label: "Waterfront / Lake Access (Steele Creek / Lake Wylie)",
          stat: "6 of 64 market-wide 5BR+ listings excluded from this buy box by design",
          note: "These listings behave differently — large lake/group homes earning revenue on size and setting rather than the location/capacity/amenity levers this buy box is built around. Tracked separately in the bonus Lake buy box, not blended in here.",
          images: [],
        },
        {
          label: "Uptown / NoDa / South End",
          stat: "N=33 of 58 (57% of this buy box's inventory) · 52% Top 10% hit rate",
          note: "The volume base for this buy box, even though it posts the lowest Top 10% hit rate of the three non-lake clusters.",
          images: [],
        },
        {
          label: "East Charlotte / Mint Hill",
          stat: "N=12 · 67% Top 10% hit rate — the strongest of the three",
          note: "Characterized in the market overview as the \"event-house\" cluster — lowest occupancy, tied-highest sleeps, listing titles reading as party-venue rentals (weddings, reunions) rather than vacations. A pattern that fits naturally with a large-group 5BR+ product.",
          images: [],
        },
        {
          label: "Ballantyne / Matthews / SouthPark",
          stat: "N=13 · 62% Top 10% hit rate",
          note: "Sits between the other two clusters on both inventory depth and hit rate.",
          images: [],
        },
      ],
    },

    travelerICP: {
      primary: "🎉 <strong>Large groups</strong> — weddings, reunions, milestone-birthday parties, and multi-family trips. Not a family-vacation-first product.",
      secondary:
        "<ul>" +
        "<li>Kids-share is present (20%) but is <strong>not</strong> the defining traveler type at this size band.</li>" +
        "<li>Group-trip share is a trait of the <strong>whole</strong> 5BR+ segment, not something that concentrates further at the very top (64% baseline → 62% at Top 10%, essentially flat).</li>" +
        "</ul>",
      stats: [
        { label: "Group-trip share (non-lake 5BR+)", value: "64%", compare: "vs. 23% Charlotte market-wide" },
        { label: "Group-trip share (Top 10% of this buy box)", value: "62%", compare: "essentially flat vs. the 64% baseline" },
        { label: "Stayed-with-kids share", value: "20%", compare: "21% at Top 10% — present, not dominant" },
        { label: "Non-lake 5BR+ population", value: "N=58" },
      ],
      note: "Bottom line: this is already a group-trip product at every tier, not just at the top.",
    },

    // Amenity Stack — Fire Pit / Pack 'N Play / Outdoor Dining Area findings,
    // plus the real amenity-evidence charts generated for this deep dive.
    mustHaveAmenities: {
      leadImages: [
        photo("5br/charts/04_amenity_prevalence.png", "Amenity prevalence across All 5BR+, Top 25%, and Top 10%, Charlotte non-lake 5BR+", "Amenity prevalence by tier. Outdoor Dining Area is both the most common amenity among Top 10% listings and the one that climbs the most to get there (57% market-wide -> 76% of Top 10%)."),
        photo("5br/charts/05_amenity_ranking.png", "Amenity evidence table: matched revenue uplift, Top 10% hit-rate uplift, and recurrence, sorted by combined evidence, Charlotte non-lake 5BR+", "Amenity evidence, sorted by combined evidence. Fire Pit leads on the composite score (matched revenue uplift, Top-10% uplift, and recurrence together)."),
      ],
      items: [
        "Outdoor Dining Area — climbs from 57% market-wide to 76% of Top 10%; the clearest \"climbs toward the top\" amenity signal in this buy box",
        "Fire Pit — leading signal on the combined-evidence score (+38% matched revenue uplift, 55% Top 10% prevalence)",
      ],
      evidenceNote: {
        label: "Matched-comparison evidence",
        stats: "N=58 total, N=33 clear the market's Top 10% bar — healthier sample support than a self-referential decile would give, though still thinner than a fully built-out 3BR/4BR amenity table would be.",
        caveat: "\"Matched\" comparisons control for bathroom count (≤3 baths). Golf Simulator and Movie Theater are entirely absent from this non-lake 5BR+ sample (0% in every tier) — not evidence against them, just too rare here to say anything at all.",
      },
    },
    niceToHaveAmenities: {
      stronglyPreferred: [
        "Pack 'N Play / Travel Crib — the next biggest riser after Outdoor Dining Area (47% -> 61%)",
      ],
      optional: [],
      optionalNote: "Amenity ranking here is data-driven from the raw workbook (matched revenue uplift + Top-10%-hit-rate uplift + recurrence), not yet an analyst-reviewed photo comp set the way the eventual 3BR/4BR pages will have.",
    },

    // Revenue Tiers & Core Comps — real named 5BR+ listings, grouped by
    // whether they clear the market's Top 10% / Top 25% bar. Photos are
    // pending (linked straight to the real Airbnb listing) since curated
    // property photography for this buy box hasn't been done yet.
    revenueTiers: {
      mode: "namedComps",
      bands: [
        { key: "strong", label: "Top 10% (market-wide)", range: "$78,801+", note: "N=33 of 58 non-lake 5BR+ listings clear this bar." },
        { key: "target", label: "Top 25%, excl. Top 10% (market-wide)", range: "$52,526-$78,801", note: "N=17." },
        { key: "low", label: "Below Top 25% (market-wide)", range: "below $52,526", note: "N=8 — the weakest, though still real, performers in this buy box." },
      ],
      caution:
        "These are the OVERALL Charlotte market's revenue thresholds (see Performance Context above), not a threshold recomputed within the 5BR+ population itself. \"Strong / Target / Low\" here are data-driven revenue bands, not yet an analyst-reviewed execution-tier comp set the way the eventual fully-developed 3BR/4BR pages will have — every comp below is real (name, revenue, ADR, occupancy, ZIP, and Airbnb URL all pulled directly from the market workbook), but photography/design review has not been done yet, hence the photo-pending cards.",
      comps: [
        { name: "Spacious 8BR Duplex, Sleeps 20, Walk to Breweries", tier: "strong", propertyId: "abnb_825605026061987286", url: "https://www.airbnb.com/rooms/825605026061987286", revenue: 199741, adr: 863.13, occupancy: 0.6316, city: "Charlotte", zip: "28217", sleeps: 16, baths: 5.0, why: "The single highest-revenue non-lake 5BR+ listing in the market.", image: pendingPhoto("https://www.airbnb.com/rooms/825605026061987286", "Photo pending") },
        { name: "Lux Farmhouse — 6 bedrooms, 6 baths, firepit, gym", tier: "strong", propertyId: "abnb_1217644555390940891", url: "https://www.airbnb.com/rooms/1217644555390940891", revenue: 165229, adr: 1278.39, occupancy: 0.398, city: "Charlotte", zip: "28205", sleeps: 16, baths: 6.0, why: "ADR-led execution — highest ADR in this buy box's Top 10%, at a much lower occupancy than most peers.", image: pendingPhoto("https://www.airbnb.com/rooms/1217644555390940891", "Photo pending") },
        { name: "Maison NoDa: Uptown Skyline Views w/Gym Sleeps 14", tier: "strong", propertyId: "abnb_1108803702700685352", url: "https://www.airbnb.com/rooms/1108803702700685352", revenue: 158929, adr: 699.31, occupancy: 0.6936, city: "Charlotte", zip: "28205", sleeps: 14, baths: 4.0, why: "Uptown-adjacent, sleeps-14, balanced ADR/occupancy execution.", image: pendingPhoto("https://www.airbnb.com/rooms/1108803702700685352", "Photo pending") },
        { name: "HUGE Luxurious Villa for 20 ppl+Firepit | Events", tier: "strong", propertyId: "abnb_608582331729156711", url: "https://www.airbnb.com/rooms/608582331729156711", revenue: 150606, adr: 893.62, occupancy: 0.4609, city: "Charlotte", zip: "28227", sleeps: 16, baths: 5.0, why: "East Charlotte / Mint Hill — explicitly marketed for events, matching this cluster's \"event-house\" characterization.", image: pendingPhoto("https://www.airbnb.com/rooms/608582331729156711", "Photo pending") },
        { name: "Fantastic Home, 6 Bedrooms, Walk to Shops & Dining", tier: "strong", propertyId: "abnb_1004434640241073803", url: "https://www.airbnb.com/rooms/1004434640241073803", revenue: 148741, adr: 618.89, occupancy: 0.6608, city: "Charlotte", zip: "28203", sleeps: 12, baths: 4.0, why: "South End / Dilworth walkability positioning.", image: pendingPhoto("https://www.airbnb.com/rooms/1004434640241073803", "Photo pending") },
        { name: "Excellent Home Near Uptown, Walk to Shops & Dining", tier: "strong", propertyId: "abnb_705833574990204127", url: "https://www.airbnb.com/rooms/705833574990204127", revenue: 145853, adr: 597.52, occupancy: 0.6725, city: "Charlotte", zip: "28204", sleeps: 12, baths: 3.0, why: "Near-Uptown walkability at only 3 baths — a reminder that location can partly substitute for the 4+ bath preference.", image: pendingPhoto("https://www.airbnb.com/rooms/705833574990204127", "Photo pending") },
        { name: "6BR Heart of Dilworth, 1 block to SouthEnd", tier: "target", propertyId: "abnb_554940316762261190", url: "https://www.airbnb.com/rooms/554940316762261190", revenue: 125538, adr: 697.62, occupancy: 0.4985, city: "Charlotte", zip: "28203", sleeps: 10, baths: 3.5, why: "Top 25%, excl. Top 10% — Dilworth/South End walkability.", image: pendingPhoto("https://www.airbnb.com/rooms/554940316762261190", "Photo pending") },
        { name: "3000 Sq Ft, 5 Bedroom, City with Parking", tier: "target", propertyId: "abnb_33718219", url: "https://www.airbnb.com/rooms/33718219", revenue: 77838, adr: 468.36, occupancy: 0.4551, city: "Charlotte", zip: "28204", sleeps: 13, baths: 3.5, why: "Just below the market's Top 10% threshold.", image: pendingPhoto("https://www.airbnb.com/rooms/33718219", "Photo pending") },
        { name: "Fire Pit • BBQ • Outdoor Lounge • Near Hotspots", tier: "target", propertyId: "abnb_30376303", url: "https://www.airbnb.com/rooms/30376303", revenue: 77026, adr: 473.38, occupancy: 0.4388, city: "Charlotte", zip: "28277", sleeps: 12, baths: 2.5, why: "Ballantyne/SouthPark-area — explicitly markets the outdoor-lounge amenity this buy box's evidence favors.", image: pendingPhoto("https://www.airbnb.com/rooms/30376303", "Photo pending") },
        { name: "Large Groups Welcome | Spacious 5BR | Yard | Garage", tier: "low", propertyId: "abnb_1098650697482395441", url: "https://www.airbnb.com/rooms/1098650697482395441", revenue: 34477, adr: 399.06, occupancy: 0.2537, city: "Charlotte", zip: "28208", sleeps: 12, baths: 2.5, why: "Lowest-revenue listing in this buy box's population — a floor reference, not a template.", image: pendingPhoto("https://www.airbnb.com/rooms/1098650697482395441", "Photo pending") },
        { name: "Cozy city cottage", tier: "low", propertyId: "abnb_968762804004766798", url: "https://www.airbnb.com/rooms/968762804004766798", revenue: 38618, adr: 498.77, occupancy: 0.2266, city: "Charlotte", zip: "28216", sleeps: 13, baths: 3.0, why: "Low occupancy despite a mid-range ADR — a fill-rate problem, not a pricing one.", image: pendingPhoto("https://www.airbnb.com/rooms/968762804004766798", "Photo pending") },
        { name: "Luxury 5BR Sleeps — Free Parking & Fast Wi-Fi", tier: "low", propertyId: "abnb_50892468", url: "https://www.airbnb.com/rooms/50892468", revenue: 39818, adr: 463.72, occupancy: 0.2648, city: "Charlotte", zip: "28214", sleeps: 16, baths: 3.0, why: "High sleeps count alone doesn't rescue a low occupancy rate.", image: pendingPhoto("https://www.airbnb.com/rooms/50892468", "Photo pending") },
      ],
      note: "This is a starting comp set pulled straight from the market workbook, not the final curated comp set an eventual 3BR/4BR-style deep dive would have — it's shown here so the Top 10% band above isn't just an abstract dollar figure.",
    },

    analystNotes: [
      "Top 10%/Top 25% on this page are the OVERALL Charlotte market's thresholds ($78,801 / $52,526), computed on all 719 listings — not a threshold recomputed inside the 5BR+ population itself. An earlier draft of this analysis made that mistake (computing an internal decile, which put only 6 listings in \"Top 10%\" instead of the correct 33) — flagging it here because it changed several conclusions, including which location cluster looks strongest.",
      "A bug in the buy-box segmentation chart in charlotte_overview.ipynb originally computed hit-rate-by-bedroom as a joint probability over the whole market instead of a conditional probability within each bedroom count — caught and fixed; the corrected hit-rates (0% / 0% / 3% / 22% / 51% / 78% / 100% / 100% for 1BR through 8BR) are what justify excluding 1BR/2BR from every core buy box.",
      "Lake/waterfront-flagged 5BR+ listings are excluded from every number on this page by design, not by accident — they behave differently (large lake/group homes earning on size and setting) and are tracked in the bonus Lake buy box instead.",
      "Amenity and cluster findings here are directional, not proven — sample sizes (N=58 total, N=33 in the Top 10%) are healthier than an internal-decile approach would give, but still thinner than a fully built-out 3BR/4BR amenity table would have.",
    ],

    acquisition: {
      status: "Acquisition underwriting pending",
      note: "No purchase price target, CapEx estimate, or specific acquisition candidate has been established yet for this buy box. The revenue tiers above are descriptive market bands, not an underwriting model.",
    },
  },

  // ---------------------------------------------------------------------------
  // Bonus: Lake buy box — cross-cutting, amenity-defined (HAS_waterfront /
  // HAS_lake_access), not bedroom-defined. Scoped in charlotte_overview.ipynb
  // ("Should Lake Properties Be Their Own Buy Box?") but not yet built out as
  // its own deep dive.
  // ---------------------------------------------------------------------------
  {
    id: "lake",
    label: "Bonus: Lake Buy Box",
    status: "pending",
    name: "Charlotte Lake / Waterfront (Steele Creek / Lake Wylie)",
    thesis: "A cross-cutting, amenity-defined segment (HAS_waterfront / HAS_lake_access) tracked at lower confidence than the three bedroom-defined core buy boxes.",
    atAGlance: {
      bedBath: "Any bedroom count, waterfront/lake-access flagged",
      sleeps: "TBD",
      heroMechanism: "Lake/waterfront access",
      revenue: "N=27 market-wide (all bedroom counts)",
      primaryRequirement: "TBD",
    },
    pendingNote:
      "The Lake segment is scoped in ../notebooks/charlotte_overview.ipynb (\"Should Lake Properties Be Their Own Buy Box?\") — N=27 market-wide (all bedroom counts), thinner than the three core buy boxes, tracked opportunistically rather than underwritten with the same confidence yet. It is explicitly excluded from the 5BR+ buy box above (6 of 64 5BR+ listings) precisely because it behaves differently. Full deep-dive analysis has not been built yet. See ../notebooks/charlotte_lake_buybox.ipynb for the current stub.",
  },
];

const PENDING_BUY_BOXES = [
  { label: "3BR Buy Box", note: "N=251, largest inventory pool, 3% Top 10% hit rate. See the pending 3BR Buy Box tab above for what's scoped so far." },
  { label: "4BR Buy Box", note: "N=121, 22% Top 10% hit rate. See the pending 4BR Buy Box tab above for what's scoped so far." },
  { label: "Bonus: Lake Buy Box", note: "N=27 market-wide, amenity-defined (waterfront/lake access), tracked at lower confidence than the three bedroom-defined boxes. See the pending Lake Buy Box tab above." },
];
const PENDING_BUY_BOXES_NOTE =
  "5BR+ is fully developed below. 3BR, 4BR, and the bonus Lake buy box are named and scoped in charlotte_overview.ipynb's buy-box segmentation, with real N and hit-rate figures, but their full deep-dive analysis has not been built out yet.";
