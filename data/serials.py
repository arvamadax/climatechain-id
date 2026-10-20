"""Write the registry serial ranges retired on behalf of one beneficiary since 2020.

Usage: python data/serials.py <Berkeley_VROD_registry_files_*.xlsx> "<exact beneficiary name as shown in Netra>" <out.json>
Output: ["VCS:<serial>", "GS:<serial>", ...] used as ClaimRegistry nullifiers.
"""
import json
import sys

import pandas as pd

from build import SINCE, norm


def main(xlsx, name, out):
    key = norm(name)
    v = pd.read_excel(xlsx, sheet_name="Verra VCS Retirements", usecols=["Retirement Date", "Beneficial Owner", "Serial Number"])
    g = pd.read_excel(xlsx, sheet_name="Gold Retirements", usecols=["Retirement Date", "Using Entity", "Serial Number"])
    rows = []
    for reg, d, col in (("VCS", v, "Beneficial Owner"), ("GS", g, "Using Entity")):
        d = d[pd.to_datetime(d["Retirement Date"], errors="coerce") >= SINCE]
        d = d[d[col].map(norm) == key]
        rows += [f"{reg}:{s}" for s in d["Serial Number"].dropna().astype(str)]
    rows = sorted(set(rows))
    json.dump(rows, open(out, "w", encoding="utf-8"))
    print(len(rows), "serial ranges for", name)


if __name__ == "__main__":
    main(*sys.argv[1:4])
