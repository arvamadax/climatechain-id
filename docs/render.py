"""Render every Markdown document as branded images.
Sources live in docs/src/*.md (edit those). Each section (## heading) becomes one SVG in docs/assets/md/,
drawn in Netra's brand (Hanken Grotesk + Fragment Mono embedded, ink on paper, orange signal).
The published .md files are rewritten as a column of images; links stay clickable under each image
and commands stay copyable in a fold.
Usage: python docs/render.py
"""
import base64
import html
import io
import os
import re
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "src"
OUT = ROOT / "docs" / "assets" / "md"
DOCS = {  # source -> published file
    "README.md": "README.md",
    "METHODS.md": "docs/METHODS.md",
    "brand-guidelines.md": "brand/guidelines.md",
    "contracts.md": "contracts/README.md",
    "pipeline.md": "pipeline/README.md",
    "data.md": "data/README.md",
    "web.md": "web/README.md",
}
INK, PAPER, MUTED, LINE, SIGNAL, SIGNAL_TEXT, CARD, SOFT = "#121212", "#fbfaf7", "#55524c", "#e6e2da", "#e8590c", "#c2410c", "#ffffff", "#f1eee8"
W, PAD = 1280, 56
SANS, MONO = "Hanken Grotesk, Helvetica, Arial, sans-serif", "Fragment Mono, ui-monospace, monospace"


def font(name, chars):
    """The brand font cut down to the characters this image uses (keeps each SVG small)."""
    f = TTFont(ROOT / "brand" / "fonts" / name)
    sub = Subsetter(Options(flavor="woff2", layout_features=["*"]))
    sub.populate(text=chars + " ")
    sub.subset(f)
    buf = io.BytesIO()
    f.flavor = "woff2"
    f.save(buf)
    return base64.b64encode(buf.getvalue()).decode()


def fonts(chars):
    return ('<style>@font-face{font-family:"Hanken Grotesk";font-weight:400 700;src:url(data:font/woff2;base64,'
            + font("HankenGrotesk-latin.woff2", chars) + ') format("woff2")}@font-face{font-family:"Fragment Mono";src:url(data:font/woff2;base64,'
            + font("FragmentMono-latin.woff2", chars) + ') format("woff2")}</style>')

# ---------- inline markdown -> runs ----------
INLINE = re.compile(r"(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*|_[^_\s][^_]*_)")


def runs(text, links):
    """Split inline markdown into (text, style) runs; style in {"", "b", "i", "code", "link"}. Collect links."""
    out = []
    text = re.sub(r"<[^>]+>", "", text)  # stray inline HTML
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**"):
            out.append((part[2:-2], "b"))
        elif part.startswith("`"):
            out.append((part[1:-1], "code"))
        elif part.startswith("["):
            t, u = re.match(r"\[([^\]]+)\]\(([^)]+)\)", part).groups()
            links.append((re.sub(r"[*`_]", "", t), u))
            out.append((re.sub(r"[*`]", "", t), "link"))
        elif part[0] in "*_" and len(part) > 2:
            out.append((part[1:-1], "i"))
        else:
            out.append((html.unescape(part), ""))
    return out


def tw(s, size, style=""):
    """Approximate text width in px (Hanken Grotesk / Fragment Mono metrics)."""
    if style == "code":
        return len(s) * size * 0.6
    k = 0.555 if style == "b" else 0.53
    narrow = sum(1 for c in s if c in "iljtf.,:;'|!()[] ")
    wide = sum(1 for c in s if c in "mwMW@%")
    return (len(s) - narrow * 0.45 + wide * 0.45) * size * k


def wrap(rs, width, size):
    """Word-wrap runs into lines of runs."""
    lines, cur, x = [], [], 0.0
    for text, st in rs:
        for word in re.split(r"(\s+)", text):
            if not word:
                continue
            w = tw(word, size, st)
            if word.isspace():
                if cur:
                    cur.append((" ", st)); x += tw(" ", size, st)
                continue
            if x + w > width and cur:
                while cur and cur[-1][0] == " ":
                    cur.pop()
                lines.append(cur); cur, x = [], 0.0
            cur.append((word, st)); x += w
    if cur:
        lines.append(cur)
    return lines or [[("", "")]]


def tspans(line, size, color=INK):
    """SVG tspans for one wrapped line."""
    out = []
    for text, st in line:
        t = html.escape(text, quote=False)
        if st == "b":
            out.append(f'<tspan font-weight="700">{t}</tspan>')
        elif st == "i":
            out.append(f'<tspan font-style="italic">{t}</tspan>')
        elif st == "code":
            out.append(f'<tspan font-family="{MONO}" font-size="{size * .9:.1f}" fill="{SIGNAL_TEXT}">{t}</tspan>')
        elif st == "link":
            out.append(f'<tspan fill="{SIGNAL_TEXT}" text-decoration="underline">{t}</tspan>')
        else:
            out.append(t)
    return "".join(out)


# ---------- blocks ----------
class Canvas:
    def __init__(self):
        self.y, self.parts = PAD, []

    def text_block(self, rs, size=22, lh=1.6, x=PAD, width=W - 2 * PAD, color=INK, weight=400, gap=14):
        for line in wrap(rs, width, size):
            self.y += size * lh * (0.78 if not self.parts else 1)
            self.parts.append(f'<text x="{x}" y="{self.y:.0f}" font-size="{size}" font-weight="{weight}" fill="{color}">{tspans(line, size, color)}</text>')
        self.y += gap

    def heading(self, text, level, links):
        if level == 1:
            self.parts.append(f'<g transform="translate({PAD} {self.y})"><circle cx="14" cy="14" r="11.5" fill="none" stroke="{INK}" stroke-width="2.6"/>'
                              f'<path d="M14 2.5A11.5 11.5 0 0 0 14 25.5Z" fill="{SIGNAL}"/><circle cx="14" cy="14" r="4" fill="{INK}"/>'
                              f'<text x="36" y="21" font-size="20" font-weight="600" letter-spacing="-.8" fill="{INK}">netra</text></g>')
            self.y += 46
            self.text_block(runs(text, links), size=54, lh=1.15, weight=600, gap=12)
        elif level == 2:
            self.text_block(runs(text, links), size=40, lh=1.2, weight=600, gap=20)
        else:
            self.y += 6
            self.text_block(runs(text, links), size=27, lh=1.3, weight=700, gap=12)

    def bullets(self, items, links, ordered=False):
        for n, it in enumerate(items, 1):
            y0 = self.y
            mark = f'<text x="{PAD}" y="{self.y + 33:.0f}" font-size="21" font-weight="700" fill="{SIGNAL_TEXT}">{n}.</text>' if ordered else \
                f'<circle cx="{PAD + 6}" cy="{self.y + 26:.0f}" r="4.5" fill="{SIGNAL}"/>'
            self.parts.append(mark)
            start = len(self.parts)
            self.text_block(runs(it, links), size=22, x=PAD + 32, width=W - 2 * PAD - 32, gap=6)
            if start == len(self.parts):
                self.y = y0
        self.y += 10

    def table(self, rows, links):
        head, body = rows[0], rows[1:]
        n = len(head)
        cells = [[runs(c, links) for c in r] for r in [head] + body]
        x0, size, lh, pad = PAD, 19, 1.5, 16
        avail = W - 2 * PAD
        # each column at least as wide as its longest unbreakable word; the rest shared by text length
        minw = [max(tw(w, size, st if ri else "b") for ri in range(len(cells)) for t, st in cells[ri][c] for w in t.split() or [""]) + 2 * pad + 4
                for c in range(n)]
        lens = [min(max(sum(len(t) for t, _ in cells[r][c]) for r in range(len(cells))), 60) for c in range(n)]
        spare = max(avail - sum(minw), 0)
        cw = [m + spare * l / sum(lens) for m, l in zip(minw, lens)]
        cw = [w * avail / sum(cw) for w in cw]
        top = self.y
        out = []
        for ri, r in enumerate(cells):
            wrapped = [wrap(r[c], cw[c] - 2 * pad, size) for c in range(n)]
            h = max(len(w) for w in wrapped) * size * lh + 2 * pad - 4
            fill = INK if ri == 0 else (CARD if ri % 2 else "#faf8f4")
            out.append(f'<rect x="{x0}" y="{self.y:.0f}" width="{avail}" height="{h:.0f}" fill="{fill}"/>')
            x = x0
            for c in range(n):
                yy = self.y + pad + size
                for line in wrapped[c]:
                    color = PAPER if ri == 0 else INK
                    weight = 700 if ri == 0 or c == 0 else 400
                    out.append(f'<text x="{x + pad:.0f}" y="{yy:.0f}" font-size="{size}" font-weight="{weight}" fill="{color}">{tspans(line, size, color)}</text>')
                    yy += size * lh
                x += cw[c]
            self.y += h
        self.parts.append(f'<clipPath id="t{top:.0f}"><rect x="{x0}" y="{top:.0f}" width="{avail}" height="{self.y - top:.0f}" rx="14"/></clipPath>'
                          f'<g clip-path="url(#t{top:.0f})">{"".join(out)}</g>'
                          f'<rect x="{x0}" y="{top:.0f}" width="{avail}" height="{self.y - top:.0f}" rx="14" fill="none" stroke="{LINE}"/>')
        self.y += 22

    def code(self, lines):
        size, lh = 18, 1.6
        top = self.y
        maxc = int((W - 2 * PAD - 56) / (size * 0.64))
        shown = []
        for l in lines:
            m = re.match(r"^(.*?\S)(\s+#.*)$", l)
            if m and len(l) > maxc:  # long line: its comment goes on its own line above
                shown.append(re.match(r"^\s*", l).group(0) + m.group(2).strip())
                l = m.group(1)
            while len(l) > maxc:  # still long: break at the last space
                cut = l.rfind(" ", 0, maxc)
                cut = cut if cut > maxc // 2 else maxc
                shown.append(l[:cut]); l = "    " + l[cut:].lstrip()
            shown.append(l)
        h = len(shown) * size * lh + 36
        self.parts.append(f'<rect x="{PAD}" y="{top:.0f}" width="{W - 2 * PAD}" height="{h:.0f}" rx="14" fill="{INK}"/>')
        y = top + 18 + size
        for l in shown:
            m = re.match(r"^(.*?)(\s+#.*)?$", l)
            cmd, comment = m.group(1), m.group(2) or ""
            if cmd.lstrip().startswith("#"):
                cmd, comment = "", cmd
            self.parts.append(f'<text x="{PAD + 24}" y="{y:.0f}" font-family="{MONO}" font-size="{size}" fill="{PAPER}" xml:space="preserve">'
                              f'{html.escape(cmd, quote=False)}<tspan fill="#a8a39a">{html.escape(comment, quote=False)}</tspan></text>')
            y += size * lh
        self.y += h + 22

    def svg(self, label):
        h = self.y + PAD - 22
        chars = "".join(sorted(set(html.unescape("".join(re.findall(r">([^<]+)<", "".join(self.parts)))))))
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h:.0f}" width="{W}" height="{h:.0f}" role="img" aria-label="{html.escape(label)}">'
                + fonts(chars) + f'<rect width="{W}" height="{h:.0f}" rx="24" fill="{PAPER}"/><rect x=".5" y=".5" width="{W - 1}" height="{h - 1:.0f}" rx="24" fill="none" stroke="{LINE}"/>'
                + f'<g font-family="{SANS}">' + "".join(self.parts) + "</g></svg>")


# ---------- document ----------
def sections(md):
    """Yield ("sec", [lines]) per ## section and ("img", line) for diagrams; a section's diagrams follow its text."""
    cur, imgs = [], []
    for line in md.splitlines():
        if line.strip().startswith('<p align="center"><img'):
            if any(l.strip() for l in cur):
                imgs.append(line)
            else:
                yield "img", line
            continue
        if line.startswith("## ") and any(l.strip() for l in cur):
            yield "sec", cur
            for im in imgs:
                yield "img", im
            cur, imgs = [], []
        if line.strip() == "---":
            continue
        cur.append(line)
    if any(l.strip() for l in cur):
        yield "sec", cur
    for im in imgs:
        yield "img", im


def render_section(lines):
    c, links, code_blocks, title, plain = Canvas(), [], [], "", []
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s or s.startswith("<p align=\"center\"><a") or s.startswith("<!--"):
            if s.startswith("<p align=\"center\"><a"):  # nav line of links
                for t, u in re.findall(r'<a href="([^"]+)">(?:<b>)?([^<]+)', s):
                    links.append((u, t))
                links[:] = [(b, a) if a.startswith(("http", ".", "d", "b", "c", "p", "w")) and not b.startswith(("http", ".")) else (a, b) for a, b in links]
            i += 1
            continue
        if s.startswith("```"):
            j = i + 1
            block = []
            while j < len(lines) and not lines[j].strip().startswith("```"):
                block.append(lines[j]); j += 1
            c.code(block); code_blocks.append(block); i = j + 1
            continue
        m = re.match(r"^(#{1,3}) (.*)", s)
        if m:
            title = title or re.sub(r"[*`]", "", m.group(2))
            c.heading(m.group(2), len(m.group(1)), links); i += 1
            continue
        if s.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                r = [x.strip().replace("\\|", "|") for x in re.split(r"(?<!\\)\|", lines[i].strip().strip("|"))]
                if not all(re.fullmatch(r":?-{3,}:?", x) for x in r):
                    rows.append(r)
                i += 1
            c.table(rows, links); plain.append(" ".join(" ".join(r) for r in rows[:3]))
            continue
        if re.match(r"^(\d+\.|[-*]) ", s):
            ordered = bool(re.match(r"^\d+\.", s))
            items = []
            while i < len(lines) and (re.match(r"^\s*(\d+\.|[-*]) ", lines[i]) or (lines[i].startswith("   ") and lines[i].strip())):
                t = lines[i].strip()
                if re.match(r"^(\d+\.|[-*]) ", t):
                    items.append(re.sub(r"^(\d+\.|[-*]) ", "", t))
                else:
                    items[-1] += " " + t
                i += 1
            c.bullets(items, links, ordered); plain.extend(items)
            continue
        if s.startswith(">"):
            c.text_block(runs(s.lstrip("> "), links), size=22, color=MUTED); i += 1
            continue
        para = [s]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|\d+\. |[-*] |<p )", lines[i].strip()):
            para.append(lines[i].strip()); i += 1
        c.text_block(runs(" ".join(para), links)); plain.append(" ".join(para))
    if not c.parts:
        return "", title, "", links, code_blocks
    alt = (title + ": " if title else "") + re.sub(r"[*`]", "", re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", " ".join(plain)))
    alt = "".join(ch for ch in alt if ch >= " ")
    return c.svg(alt[:300]), title, alt[:600], links, code_blocks


def build(src, dst):
    md = (SRC / src).read_text(encoding="utf-8")
    dst_path = ROOT / dst
    rel = os.path.relpath(OUT, dst_path.parent).replace("\\", "/")
    stem = Path(src).stem.lower()
    out, n = [f"<!-- Generated by docs/render.py from docs/src/{src}. Edit the source, then run: python docs/render.py -->", ""], 0
    for kind, val in sections(md):
        if kind == "img":
            out += [val, ""]
            continue
        svg, title, alt, links, code = render_section(val)
        if not svg:  # a section that holds only links: keep them as text
            out += [f'<p align="center">{" · ".join(f"<a href=\"{u}\">{html.escape(t)}</a>" for t, u in links)}</p>', ""]
            continue
        n += 1
        name = f"{stem}-{n:02d}.svg"
        (OUT / name).write_text(svg, encoding="utf-8")
        anchor = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        out.append(f'<a id="{anchor}"></a>' if anchor else "")
        out.append(f'<p align="center"><img src="{rel}/{name}" alt="{html.escape(alt, quote=True)}" width="100%"></p>')
        seen, ls = set(), []
        for t, u in links:
            if u not in seen:
                seen.add(u); ls.append(f'<a href="{u}">{html.escape(t)}</a>')
        if ls:
            out.append(f'<p align="center"><sub>{" · ".join(ls)}</sub></p>')
        for block in code:
            out += ["<details><summary>Copy the commands</summary>", "", "```bash", *block, "```", "", "</details>"]
        out.append("")
    dst_path.write_text("\n".join(out), encoding="utf-8")
    return n


if __name__ == "__main__":
    assert tw("abc", 10) > 0 and len(wrap([("one two three four", "")], 40, 10)) > 1
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.svg"):
        old.unlink()
    for s, d in DOCS.items():
        print(d, build(s, d), "sections")
