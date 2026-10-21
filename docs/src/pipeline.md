<p align="center"><img src="../docs/assets/three-signals.svg" alt="Three-signal classification" width="100%"></p>

# pipeline · from raw sources to web data

Python scripts that turn public spreadsheets and reports into the small JSON files the web app reads. Every script ends with built-in checks (`assert`) and stops if a number does not add up.

<p align="center"><img src="../docs/assets/how-it-works.svg" alt="How Netra works in six steps" width="100%"></p>

## Order to run

| Step | Script | Reads | Writes |
|---|---|---|---|
| 1 | `ownership.py <climate-trace dir> 2025` | Climate TRACE ownership packages | `web/data/ct_owners.json` |
| 2 | `build.py <registry xlsx> <database xlsx> <projects.parquet>` | Berkeley VROD, CarbonPlan OffsetsDB, `data/*` | `web/data/owners.json`, `index.json`, `o/*.json`, `factors.json`, `data/classification_review.csv` |
| 3 | `summaries.py` | `owners.json`, `data/emissions_gaps.csv` | `web/data/hidden.json`, `companies.json` |
| 4 | `logos.py` | `data/logos.csv` | `web/logos/*.png`, `web/data/logos.json` |
| 5 | `anomalies.py` | `owners.json` | `web/data/anomalies.json` (Isolation Forest flags with reasons) |
| 6 | `exports.py` | the files above, `data/reported_emissions.csv` | `web/downloads/*` (Excel, CSV, JSON, README) |

Helpers, run when needed:

| Script | Purpose |
|---|---|
| `curate_buyers.py` | Writes `data/buyers.csv`: the reviewed group, type and Climate TRACE parent of the largest buyer names |
| `add_reported.py "group\|year\|scope1\|total\|boundary\|title\|url\|section"` | Appends a company-reported emissions row after it was read from the primary document |
| `name_suggest.py` | Internal review list of possible group matches for unreviewed names (`data/name_suggestions_review.csv`); never published |
| `serials.py <registry xlsx> "<buyer>" <out.json>` | Extracts one buyer's registry serial ranges for the on-chain demo |

```bash
pip install pandas openpyxl pyarrow pillow
```

## Rules the pipeline enforces

| Rule | Where |
|---|---|
| A project type counts only when Berkeley, CarbonPlan and the methodology code agree | `build.py` (`category`, `resolve`) |
| No research estimate for types without a published ratio; never filled in | `build.py` (`FACTORS`) |
| Ownership shares summed per path and capped at 100%; unknown shares give a range, not a guess | `ownership.py` |
| Every company group has either a reported figure or a written reason | `summaries.py` (assert) |
| Category, CCP and ownership totals reconcile with the market totals | `build.py` (`__main__` checks) |

Full rules and validation: [docs/METHODS.md](../docs/METHODS.md).
