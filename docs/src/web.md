<p align="center"><img src="../docs/assets/architecture.svg" alt="Architecture" width="100%"></p>

# web · the Netra site

A static site: HTML, CSS and plain JavaScript. No backend, no build step, no accounts, no tracking. Live at **https://netra.rofihosted.space**.

## Pages

| Page | File | What it shows |
|---|---|---|
| Check | `index.html` + `app.js` | Search any of 44,465 buyers; grade, plain sentence, claimed-vs-real bar, research breakdown, emissions, "How we know", on-chain status. Also the market overview, Hidden buyers and on-chain proof. |
| Data | `data.html` + `data.js` | All 94 company groups in one sortable table, compare up to three, project types, years, branded downloads. |
| About | `about.html` | The problem, how it works, the story, why "Netra", research library, sources, limits. |
| Glossary | `glossary.html` | Every term in plain English with a real example. |

Shared: `common.js` (formatting, grades, logos, theme switch, reveal motion), `style.css` (brand tokens, light and dark themes), `favicon.svg`.

## Generated folders

| Folder | Written by | Holds |
|---|---|---|
| `data/` | `pipeline/build.py`, `summaries.py`, `logos.py` | `index.json` (search), `o/*.json` (500 buyers per shard), `owners.json` (all), `companies.json`, `hidden.json`, `factors.json`, `logos.json`, `deployment.json` |
| `logos/` | `pipeline/logos.py` | One PNG per company group |
| `downloads/` | `pipeline/exports.py` | Branded Excel, CSV, JSON and README |

## Run locally

```bash
python -m http.server 8000      # from this folder, then open http://localhost:8000
```

## Accessibility and design

- Light by default; dark only when chosen (remembered per device).
- Text contrast meets WCAG AA; grades always print their letter, so they read without colour.
- Keyboard focus is always visible; motion turns off for people who ask for less motion.
- Brand rules: [brand/guidelines.md](../brand/guidelines.md).
