/**
 * Chart.js chart rendering. Currently one chart: the market-wide Revenue
 * Potential distribution (Section 2), computed directly from the raw CSV
 * (see REVENUE_DISTRIBUTION in data.js) with the top-25% and top-10%
 * thresholds highlighted.
 */
const CHART_PALETTE = {
  bottom75: "#8b94a3",
  top25: "#1e3d32",
  top10: "#b9752b",
};

// Demographics palette (Section 4) — kept within the site's own brand
// palette rather than the raw teal/yellow/orange/slate colors in Walid's
// example chart images.
const DEMOGRAPHICS_PALETTE = {
  kids: "#b9752b",
  group: "#e0b34c",
  pet: "#1e3d32",
  other: "#8b94a3",
};

Chart.defaults.font.family = "'Inter', 'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = "#445752";

function chartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: title, font: { size: 14, weight: "600" } },
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const bin = REVENUE_DISTRIBUTION.histogram[ctx.dataIndex];
            return ctx.parsed.y + " listings ($" + Math.round(bin.binStart / 1000) + "k-$" + Math.round(bin.binEnd / 1000) + "k)";
          },
        },
      },
    },
    scales: {
      x: { ticks: { maxRotation: 60, minRotation: 45 } },
      y: { title: { display: true, text: "Listings" } },
    },
  };
}

function renderRevenueDistributionChart() {
  const ctx = document.getElementById("chart-revenue-distribution");
  if (!ctx) return;
  const dist = REVENUE_DISTRIBUTION;
  const labels = dist.histogram.map((b) => "$" + Math.round(b.binStart / 1000) + "k");
  const colors = dist.histogram.map((b) => {
    const mid = (b.binStart + b.binEnd) / 2;
    if (mid >= dist.p90) return CHART_PALETTE.top10;
    if (mid >= dist.p75) return CHART_PALETTE.top25;
    return CHART_PALETTE.bottom75;
  });
  const counts = dist.histogram.map((b) => b.count);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Listings by Revenue Potential",
          data: counts,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: chartOptions("Market-wide Revenue Potential distribution (n=" + dist.totalCount + ")"),
  });

  const legend = document.getElementById("chart-revenue-distribution-legend");
  if (legend) {
    legend.innerHTML =
      '<span class="legend-row"><span class="legend-swatch" style="background:' + CHART_PALETTE.bottom75 + '"></span>Bottom 75% (below $' + Math.round(dist.p75).toLocaleString() + ")</span>" +
      '<span class="legend-row"><span class="legend-swatch" style="background:' + CHART_PALETTE.top25 + '"></span>Next 15% / top 25% ($' + Math.round(dist.p75).toLocaleString() + "-$" + Math.round(dist.p90).toLocaleString() + ")</span>" +
      '<span class="legend-row"><span class="legend-swatch" style="background:' + CHART_PALETTE.top10 + '"></span>Top 10% (P90 = $' + Math.round(dist.p90).toLocaleString() + "+)</span>";
  }
  const interp = document.getElementById("chart-revenue-distribution-interpretation");
  if (interp) {
    interp.textContent =
      "The market's revenue distribution is heavily right-skewed: most listings cluster well below $90K, and the top 10% (P90 = " +
      fmtCurrency(dist.p90) +
      ") pulls away sharply from the median (" +
      fmtCurrency(dist.medianRevenue) +
      "). All three of this market's buy boxes are built around that top band, not the median — see the map below for how it splits by region.";
  }
}

// ---------------------------------------------------------------------------
// Section 4 — Traveller Demographics. Review-derived guest-composition
// signals from DEMOGRAPHICS in data.js (kids/group/pet/other shares).
// ---------------------------------------------------------------------------
function renderDemographicsPieChart() {
  const ctx = document.getElementById("chart-demographics-pie");
  if (!ctx) return;
  const m = DEMOGRAPHICS.marketWide;
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Stayed with kids", "Group trip", "Stayed with a pet", "Other"],
      datasets: [
        {
          data: [m.kids, m.group, m.pet, m.other],
          backgroundColor: [DEMOGRAPHICS_PALETTE.kids, DEMOGRAPHICS_PALETTE.group, DEMOGRAPHICS_PALETTE.pet, DEMOGRAPHICS_PALETTE.other],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Average review composition — all listings (n=" + m.n + ")", font: { size: 14, weight: "600" } },
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (c) => c.label + ": " + c.parsed + "%" } },
      },
    },
  });
  const legend = document.getElementById("chart-demographics-pie-legend");
  if (legend) {
    legend.innerHTML =
      '<span class="legend-row"><span class="legend-swatch" style="background:' + DEMOGRAPHICS_PALETTE.kids + '"></span>Stayed with kids (' + m.kids + '%)</span>' +
      '<span class="legend-row"><span class="legend-swatch" style="background:' + DEMOGRAPHICS_PALETTE.group + '"></span>Group trip (' + m.group + '%)</span>' +
      '<span class="legend-row"><span class="legend-swatch" style="background:' + DEMOGRAPHICS_PALETTE.pet + '"></span>Stayed with a pet (' + m.pet + '%)</span>' +
      '<span class="legend-row"><span class="legend-swatch" style="background:' + DEMOGRAPHICS_PALETTE.other + '"></span>Other (' + m.other + '%)</span>';
  }
}

function renderDemographicsStackedBarChart() {
  const ctx = document.getElementById("chart-demographics-bedroom");
  if (!ctx) return;
  const rows = DEMOGRAPHICS.byBedroom;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((r) => r.label + " (n=" + r.n + ")"),
      datasets: [
        { label: "Stayed with kids", data: rows.map((r) => r.kids), backgroundColor: DEMOGRAPHICS_PALETTE.kids },
        { label: "Group trip", data: rows.map((r) => r.group), backgroundColor: DEMOGRAPHICS_PALETTE.group },
        { label: "Stayed with a pet", data: rows.map((r) => r.pet), backgroundColor: DEMOGRAPHICS_PALETTE.pet },
        { label: "Other", data: rows.map((r) => r.other), backgroundColor: DEMOGRAPHICS_PALETTE.other },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Guest demographic composition by bedroom count", font: { size: 14, weight: "600" } },
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ": " + c.parsed.y + "%" } },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, title: { display: true, text: "% of reviews" }, max: 100 },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Lake buy box -- Traveler ICP mini charts. Two small bars replacing prose
// per explicit "traveller icp also, use the two charts... too many words"
// feedback: same review-derived signal as the Section 4 charts above, scoped
// to LAKE_ICP_DEMOGRAPHICS's three populations (data.js). Colors reuse the
// site's existing revenue-tier palette (gray/green/amber) rather than a new
// one, applied here to "how much more this signal shows up as you narrow
// from the whole market down to Lakeside's own Top 10%."
// ---------------------------------------------------------------------------
function renderLakeIcpMiniChart(canvasId, title, values) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const data = [values.marketWide, values.lakesideWide, values.lakesideTop10];
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Market-wide", "Lakeside-wide", "Lakeside Top 10%"],
      datasets: [
        {
          data: data,
          backgroundColor: [CHART_PALETTE.bottom75, CHART_PALETTE.top25, CHART_PALETTE.top10],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: title, font: { size: 13, weight: "600" } },
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => c.parsed.y + "% of reviews" } },
      },
      scales: {
        y: { beginAtZero: true, max: Math.max.apply(null, data) + 15, title: { display: true, text: "% of reviews" } },
      },
    },
  });
}

function renderLakeIcpCharts() {
  renderLakeIcpMiniChart("chart-lake-icp-group", "Group-trip share of reviews", LAKE_ICP_DEMOGRAPHICS.groupTrip);
  renderLakeIcpMiniChart("chart-lake-icp-kids", "Stayed-with-kids share of reviews", LAKE_ICP_DEMOGRAPHICS.kids);
}
