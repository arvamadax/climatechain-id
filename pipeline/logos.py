"""Download each company group's logo (its website icon) and pick its brand colour.
Reads data/logos.csv (group, official domain; blank = no verified domain, the site shows initials).
Writes web/logos/<domain>.png and web/data/logos.json {group: {"src", "color"}}.
Logos are trademarks of their owners, shown only to identify the company.
Usage: python pipeline/logos.py
"""
import csv
import io
import json
import urllib.request
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGOS = ROOT / "web" / "logos"
# Tried in order: Google's icon service, then the site's own touch icon, then DuckDuckGo's icon service.
SOURCES = ["https://www.google.com/s2/favicons?domain={}&sz=128", "https://www.{}/apple-touch-icon.png",
           "https://{}/apple-touch-icon.png", "https://icons.duckduckgo.com/ip3/{}.ico"]


def brand_color(img):
    """Most common saturated colour, ignoring transparent, near-white, near-black and grey pixels; None if none."""
    px = img.convert("RGBA").resize((48, 48)).getdata()
    seen = Counter()
    for r, g, b, a in px:
        if a < 200:
            continue
        hi, lo = max(r, g, b), min(r, g, b)
        if hi < 40 or lo > 225 or hi - lo < 40:
            continue
        seen[(r // 16 * 16 + 8, g // 16 * 16 + 8, b // 16 * 16 + 8)] += 1
    if not seen:
        return None
    return "#%02x%02x%02x" % seen.most_common(1)[0][0]


def main():
    LOGOS.mkdir(parents=True, exist_ok=True)
    out = {}
    rows = list(csv.DictReader(open(ROOT / "data" / "logos.csv", encoding="utf-8")))
    for r in rows:
        d = r["domain"].strip()
        if not d:
            continue
        img = None
        for url in SOURCES:
            try:
                req = urllib.request.Request(url.format(d), headers={"User-Agent": "Mozilla/5.0"})
                img = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=20).read()))
                img.load()
            except Exception:  # network error or not an image: try the next source
                img = None
                continue
            if img.width >= 32:  # smaller = a generic placeholder icon
                break
            img = None
        if img is None and (LOGOS / f"{d}.png").exists():  # transient failure: keep the logo from the last run
            img = Image.open(LOGOS / f"{d}.png")
        if img is None:
            print("no icon", d)
            continue
        img.convert("RGBA").save(LOGOS / f"{d}.png")
        out[r["group"]] = {"src": f"logos/{d}.png", "color": brand_color(img)}
    (ROOT / "web" / "data" / "logos.json").write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"{len(out)} logos of {len(rows)} groups; {sum(1 for v in out.values() if v['color'])} with a brand colour")


if __name__ == "__main__":
    assert brand_color(Image.new("RGBA", (8, 8), (255, 255, 255, 255))) is None
    assert brand_color(Image.new("RGBA", (8, 8), (220, 30, 30, 255))) == "#d81818"
    main()
