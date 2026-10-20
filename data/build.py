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

# Outcome Achievement Ratio (share of issued credits that are real reductions).
# Only categories with published estimates get a number; everything else is "limited evidence".
FACTORS = {
    "redd": {"label": "Avoided deforestation (REDD+)", "oar": 0.247,
             "source": "Probst et al. 2024, Nature Communications, doi:10.1038/s41467-024-53645-z"},
    "cookstove": {"label": "Cookstoves", "oar": 0.108,
                  "source": "Probst et al. 2024 (10.8%); Gill-Wiehl et al. 2024, Nature Sustainability, doi:10.1038/s41893-023-01259-6 (9.2x over-crediting)"},
    "wind_china": {"label": "Wind power in China", "oar": 0.0,
                   "source": "Probst et al. 2024: no statistically significant reductions; OAR set to 0%"},
    "ifm_us": {"label": "Improved forest management (US)", "oar": 0.0,
               "source": "Probst et al. 2024: no statistically significant reductions; OAR set to 0%"},
    "hfc23": {"label": "HFC-23 destruction", "oar": 0.683, "source": "Probst et al. 2024"},
    "sf6": {"label": "SF6 destruction", "oar": 0.164, "source": "Probst et al. 2024"},
    "grid_re": {"label": "Grid-connected renewables (outside China wind)", "oar": None,
                "source": "No OAR estimate. ICVCM ruled eight renewable energy methodologies ineligible for the CCP label (2024)."},
    "other": {"label": "Other project types", "oar": None, "source": "No OAR estimate in the reviewed literature."},
}
ICVCM_REJECTED = {"redd": False, "cookstove": True, "grid_re": True}  # cookstove: main methodologies rejected Mar 2025

REDD = ("VM0007", "VM0009", "VM0015", "VM0006", "VM0004", "VM0037", "VM0048")
COOK = ("VMR0006", "AMS-II.G", "AMS-I.E", "VM0050", "GS TPDDTEC", "GS METHODOLOGY FOR IMPROVED COOK", "METERED")
IFM = ("VM0010", "VM0012", "VM0003", "VM0005")
GRID_RE = ("ACM0002", "AMS-I.D", "AMS-I.F", "AMS-I.A")


def category(meth, ptype, country, name):
    m = str(meth).upper()
    t = f"{ptype} {name}".upper()
    if m.startswith(REDD):
        return "redd"
    if any(k in m for k in COOK) or "ENERGY EFFICIENCY - DOMESTIC" in t or "COOKSTOVE" in t or "COOK STOVE" in t:
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
    a["eff"] = a["qty"] * a["cat"].map(lambda c: oar[c] if oar[c] is not None else 0)
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
            "k": int(kt), "e": int(d["eff"].sum()),
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
    (OUT / "factors.json").write_text(json.dumps({"factors": FACTORS, "icvcm_rejected": ICVCM_REJECTED}, indent=1), encoding="utf-8")
    print(meta, "owners:", len(owners))


if __name__ == "__main__":
    assert category("VM0007 (Version 1.6)", "", "Peru", "x") == "redd"
    assert category("ACM0002", "Wind", "China", "Wind farm") == "wind_china"
    assert category("ACM0002", "", "India", "Solar park") == "grid_re"
    assert category("GS TPDDTEC v 1.", "Energy Efficiency - Domestic", "Kenya", "x") == "cookstove"
    main(sys.argv[1])
