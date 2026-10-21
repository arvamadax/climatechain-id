"""Unusual retirement patterns (machine learning, Isolation Forest) for buyers with at least 100,000 t retired.
An unusual pattern is a reason to look closer, never proof of wrongdoing. Each flag carries readable reasons.
Reads web/data/owners.json; writes web/data/anomalies.json {index: {"score", "reasons"}} plus the rule settings.
Usage: python pipeline/anomalies.py
"""
import json
from pathlib import Path

import numpy as np
from sklearn.ensemble import IsolationForest

OUT = Path(__file__).resolve().parent.parent / "web" / "data"
MIN_T = 100_000      # only buyers large enough for a pattern to matter
SHARE = 0.02         # flag about 2% of them (Isolation Forest contamination)
SEED = 7

# feature name -> (plain-language reason, function of the owner record)
FEATURES = {
    "old_vintage": ("{:.0%} of credits have a vintage before 2016", lambda o: o["o"] / o["t"]),
    "rejected": ("{:.0%} use methodologies ICVCM found do not meet its Core Carbon Principles", lambda o: (o["ccp"].get("not_approved", 0)) / o["t"]),
    "unresearched": ("{:.0%} come from project types without a research estimate", lambda o: 1 - o["k"] / o["t"]),
    "one_year": ("{:.0%} of the volume was retired in a single year", lambda o: max(v[0] for v in o["ys"].values()) / o["t"]),
    "low_real": ("only {:.0%} of researched tonnes are likely real", lambda o: o["e"] / o["k"] if o["k"] else 1.0),
    "big_batches": ("average retirement of {:,.0f} t, far above typical", lambda o: o["t"] / max(o["r"], 1)),
}


def main():
    owners = json.loads((OUT / "owners.json").read_text(encoding="utf-8"))["owners"]
    idx = [i for i, o in enumerate(owners) if o["t"] >= MIN_T and o["n"] != "(no owner listed)"]
    raw = np.array([[f(owners[i]) for _, f in FEATURES.values()] for i in idx], dtype=float)
    X = raw.copy()
    X[:, -1] = np.log10(X[:, -1])  # batch size spans orders of magnitude
    model = IsolationForest(n_estimators=300, contamination=SHARE, random_state=SEED).fit(X)
    flagged = model.predict(X) == -1
    scores = -model.score_samples(X)
    p95 = np.percentile(raw, 95, axis=0)
    p5 = np.percentile(raw, 5, axis=0)
    out = {}
    names = list(FEATURES)
    for row, i in enumerate(idx):
        if not flagged[row]:
            continue
        reasons = []
        for c, name in enumerate(names):
            v = raw[row, c]
            unusual = v <= p5[c] if name == "low_real" else v >= p95[c]
            if unusual:
                reasons.append(FEATURES[name][0].format(v))
        if reasons:  # a flag without a readable reason is not shown
            out[str(i)] = {"score": round(float(scores[row]), 3), "reasons": reasons}
    meta = {"method": "Isolation Forest (scikit-learn), 300 trees, contamination 2%, seed 7",
            "population": f"{len(idx)} buyers with at least {MIN_T:,} t retired since 2020",
            "reason_rule": "a feature is named when it is in the top 5% of the population (bottom 5% for likely-real share)",
            "flagged": len(out)}
    (OUT / "anomalies.json").write_text(json.dumps({"meta": meta, "flags": out}, indent=0), encoding="utf-8")
    assert 0 < len(out) <= 0.05 * len(idx), len(out)
    print(meta)
    for i, f in sorted(out.items(), key=lambda x: -x[1]["score"])[:8]:
        print(owners[int(i)]["n"][:50], f["reasons"])


if __name__ == "__main__":
    main()
