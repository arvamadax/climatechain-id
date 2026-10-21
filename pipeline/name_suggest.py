"""Suggest which reviewed company group an unreviewed registry name may belong to (character n-gram TF-IDF,
cosine similarity). Internal review aid only: on real names about one suggestion in five was wrong (for example
"DELTA Energie" -> Delta Air Lines), so suggestions are never shown on the site or used in grades or totals.
A person checks each one; confirmed names are added to data/buyers.csv by curate_buyers.py.
Reads web/data/index.json, data/buyers.csv; writes data/name_suggestions_review.csv.
Usage: python pipeline/name_suggest.py
"""
import csv
import json
import re
import unicodedata
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "web" / "data"
TOP = 1000          # unreviewed names to look at, by tonnes
MIN_PREC = 0.95     # publish only if the held-out test reaches this precision
STOP = r"\b(inc|plc|ag|sa|s a|spa|s p a|se|ltd|limited|llc|corp|corporation|co|group|holdings?|the|gmbh|kg|bv|nv|pty|company|retired on behalf of|on behalf of)\b"


def clean(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\(.*?\)", " ", s)
    s = re.sub(STOP, " ", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


GENERIC = {"stadtwerke", "werke", "energy", "energie", "versorgungs", "staedtische", "stadtische", "retailer", "offsets",
           "customers", "carbon", "neutral", "climate", "international", "global", "services", "solutions", "trading",
           "airlines", "lines", "group", "holding", "company", "industries", "deutschland", "france", "australia",
           "resources", "airways", "banking", "bank", "petroleum", "power", "cargo", "corporation", "management",
           "investment", "insurance", "account", "number", "retired", "credits", "delivered", "zealand", "japan", "china"}


def words(s):
    return {w for w in clean(s).split() if len(w) >= 4 and w not in GENERIC}


def fit(groups):
    """Vectorise each group by all its known names."""
    docs = [" | ".join(clean(n) for n in names) for names in groups.values()]
    vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 4), min_df=1)
    return vec, vec.fit_transform(docs), list(groups)


def best(vec, M, labels, name, groups):
    """Most similar group; similarity is 0 unless the name shares a distinctive word with that group."""
    sims = cosine_similarity(vec.transform([clean(name)]), M)[0]
    k = sims.argmax()
    own = set().union(*(words(n) for n in groups[labels[k]]))
    others = set().union(*(words(n) for g, ns in groups.items() if g != labels[k] for n in ns))
    shared = words(name) & (own - others)  # a word that belongs to this group only
    return labels[k], float(sims[k]) if shared else 0.0


def main():
    rows = list(csv.DictReader(open(ROOT / "data" / "buyers.csv", encoding="utf-8")))
    company = [r for r in rows if r["type"] == "company"]
    groups = {}
    for r in company:
        groups.setdefault(r["group"], []).extend([r["group"], r["buyer_name"]])

    # held-out test: hide each reviewed name from its own group, then predict it
    threshold, results = None, []
    for r in company:
        g = {k: [n for n in v if not (k == r["group"] and n == r["buyer_name"])] for k, v in groups.items()}
        vec, M, labels = fit(g)
        pred, sim = best(vec, M, labels, r["buyer_name"], g)
        results.append((sim, pred == r["group"]))
    for t in [x / 100 for x in range(30, 96, 5)]:
        kept = [ok for s, ok in results if s >= t]
        if kept and sum(kept) / len(kept) >= MIN_PREC:
            threshold = t
            break
    if threshold is None:
        print("precision target not reached; nothing published")
        return
    kept = [ok for s, ok in results if s >= threshold]
    precision, recall = sum(kept) / len(kept), sum(kept) / len(results)

    vec, M, labels = fit(groups)
    reviewed = {r["buyer_name"] for r in rows}
    index = json.loads((OUT / "index.json").read_text(encoding="utf-8"))["rows"]
    sugg = []
    for i, row in enumerate(index[:TOP * 3]):
        name = row[0]
        if name in reviewed or name.startswith("(") or len(clean(name)) < 3:
            continue
        g, sim = best(vec, M, labels, name, groups)
        if sim >= threshold:
            sugg.append({"i": i, "name": name, "group": g, "similarity": round(sim, 3), "t": row[1]})
        if len([x for x in index[:i] if x[0] not in reviewed]) >= TOP:
            break
    meta = {"method": "character 3-4-gram TF-IDF, cosine similarity (scikit-learn)",
            "test": f"leave-one-out on {len(results)} reviewed company names",
            "threshold": threshold, "precision": round(precision, 3), "recall": round(recall, 3),
            "note": "Suggestions are not checked and are never used in grades or totals."}
    with open(ROOT / "data" / "name_suggestions_review.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["name", "suggested_group", "similarity", "retired_t", "checked"])
        w.writeheader()
        w.writerows({"name": x["name"], "suggested_group": x["group"], "similarity": x["similarity"], "retired_t": x["t"], "checked": ""} for x in sugg)
    assert precision >= MIN_PREC
    print(meta, len(sugg), "suggestions")
    for s in sugg[:12]:
        print(f"  {s['name'][:60]!r} -> {s['group']} ({s['similarity']})")


if __name__ == "__main__":
    main()
