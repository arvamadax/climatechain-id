"""Build Netra's static dataset from the Berkeley Voluntary Registry Offsets Database (VROD).

Usage: python data/build.py <path to Berkeley_VROD_registry_files_*.xlsx>
Writes web/data/owners.json and web/data/factors.json.
"""
import json
import re
import sys
from pathlib import Path

import pandas as pd

SINCE = "2020-01-01"
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

REDD = ("VM0007", "VM0009", "VM0015", "VM0006", "VM0004", "VM0037", "VM0048")
COOK = ("VMR0006", "AMS-II.G", "AMS-I.E", "VM0050", "GS TPDDTEC", "GS METHODOLOGY FOR IMPROVED COOK", "METERED")
IFM = ("VM0010", "VM0012", "VM0003", "VM0005")
GRID_RE = ("ACM0002", "AMS-I.D", "AMS-I.F", "AMS-I.A")


def category(meth, ptype, country, name):
    m = str(meth).upper()
    t = f"{ptype} {name}".upper()
    if m.startswith(REDD):
        return "redd"
    stove = any(k in t for k in ("COOK", "STOVE", "CHULHA", "FOGON", "KITCHEN"))
    not_stove = any(k in t for k in ("BIOGAS", "BIODIGEST", "WATER", "LIFESTRAW", "FILTER", "PURIF", "LIGHTING", "LAMP"))
    if (any(k in m for k in COOK) or "ENERGY EFFICIENCY - DOMESTIC" in t) and stove and not not_stove:
        return "cookstove"
    if m.startswith("AM0001"):
        return "hfc23"
    if m.startswith(("AM0035", "AM0065", "AM0078")):
        return "sf6"
    if m.startswith(IFM) or "IMPROVED FOREST" in t:
        return "ifm_us" if str(country).upper() in ("UNITED STATES", "USA", "US") else "other"
    if m.startswith(GRID_RE) or any(k in t for k in ("WIND", "SOLAR", "HYDRO", "PV", "GEOTHERMAL")):
        china = "CHINA" in str(country).upper()
        return "wind_china" if china and "WIND" in t else "grid_re"
    return "other"


def norm(s):
    s = re.sub(r"[^a-z0-9 &]", " ", str(s).lower())
    s = re.sub(r"\b(inc|ltd|limited|llc|plc|corp|corporation|co|company|sa|ag|se|spa|gmbh|nv|bv|pty|pte|"
               r"holdings?|group|the|and|of|international)\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def load(xlsx):
    v = pd.read_excel(xlsx, sheet_name="Verra VCS Retirements")
    g = pd.read_excel(xlsx, sheet_name="Gold Retirements")
    vv = pd.DataFrame({"reg": "Verra", "date": v["Retirement Date"], "qty": v["Retirement QTY"],
                       "owner": v["Beneficial Owner"], "meth": v["Methodology"], "ptype": v["Sectoral Scope"],
                       "country": v["Country"], "name": v["Project Name"], "vintage": v["Vintage"]})
    gg = pd.DataFrame({"reg": "Gold", "date": g["Retirement Date"], "qty": g["Quantity"],
                       "owner": g["Using Entity"], "meth": g["Methodology"], "ptype": g["Project Type"],
                       "country": g["Country"], "name": g["Project Name"], "vintage": g["Vintage"]})
    a = pd.concat([vv, gg], ignore_index=True)
    a["date"] = pd.to_datetime(a["date"], errors="coerce")
    a["qty"] = pd.to_numeric(a["qty"], errors="coerce").fillna(0)
    a["vintage"] = pd.to_numeric(a["vintage"], errors="coerce")
    return a[a["date"] >= SINCE]


def main(xlsx):
    a = load(xlsx)
    a["cat"] = [category(*r) for r in zip(a["meth"], a["ptype"], a["country"], a["name"])]
    blank = a["owner"].isna() | a["owner"].astype(str).str.strip().str.lower().isin(["", "not applicable", "nan"])
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
            "y": [int(d["date"].dt.year.min()), int(d["date"].dt.year.max())],
        })
    owners.sort(key=lambda o: -o["t"])
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {"source": "Berkeley Voluntary Registry Offsets Database v2026-08 (CC BY 4.0), Verra + Gold Standard retirements",
            "since": SINCE, "rows": int(len(a)), "tonnes": int(a["qty"].sum()),
            "named_share": round(float(a.loc[~blank, "qty"].sum() / a["qty"].sum()), 4)}
    (OUT / "owners.json").write_text(json.dumps({"meta": meta, "owners": owners}, separators=(",", ":")), encoding="utf-8")
    (OUT / "factors.json").write_text(json.dumps({"factors": FACTORS, "icvcm_source": ICVCM["source"],
                                                  "icvcm_page_modified": ICVCM["page_modified"]}, indent=1), encoding="utf-8")
    print(meta, "owners:", len(owners))


if __name__ == "__main__":
    assert category("VM0007 (Version 1.6)", "", "Peru", "x") == "redd"
    assert category("ACM0002", "Wind", "China", "Wind farm") == "wind_china"
    assert category("ACM0002", "", "India", "Solar park") == "grid_re"
    assert category("GS TPDDTEC v 1.", "Energy Efficiency - Domestic", "Kenya", "Burn Stoves Project") == "cookstove"
    assert category("GS TPDDTEC v 1.", "", "Vietnam", "Biogas Program for the Animal Husbandry Sector") == "other"
    assert category("GS Methodology for Improved Cook stoves", "", "Kenya", "Sustainable Deployment of the LifeStraw Family") == "other"
    assert icvcm("ACM0002 (Version 19)") == "not_approved"
    assert icvcm("GS TPDDTEC v3.1") == "approved"
    assert icvcm("GS TPDDTEC v 1.") == "not_assessed"
    assert icvcm("VM0007 (Version 1.6)") == "not_assessed"
    assert icvcm("VM0048 (Version 1.0)") == "approved"
    main(sys.argv[1])
