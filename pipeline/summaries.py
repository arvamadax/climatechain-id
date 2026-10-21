"""Small summary files for the web app, built from web/data/owners.json (output of pipeline/build.py).
- hidden.json:    who stands behind retired credits (named companies vs anonymous, resellers, wallets, unknown codes)
- companies.json: one row per reviewed company group, for the Data page table and comparison
Usage: python pipeline/summaries.py
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "web" / "data"
# Display order; "unreviewed" = named buyers outside the reviewed list (data/buyers.csv).
KINDS = ["company", "unreviewed", "public_body", "intermediary", "wallet", "tokenization", "unidentified", "anonymous"]
HIDDEN = {"intermediary", "wallet", "tokenization", "unidentified", "anonymous"}


def hidden(owners):
    total = sum(o["t"] for o in owners)
    kinds = {k: [0, 0] for k in KINDS}  # tonnes, buyers
    top = []
    for i, o in enumerate(owners):  # same order as index.json rows, so i links to #buyer-i
        k = (o.get("g") or {}).get("type", "unreviewed")
        kinds[k][0] += o["t"]
        kinds[k][1] += 1
        if k in HIDDEN:
            top.append({"i": i, "n": o["n"], "kind": k, "t": o["t"], "k": o["k"], "e": o["e"]})
    top.sort(key=lambda x: -x["t"])
    out = {"total": total, "kinds": {k: {"t": t, "buyers": n} for k, (t, n) in kinds.items()}, "top": top[:15]}
    assert sum(v["t"] for v in out["kinds"].values()) == total
    return out


def companies(owners):
    """Sum the reviewed buyer names of each company group (e.g. Gucci + Guccio Gucci Spa = Kering)."""
    groups = {}
    for i, o in enumerate(owners):
        g = o.get("g") or {}
        if g.get("type") != "company":
            continue
        c = groups.setdefault(g["group"], {"group": g["group"], "names": [], "t": 0, "k": 0, "e": 0, "el": 0, "eh": 0,
                                           "ccp": 0, "i": i, "rep": o.get("rep"), "ct": None})
        c["names"].append(o["n"])
        for f in ("t", "k", "e", "el", "eh"):
            c[f] += o[f]
        c["ccp"] += (o.get("ccp") or {}).get("approved", 0)
        if o.get("ct") and o["ct"].get("coverage") == "core" and c["ct"] is None:
            c["ct"] = {"low": o["ct"]["low"], "high": o["ct"]["high"], "year": o["ct"]["year"]}
        c["rep"] = c["rep"] or o.get("rep")
    rows = sorted(groups.values(), key=lambda c: -c["t"])
    # Why a group has no reported emissions: what was checked and what was found (data/emissions_gaps.csv).
    gaps = {r["group"]: {"reason": r["reason"], "checked": r["checked"]}
            for r in csv.DictReader(open(ROOT / "data" / "emissions_gaps.csv", encoding="utf-8"))}
    for c in rows:
        r = c.pop("rep")
        c["rep"] = {k: r[k] for k in ("year", "scope1", "total", "url", "source", "boundary")} if r else None
        c["gap"] = None if r else gaps.get(c["group"])
        assert r or c["gap"], f"{c['group']}: no reported emissions and no reason in data/emissions_gaps.csv"
    return rows


def main():
    owners = json.loads((OUT / "owners.json").read_text(encoding="utf-8"))["owners"]
    h, c = hidden(owners), companies(owners)
    assert all(x["k"] <= x["t"] and x["e"] <= x["k"] for x in c)
    (OUT / "hidden.json").write_text(json.dumps(h, separators=(",", ":")), encoding="utf-8")
    (OUT / "companies.json").write_text(json.dumps(c, separators=(",", ":")), encoding="utf-8")
    share = sum(h["kinds"][k]["t"] for k in HIDDEN) / h["total"]
    print(f"hidden or unnamed: {share:.1%} of {h['total']:,} t; {len(c)} company groups")


if __name__ == "__main__":
    main()
