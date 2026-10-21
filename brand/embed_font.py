"""Embed Hanken Grotesk (brand/fonts, SIL Open Font License) into every docs/assets/*.svg.
GitHub shows SVGs as images, which cannot load web fonts; an embedded font keeps the brand type.
Idempotent: replaces the embedded block if it is already there.
Usage: python brand/embed_font.py
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONT = base64.b64encode((ROOT / "brand" / "fonts" / "HankenGrotesk-latin.woff2").read_bytes()).decode()
BLOCK = ('<style id="netra-font">@font-face{font-family:"Hanken Grotesk";font-weight:400 700;'
         f'src:url(data:font/woff2;base64,{FONT}) format("woff2")}}</style>')

for svg in sorted((ROOT / "docs" / "assets").glob("*.svg")):
    s = svg.read_text(encoding="utf-8")
    s = re.sub(r'<style id="netra-font">.*?</style>', "", s, flags=re.S)
    s = re.sub(r"(<svg[^>]*>)", r"\1" + BLOCK.replace("\\", "\\\\"), s, count=1)
    assert s.count('id="netra-font"') == 1, svg
    svg.write_text(s, encoding="utf-8")
    print(svg.name, f"{len(s) // 1024} KB")
