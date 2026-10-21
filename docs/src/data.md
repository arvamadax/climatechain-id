<p align="center"><img src="../docs/assets/emissions.svg" alt="Emissions from two sources, side by side" width="100%"></p>

# data · reviewed inputs

Everything here was checked by hand. Raw downloads (registry spreadsheets, Climate TRACE packages, company PDFs) are kept locally in `raw/` and are not committed.

## Files

| File | Rows | What it holds |
|---|---|---|
| `buyers.csv` | 167 | The largest buyer names as written in the registry, with their company group, type (company, intermediary, wallet, anonymous, unidentified, public body, tokenization), Climate TRACE parent and a note. |
| `reported_emissions.csv` | 79 | One row per company group: year, Scope 1, total, boundary, the report's title and URL, the section the figure is in, and the date it was checked. Only primary documents. |
| `emissions_gaps.csv` | 15 | For every company group without a reported figure: why there is none, and what was checked (documents, sites, searches, date). |
| `logos.csv` | 94 | Official website domain per company group, used to fetch its logo. Blank when no domain could be verified. |
| `icvcm_status.json` | 174 | ICVCM Core Carbon Principles status per methodology, snapshot 18 Aug 2026. |
| `classification_review.csv` | 234 | Projects where the three type signals disagree, so no estimate is applied. Written by `pipeline/build.py`. |
| `name_suggestions_review.csv` | 91 | Possible group matches for unreviewed names, waiting for a manual check. Never used on the site. |
| `serials/*.json` | 6 | Registry serial ranges for the buyers published on-chain in the demo. |

<p align="center"><img src="../docs/assets/hidden-buyers.svg" alt="Hidden buyers" width="100%"></p>

## How a figure gets in

1. Find the company's own document (annual report, sustainability statement, auditor's statement, data book).
2. Read the table; when PDF text extraction is ambiguous, check the rendered page or the report's own totals.
3. Append with `pipeline/add_reported.py`, including boundary, URL and section.
4. If nothing usable exists, write the reason and what was checked in `emissions_gaps.csv`. A blank is never shown on the site.

Aggregators (Tracenable, DitchCarbon) and AI summaries are never used as sources.
