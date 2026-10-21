"""Append verified company-reported emissions rows to data/reported_emissions.csv (skips groups already present).
Usage: python pipeline/add_reported.py "group|year|scope1_t|total_t|boundary|source_title|source_url|section" ...
"""
import csv
import sys
from pathlib import Path

F = Path(__file__).resolve().parent.parent / "data" / "reported_emissions.csv"
rows = list(csv.DictReader(open(F, encoding="utf-8")))
have = {r["group"] for r in rows}
for arg in sys.argv[1:]:
    g, y, s1, tot, b, t, u, sec = arg.split("|")
    if g in have:
        continue
    rows.append(dict(group=g, year=y, scope1_t=s1, total_t=tot, boundary=b, source_title=t, source_url=u, section=sec, checked="2026-10-20"))
    have.add(g)
with open(F, "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]))
    w.writeheader()
    w.writerows(rows)
print(len(rows), "groups")
