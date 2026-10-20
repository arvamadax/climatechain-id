"""Attribute Climate TRACE asset emissions to parent companies using ownership shares.

Usage: python data/ownership.py <dir with extracted Climate TRACE sector packages> [year]
Reads every *_emissions_sources_ownership_*.csv and the matching *_emissions_sources_*.csv (co2e_100yr),
writes web/data/ct_owners.json:
  {parent_entity_id: [name, low, high, assets]}
low  = sum(asset emissions x known overall_share_percent)
high = low + full emissions of assets where the parent's share is unknown (upper bound, never a guess)
Source: Climate TRACE Emissions Inventory v5.7.0 (CC BY 4.0), https://zenodo.org/records/20830133
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import pandas as pd

OUT = Path(__file__).resolve().parent.parent / "web" / "data" / "ct_owners.json"


def asset_emissions(path, year):
    total = defaultdict(float)
    for chunk in pd.read_csv(path, usecols=["source_id", "start_time", "gas", "emissions_quantity"], chunksize=500_000):
        c = chunk[(chunk["gas"] == "co2e_100yr") & chunk["start_time"].astype(str).str.startswith(str(year))]
        for sid, q in c.groupby("source_id")["emissions_quantity"].sum().items():
            total[int(sid)] += float(q)
    return total


def attribute(own, emis):
    """Return {parent_id: [name, low, high, assets]} for one ownership table.
    A parent can hold one asset through several ownership paths: known shares are summed (capped at 100%);
    if any path has an unknown share, the upper bound assumes the parent owns the rest of the asset."""
    out = {}
    for (pid, name), d in own.groupby(["parent_entity_id", "parent_name"]):
        low = high = 0.0
        for sid, paths in d.groupby("source_id")["overall_share_percent"]:
            e = emis.get(int(sid), 0.0)
            known = min(100.0, float(paths.dropna().sum())) / 100
            low += e * known
            high += e if paths.isna().any() else e * known
        out[pid] = [name, low, high, d["source_id"].nunique()]
    return out


PSEUDO_HOLDER = re.compile(r"shareholder\(s\)|person\(s\)|^public$|unknown", re.I)


def held_by_others(paths):
    """Names controlled (>50%) by a real entity in any ownership path. Minority investors and
    pseudo-holders such as "small shareholder(s)" or "natural person(s)" do not count."""
    names = set()
    for p in paths.dropna():
        parts = str(p).split(" -> ")
        for prev, part in zip(parts, parts[1:]):
            controller = prev.rpartition(" [")[0] or prev
            name, _, pct = part.rpartition(" [")
            if PSEUDO_HOLDER.search(controller.strip()):
                continue
            try:
                if float(pct.rstrip("%]")) > 50:
                    names.add(name.strip())
            except ValueError:  # "[unknown %]"
                pass
    return names


def main(root, year=2025):
    owners, subsidiaries = {}, set()
    for own_path in sorted(Path(root).rglob("*_emissions_sources_ownership_*.csv")):
        src_path = Path(str(own_path).replace("_ownership", ""))
        if not src_path.exists():
            continue
        emis = asset_emissions(src_path, year)
        own = pd.read_csv(own_path, usecols=["parent_name", "parent_entity_id", "overall_share_percent", "ownership_path",
                                             "source_id"], low_memory=False)
        subsidiaries |= held_by_others(own["ownership_path"])
        for pid, (name, low, high, n) in attribute(own, emis).items():
            prev = owners.setdefault(pid, [name, 0.0, 0.0, 0])
            prev[1] += low
            prev[2] += high
            prev[3] += n
        print(f"{own_path.name}: {len(own)} ownership rows, {len(emis)} assets with {year} emissions")
    # 5th field: 1 if this entity is itself owned by another listed company (use the top parent for a buyer)
    owners = {k: [v[0], round(v[1]), round(v[2]), v[3], int(v[0].strip() in subsidiaries)]
              for k, v in owners.items() if v[2] > 0}
    OUT.write_text(json.dumps({"source": "Climate TRACE v5.7.0 (CC BY 4.0)", "year": year, "gas": "co2e_100yr",
                               "owners": owners}, separators=(",", ":")), encoding="utf-8")
    print(len(owners), "parents ->", OUT)


if __name__ == "__main__":
    t = pd.DataFrame({"parent_entity_id": ["A", "A", "B", "C", "C"], "parent_name": ["a", "a", "b", "c", "c"],
                      "overall_share_percent": [50.0, None, 25.0, 4.78, 3.64], "source_id": [1, 2, 1, 3, 3]})
    r = attribute(t, {1: 100.0, 2: 40.0, 3: 1000.0})
    assert r["A"] == ["a", 50.0, 90.0, 2] and r["B"] == ["b", 25.0, 25.0, 1], r
    assert abs(r["C"][1] - 84.2) < 1e-6 and r["C"][3] == 1, r  # two paths to one asset are summed
    assert held_by_others(pd.Series(["X -> Y Co [83.1%] -> Plant [100.0%]", "Fund -> Big PLC [6.0%] -> Z [unknown %]",
                                     "small shareholder(s)  -> Shell PLC [100.0%] -> BG Group Ltd [100.0%]"])) == {"Y Co", "Plant", "BG Group Ltd"}
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 2025)
