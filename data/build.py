"""Build Netra's static dataset from the Berkeley Voluntary Registry Offsets Database (VROD).

Usage: python data/build.py <Berkeley_VROD_registry_files_*.xlsx> <Berkeley_Voluntary_Registry_Offsets_Database_*.xlsx> <offsets-db projects.parquet>
Writes web/data/owners.json and web/data/factors.json.
"""
import json
import re
import sys
from pathlib import Path

import pandas as pd

SINCE = "2020-01-01"
SHARD = 500
OUT = Path(__file__).resolve().parent.parent / "web" / "data"

# Outcome Achievement Ratio (share of issued credits that are real reductions), Probst et al. 2024,
# doi:10.1038/s41467-024-53645-z. lo/hi = central estimate -/+ weighted variance from the paper's
# Figure 4a source data (Supplementary Data 6), clipped to [0, 1]. No number = no published estimate.
PROBST = "Probst et al. 2024, Nature Communications, doi:10.1038/s41467-024-53645-z"
FACTORS = {
    "redd": {"label": "Avoided deforestation (REDD+)", "oar": 0.247, "lo": 0.0, "hi": 0.967,
             "source": PROBST + "; West et al. 2023, Science, doi:10.1126/science.ade3535"},
    "cookstove": {"label": "Cookstoves", "oar": 0.108, "lo": 0.105, "hi": 0.111,
                  "source": PROBST + "; Gill-Wiehl et al. 2024, Nature Sustainability, doi:10.1038/s41893-023-01259-6"},
    "wind_china": {"label": "Wind power in China", "oar": 0.0, "lo": 0.0, "hi": 0.0,
                   "source": PROBST + " (no statistically significant reductions; set to 0%)"},
    "ifm_us": {"label": "Improved forest management (US)", "oar": 0.0, "lo": 0.0, "hi": 0.0,
               "source": PROBST + " (no statistically significant reductions; set to 0%)"},
    "hfc23": {"label": "HFC-23 destruction", "oar": 0.683, "lo": 0.656, "hi": 0.709, "source": PROBST},
    "sf6": {"label": "SF6 destruction", "oar": 0.164, "lo": 0.146, "hi": 0.181, "source": PROBST},
    "grid_re": {"label": "Grid-connected renewables (outside China wind)", "oar": None,
                "source": "No published OAR estimate."},
    "other": {"label": "Other project types", "oar": None, "source": "No published OAR estimate."},
}

# ICVCM Core Carbon Principles status per methodology, snapshot of https://icvcm.org/assessment-status/
ICVCM = json.loads((Path(__file__).resolve().parent / "icvcm_status.json").read_text(encoding="utf-8"))
CODE = re.compile(r"(VMR\d{4}|VM\d{4}|AR-AMS\d{4}|AR-ACM\d{4}|ACM\d{4}|AMS-[IV]+\.[A-Z]+|AM\d{4}|TPDDTEC|RECH|METERED|SIMPLIFIED)")


def _ver(s):
    m = re.search(r"(?:version|v)\s*([\d]+(?:\.\d+)?)", str(s), re.I)
    return float(m.group(1)) if m else None


def _in_range(v, rng):
    a, _, b = rng.partition("-")
    return float(a) <= v <= float(b or a)


ICVCM_ROWS = []
for r in ICVCM["rows"]:
    m = CODE.search(r["method"].upper())
    if m:
        ICVCM_ROWS.append((m.group(1), r["versions"], r["status"]))


def icvcm(meth):
    """Return 'approved', 'not_approved' or 'not_assessed' for a registry methodology string."""
    m = CODE.search(str(meth).upper())
    if not m:
        return "not_assessed"
    rows = [r for r in ICVCM_ROWS if r[0] == m.group(1)]
    v = _ver(meth)
    hits = [s for _, rng, s in rows if v is None or _in_range(v, rng)]
    if any(s.startswith("CCP-Approved") for s in hits):
        return "approved"
    if any(s == "Does not meet" for s in hits):
        return "not_approved"
    return "not_assessed"

RENEWABLE = {"Wind", "Hydropower", "Solar - Centralized", "Solar - Distributed", "Geothermal", "RE Bundled", "Biomass"}
# CarbonPlan OffsetsDB project_type -> Berkeley Type vocabulary, for the independent cross-check
ODB_TO_BERKELEY = {"REDD+": "REDD+", "Cookstove": "Cookstoves", "Wind": "Wind", "Hydropower": "Hydropower",
                   "Centralized Solar": "Solar - Centralized", "Distributed Solar": "Solar - Distributed",
                   "Geothermal": "Geothermal", "Renewable Energy": "RE Bundled", "Biomass": "Biomass",
                   "Improved Forest Management": "Improved Forest Management", "HFC Destruction": "HFC23 Destruction"}
# Probst's cookstove studies cover biomass cookstoves; other household-energy technologies get no OAR.
NOT_BIOMASS_STOVE = re.compile(r"AMS-I\.C|AMS-II\.C|AMS-III\.BG|ALTERNATIVE IGNITION|SOLAR COOKER|LPG|WATER")


def category(btype, country, meth="", name=""):
    """Map Berkeley VROD's curated project Type to a Probst OAR category."""
    us = str(country).strip().upper() in ("UNITED STATES", "USA", "US", "UNITED STATES OF AMERICA")
    if btype == "REDD+":
        return "redd"
    if btype == "Cookstoves":
        return "other" if NOT_BIOMASS_STOVE.search(f"{meth} {name}".upper()) else "cookstove"
    if btype == "HFC23 Destruction":
        return "hfc23"
    if btype == "Improved Forest Management":
        return "ifm_us" if us else "other"
    if btype == "Wind" and "CHINA" in str(country).upper():
        return "wind_china"
    if btype in RENEWABLE:
        return "grid_re"
    # Probst's SF6 figure covers SF6 waste-gas destruction; VROD's "SF6 Replacement" is a different activity.
    return "other"


MOJIBAKE = re.compile("[√‚Äì¬Ã]")
ON_BEHALF = re.compile(r"^\s*(?:retired\s+)?on\s+behalf\s+of\s+(.+?)(?:\s+for\s+|\s*\(|,|;|$)", re.I)


def clean_owner(s):
    """Repair Mac Roman mojibake from the registry export and reduce 'Retired on behalf of X for ...' to X."""
    s = str(s)
    if MOJIBAKE.search(s):
        try:
            s = s.encode("mac_roman").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    m = ON_BEHALF.match(s)
    return m.group(1).strip() if m else s.strip()


def norm(s):
    s = re.sub(r"[^a-z0-9 &]", " ", str(s).lower())
    s = re.sub(r"\b(inc|ltd|limited|llc|plc|corp|corporation|co|company|sa|ag|se|spa|gmbh|nv|bv|pty|pte|"
               r"holdings?|group|the|and|of|international)\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


REDD_M = re.compile(r"VM0004|VM0006|VM0007|VM0009|VM0015|VM0037|VM0048")
STOVE_M = re.compile(r"VMR0006|AMS-II\.G|VM0050|TPDDTEC|IMPROVED COOK|METERED")
RE_M = re.compile(r"ACM0002|AMS-I\.D|AMS-I\.F|VMR0017")


def method_hint(meth):
    """Third, independent signal from the registry methodology code: a category, or None if not decisive."""
    m = str(meth).upper()
    if REDD_M.search(m):
        return "redd"
    if STOVE_M.search(m):
        return "cookstove"
    if RE_M.search(m):
        return "grid_re"
    return None


def resolve(cat_b, cat_o, hint=None):
    """Final category from independent classifications. Any disagreement gets no OAR (never inflate)."""
    signals = [c for c in (cat_o, hint) if isinstance(c, str)]
    # wind_china is grid renewables at the methodology level
    if all(s == cat_b or (s == "grid_re" and cat_b == "wind_china") for s in signals):
        return cat_b, False
    return "other", True


def load(xlsx, db):
    v = pd.read_excel(xlsx, sheet_name="Verra VCS Retirements")
    g = pd.read_excel(xlsx, sheet_name="Gold Retirements")
    p = pd.read_excel(db, sheet_name="PROJECTS", header=3, usecols=["Project ID", "Type"]).dropna(subset=["Project ID"])
    btype = dict(zip(p["Project ID"].astype(str), p["Type"]))
    pid = lambda prefix, s: prefix + s.astype(str).str.replace(r"\.0$", "", regex=True)
    vv = pd.DataFrame({"reg": "Verra", "date": v["Retirement Date"], "qty": v["Retirement QTY"],
                       "owner": v["Beneficial Owner"], "meth": v["Methodology"], "pid": pid("VCS", v["Project ID"]),
                       "country": v["Country"], "vintage": v["Vintage"], "pname": v["Project Name"]})
    gg = pd.DataFrame({"reg": "Gold", "date": g["Retirement Date"], "qty": g["Quantity"],
                       "owner": g["Using Entity"], "meth": g["Methodology"], "pid": pid("GS", g["GSID"]),
                       "country": g["Country"], "vintage": g["Vintage"], "pname": g["Project Name"]})
    a = pd.concat([vv, gg], ignore_index=True)
    a["btype"] = a["pid"].map(btype).fillna("Unknown")
    a["date"] = pd.to_datetime(a["date"], errors="coerce")
    a["qty"] = pd.to_numeric(a["qty"], errors="coerce").fillna(0)
    a["vintage"] = pd.to_numeric(a["vintage"], errors="coerce")
    return a[a["date"] >= SINCE]


def main(xlsx, db, odb):
    a = load(xlsx, db)
    o = pd.read_parquet(odb, columns=["project_id", "project_type"])
    o = o[o["project_type"].notna() & (o["project_type"] != "Unknown")]
    otype = dict(zip(o["project_id"], o["project_type"].map(lambda x: ODB_TO_BERKELEY.get(x, x))))
    proj = a.groupby("pid").agg(btype=("btype", "first"), country=("country", "first"), meth=("meth", "first"),
                                pname=("pname", "first"), qty=("qty", "sum")).reset_index()
    proj["cat_b"] = [category(*r) for r in zip(proj["btype"], proj["country"], proj["meth"], proj["pname"])]
    proj["otype"] = proj["pid"].map(otype)
    proj["cat_o"] = [None if pd.isna(t) else category(t, c, m, n)
                     for t, c, m, n in zip(proj["otype"], proj["country"], proj["meth"], proj["pname"])]
    proj["hint"] = proj["meth"].map(method_hint)
    # the method code only checks projects it can speak to: a decisive hint that conflicts with the type
    proj[["cat", "disputed"]] = [resolve(b, x, h if b in ("redd", "cookstove", "grid_re", "wind_china") or h else None)
                                 for b, x, h in zip(proj["cat_b"], proj["cat_o"], proj["hint"])]
    review = proj[proj["disputed"]].sort_values("qty", ascending=False)
    review[["pid", "pname", "btype", "otype", "meth", "cat_b", "cat_o", "hint", "cat", "qty"]].to_csv(
        Path(__file__).resolve().parent / "classification_review.csv", index=False)
    a["cat"] = a["pid"].map(dict(zip(proj["pid"], proj["cat"])))
    blank = a["owner"].isna() | a["owner"].astype(str).str.strip().str.lower().isin(["", "not applicable", "nan"])
    a.loc[~blank, "owner"] = a.loc[~blank, "owner"].map(clean_owner)
    a["key"] = a["owner"].map(norm)
    a.loc[blank, "key"] = "(no owner listed)"
    a.loc[blank, "owner"] = "(no owner listed)"
    oar = {k: f["oar"] for k, f in FACTORS.items()}
    for col, key in (("eff", "oar"), ("lo", "lo"), ("hi", "hi")):
        a[col] = a["qty"] * a["cat"].map(lambda c: FACTORS[c].get(key) or 0)
    a["ccp"] = a["meth"].map(icvcm)
    a["known"] = a["cat"].map(lambda c: oar[c] is not None)
    a["old"] = a["vintage"] < 2016

    owners = []
    for key, d in a.groupby("key", sort=False):
        t = d["qty"].sum()
        if t <= 0:
            continue
        kt = d.loc[d["known"], "qty"].sum()
        owners.append({
            "n": str(d["owner"].value_counts().index[0]), "t": int(t), "r": len(d),
            "k": int(kt), "e": int(d["eff"].sum()), "el": int(d["lo"].sum()), "eh": int(d["hi"].sum()),
            "ccp": {s: int(x) for s, x in d.groupby("ccp")["qty"].sum().items() if x > 0},
            "o": int(d.loc[d["old"], "qty"].sum()),
            "c": {c: int(x) for c, x in d.groupby("cat")["qty"].sum().items() if x > 0},
            "bt": {b: int(x) for b, x in d.groupby("btype")["qty"].sum().nlargest(6).items() if x > 0},
            "y": [int(d["date"].dt.year.min()), int(d["date"].dt.year.max())],
            # per-year [tonnes, central effective, tonnes with OAR] for past-to-present trend
            "ys": {int(yr): [int(x["qty"].sum()), int(x["eff"].sum()), int(x.loc[x["known"], "qty"].sum())]
                   for yr, x in d.groupby(d["date"].dt.year)},
        })
    owners.sort(key=lambda o: -o["t"])
    # Independent emissions: Climate TRACE ownership-weighted parent emissions, via a reviewed alias table.
    ct_path = OUT / "ct_owners.json"
    if ct_path.exists():
        ct = json.loads(ct_path.read_text(encoding="utf-8"))
        aliases = pd.read_csv(Path(__file__).resolve().parent / "aliases.csv")
        alias = {r.buyer_name: r for r in aliases.itertuples()}
        for o in owners:
            r = alias.get(o["n"])
            if r is not None and r.ct_parent_id in ct["owners"]:
                name, low, high, assets, sub = ct["owners"][r.ct_parent_id]
                o["ct"] = {"low": low, "high": high, "assets": assets, "parent": name.strip(), "match": r.match_note,
                           "year": ct["year"], "controlled_by_other": bool(sub),
                           # core: the group's main emitting activities are in Climate TRACE's ownership sectors
                           # partial: main emissions (e.g. vehicle manufacturing, flights) are outside that coverage
                           "coverage": r.coverage}
    # Self-reported emissions from primary company documents (data/reported_emissions.csv, one row per buyer name).
    rep = pd.read_csv(Path(__file__).resolve().parent / "reported_emissions.csv")
    rep_by = {r.buyer_name: r for r in rep.itertuples()}
    for o in owners:
        r = rep_by.get(o["n"])
        if r is not None:
            o["rep"] = {"group": r.group, "year": int(r.year), "scope1": int(r.scope1_t),
                        "total": None if pd.isna(r.total_t) else int(r.total_t), "boundary": r.boundary,
                        "source": r.source_title, "url": r.source_url, "section": r.section, "checked": r.checked}
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {"source": "Berkeley Voluntary Registry Offsets Database v2026-08 (CC BY 4.0), Verra + Gold Standard retirements",
            "since": SINCE, "rows": int(len(a)), "tonnes": int(a["qty"].sum()),
            "named_share": round(float(a.loc[~blank, "qty"].sum() / a["qty"].sum()), 4),
            "ys": {int(yr): [int(x["qty"].sum()), int(x["eff"].sum()), int(x.loc[x["known"], "qty"].sum())]
                   for yr, x in a.groupby(a["date"].dt.year)},
            "cats": {c: int(x) for c, x in a.groupby("cat")["qty"].sum().items()},
            "ccp": {s: int(x) for s, x in a.groupby("ccp")["qty"].sum().items()},
            "known": int(a.loc[a["known"], "qty"].sum()), "eff": int(a["eff"].sum()),
            "eff_lo": int(a["lo"].sum()), "eff_hi": int(a["hi"].sum())}
    # Full dataset (for download) + a light search index and 500-owner shards (for the web app).
    (OUT / "owners.json").write_text(json.dumps({"meta": meta, "owners": owners}, separators=(",", ":")), encoding="utf-8")
    (OUT / "index.json").write_text(json.dumps({"meta": meta, "shard": SHARD, "rows": [
        [o["n"], o["t"], o["k"], o["e"]] for o in owners]}, separators=(",", ":")), encoding="utf-8")
    (OUT / "o").mkdir(exist_ok=True)
    for i in range(0, len(owners), SHARD):
        (OUT / "o" / f"{i // SHARD}.json").write_text(json.dumps(owners[i:i + SHARD], separators=(",", ":")), encoding="utf-8")
    (OUT / "factors.json").write_text(json.dumps({"factors": FACTORS, "icvcm_source": ICVCM["source"],
                                                  "icvcm_page_modified": ICVCM["page_modified"]}, indent=1), encoding="utf-8")
    agree = proj["cat_o"].notna()
    print(meta, "owners:", len(owners), "unknown type rows:", int((a["btype"] == "Unknown").sum()))
    print("cross-checked tonnes: %.1f%%, disputed projects: %d (%.2f%% of tonnes)" % (
        100 * proj.loc[agree, "qty"].sum() / proj["qty"].sum(), len(review),
        100 * review["qty"].sum() / proj["qty"].sum()))


if __name__ == "__main__":
    assert clean_owner("Eni Plenitude spa Societ√† Benefit") == "Eni Plenitude spa Società Benefit"
    assert clean_owner("Retired on behalf of easyJet for aviation emissions period 01 January ‚Äì 31 March 2022") == "easyJet"
    assert clean_owner("On behalf of South Pole Holding Ltd") == "South Pole Holding Ltd"
    assert clean_owner("Shell") == "Shell"
    assert category("REDD+", "Peru") == "redd"
    assert category("Wind", "China") == "wind_china"
    assert category("Wind", "India") == "grid_re"
    assert category("Cookstoves", "Kenya") == "cookstove"
    assert category("Biodigesters", "Vietnam") == "other"
    assert category("Clean Water", "Kenya") == "other"
    assert category("Improved Forest Management", "United States") == "ifm_us"
    assert category("Improved Forest Management", "Malaysia") == "other"
    assert category("SF6 Replacement", "Israel") == "other"
    assert category("Cookstoves", "China", "AMS-I.C. Thermal energy production", "Houji Solar Cooker Project") == "other"
    assert category("Cookstoves", "South Africa", "GS Alternative Ignition Coal Fires v1.", "Highveld") == "other"
    assert resolve("redd", "redd") == ("redd", False)
    assert resolve("other", "redd") == ("other", True)
    assert resolve("cookstove", None) == ("cookstove", False)
    assert resolve("wind_china", "wind_china", "grid_re") == ("wind_china", False)
    assert resolve("cookstove", None, "grid_re") == ("other", True)
    assert method_hint("VM0007 (Version 1.5)") == "redd" and method_hint("ACM0001") is None
    assert icvcm("ACM0002 (Version 19)") == "not_approved"
    assert icvcm("GS TPDDTEC v3.1") == "approved"
    assert icvcm("GS TPDDTEC v 1.") == "not_assessed"
    assert icvcm("VM0007 (Version 1.6)") == "not_assessed"
    assert icvcm("VM0048 (Version 1.0)") == "approved"
    main(sys.argv[1], sys.argv[2], sys.argv[3])
