"""
Generate webpage/data/listings.json (and print the histogram/demographics
tables used to hand-fill js/data.js's REVENUE_DISTRIBUTION and DEMOGRAPHICS
constants) from the raw Charlotte market workbook.

Mirrors the Shenandoah Valley reference site's
scripts/generate_webpage_map_data.py: same output schema, same percentile
method (linear interpolation on the sorted list, i.e. pandas .quantile()
default), same "market-wide tiers, all bedroom counts" convention.

Run from the repo root:  python3 scripts/generate_webpage_map_data.py
Do not hand-edit data/listings.json -- regenerate it from here instead.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
XLSX_PATH = REPO_ROOT.parent / "Charlotte NC - Market Eval - FINAL.xlsx"
OUT_PATH = REPO_ROOT / "data" / "listings.json"

df = pd.read_excel(XLSX_PATH, sheet_name="Cleaned_Data", engine="openpyxl")
df = df.rename(columns={"HAS_pack_’n_play/travel_crib": "HAS_pack_n_play_travel_crib"})

P75 = df["Revenue Potential"].quantile(0.75)
P90 = df["Revenue Potential"].quantile(0.90)


def tier_for(rev):
    if pd.isna(rev):
        return "bottom75"
    if rev >= P90:
        return "top10"
    if rev >= P75:
        return "top25"
    return "bottom75"


listings = []
for _, row in df.iterrows():
    listings.append({
        "id": str(row["Property ID"]),
        "title": str(row["Listing_Title"]),
        "url": str(row["Listing URL"]),
        "bedrooms": float(row["Bedrooms"]),
        "revenue": float(row["Revenue Potential"]) if pd.notna(row["Revenue Potential"]) else None,
        "adr": float(row["ADR"]) if pd.notna(row["ADR"]) else None,
        "occupancy": float(row["Occupancy"]) if pd.notna(row["Occupancy"]) else None,
        "city": str(row["City"]),
        "zip": str(row["ZIPCODE"]),
        "lat": float(row["Lat"]),
        "lng": float(row["Long"]),
        "tier": tier_for(row["Revenue Potential"]),
        "includeComp": bool(row["Include_Comp"] == 1),
        "excludeComp": bool(row["Exclude_Comp"] == 1),
        "hasHotTub": bool(row["HAS_hot_tub"] == 1),
        "hasPool": bool(row["HAS_pool"] == 1),
        "hasGameRoom": bool(row["HAS_game_room"] == 1),
        "hasFirePit": bool(row["HAS_fire_pit"] == 1),
        "isLake": bool(row["HAS_waterfront"] == 1 or row["HAS_lake_access"] == 1),
    })

# ZIP overlay approximation: centroid + radius (deg) computed from each ZIP's
# own listing coordinates, same method as the Shenandoah reference site.
zip_approx = []
for zip_code, g in df.groupby(df["ZIPCODE"].astype(str)):
    lat_c, lng_c = g["Lat"].mean(), g["Long"].mean()
    radius_deg = float(np.sqrt(((g["Lat"] - lat_c) ** 2 + (g["Long"] - lng_c) ** 2).mean())) or 0.01
    zip_approx.append({"zip": zip_code, "lat": float(lat_c), "lng": float(lng_c), "radiusDeg": round(radius_deg, 4), "n": int(len(g))})

payload = {
    "generatedFrom": "Charlotte NC - Market Eval - FINAL.xlsx (Cleaned_Data sheet)",
    "population": "All 719 listings in the cleaned Charlotte, NC market dataset, all bedroom counts",
    "n": int(len(df)),
    "marketWideThresholds": {"p75": round(float(P75), 2), "p90": round(float(P90), 2)},
    "tierNote": "Tiers computed market-wide (all bedroom counts) against P75/P90 of Revenue Potential.",
    "listings": listings,
    "zipApprox": zip_approx,
}
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUT_PATH.write_text(json.dumps(payload))
print(f"Wrote {OUT_PATH} -- {len(listings)} listings, {len(zip_approx)} ZIPs")

# ---------------------------------------------------------------------------
# Also print the histogram + demographics tables needed to hand-fill
# js/data.js's REVENUE_DISTRIBUTION / DEMOGRAPHICS constants (this site has
# no build step, so those stay hand-copied literals, same as the reference).
# ---------------------------------------------------------------------------
rev = df["Revenue Potential"].dropna()
bins = np.linspace(rev.min(), rev.max(), 21)
hist, edges = np.histogram(rev, bins=bins)
print("\nREVENUE_DISTRIBUTION.histogram:")
for i in range(20):
    print(f'    {{ binStart: {edges[i]:.1f}, binEnd: {edges[i+1]:.1f}, count: {hist[i]} }},')
print(f"\ntotalCount={len(rev)} medianRevenue={rev.median():.0f} p75={P75:.1f} p90={P90:.1f}")

d5 = df[df["Bedrooms"] >= 5]
print(f"\n5BR+ (all, incl. lake): count={len(d5)} median={d5['Revenue Potential'].median():.0f} "
      f"p75={d5['Revenue Potential'].quantile(.75):.1f} p90={d5['Revenue Potential'].quantile(.90):.1f}")

print("\nDEMOGRAPHICS.marketWide:")
pct_cols = ["pct_stayed_with_kids", "pct_group_trip", "pct_stayed_with_a_pet", "pct_other_reviews"]
mw = df[pct_cols].mean()
print(f"  n={len(df)}, kids={mw['pct_stayed_with_kids']:.1f}, group={mw['pct_group_trip']:.1f}, "
      f"pet={mw['pct_stayed_with_a_pet']:.1f}, other={mw['pct_other_reviews']:.1f}")

print("\nDEMOGRAPHICS.byBedroom:")
def bucket(b):
    if b <= 1: return "1BR"
    if b == 2: return "2BR"
    if b == 3: return "3BR"
    if b == 4: return "4BR"
    if b == 5: return "5BR"
    return "6BR+"
df["_bucket"] = df["Bedrooms"].apply(bucket)
order = ["1BR", "2BR", "3BR", "4BR", "5BR", "6BR+"]
for label in order:
    g = df[df["_bucket"] == label]
    m = g[pct_cols].mean()
    print(f'  {{ label: "{label}", n: {len(g)}, kids: {m["pct_stayed_with_kids"]:.1f}, group: {m["pct_group_trip"]:.1f}, pet: {m["pct_stayed_with_a_pet"]:.1f}, other: {m["pct_other_reviews"]:.1f} }},')

print("\nZIP counts (n>=1):", len(zip_approx))
print("\nLat/Lng center:", df["Lat"].mean(), df["Long"].mean())
