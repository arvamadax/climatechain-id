<p align="center"><img src="docs/assets/banner.svg" alt="Netra: see what a carbon claim is really worth" width="100%"></p>

<p align="center"><a href="https://netra.rofihosted.space"><b>Open Netra</b></a> · <a href="docs/METHODS.md">Method</a> · <a href="brand/guidelines.md">Brand</a> · IEEE ClimateChain Global Hackathon 2026, Track 1</p>

---

## Contents

- [What it does](#what-it-does)
- [Key findings](#key-findings)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Rebuilding the data](#rebuilding-the-data)
- [Smart contract](#smart-contract)
- [Data sources and licences](#data-sources-and-licences)
- [Limitations](#limitations)
- [License](#license)

## What it does

| Question | How Netra answers it |
|---|---|
| What did a company retire? | Every Verra and Gold Standard retirement since 2020 (342,012 records, 876 Mt), grouped by the beneficiary and, for the largest buyers, by company group. |
| How much of it is likely real? | Tonnes × the share of real reductions that research found for that project type (Probst et al. 2024), with the published range and a grade from A to E. |
| What does the company emit? | Its own reported figure, read from its primary report (79 company groups, 94.3% of company tonnes), next to Climate TRACE's independent ownership-weighted estimate. |
| Who is hiding? | Anonymous, "Not Disclosed", reseller, wallet and untraceable accounts, labelled and quantified. |
| Can the check be trusted later? | A hash of each published check and a Merkle root of its registry serial ranges are written to the `ClaimRegistry` contract. A serial range claimed twice can be flagged on-chain by anyone. |

<p align="center"><img src="docs/assets/how-it-works.svg" alt="How Netra works in six steps" width="100%"></p>

<p align="center"><img src="docs/assets/grades.svg" alt="Grade scale A to E" width="100%"></p>

The web app has five views: **Check** (search a company or paste a claim, company result, and the live registry check), **Hidden buyers**, **Data** (all company groups, sortable, with side-by-side comparison and downloads), **About** (story, research, sources, limits) and **Glossary** (every term in plain English).

## AI and live features

| Feature | What it does | Safeguard |
|---|---|---|
| Claim checker (language model) | Reads a pasted green claim and pulls out who claims what, the scope, the year and the tonnes, each with a word-for-word quote, then shows the claim against the registry record above the full company result | A field is kept only if its quote is in the pasted text; every number shown comes from Netra's data, never from the model; 10 checks per hour; no text stored; one retry, then a plain fallback to name search |
| Unusual patterns (Isolation Forest) | Finds the few large buyers (8 of 540) whose mix of old vintages, rejected methodologies, unresearched types, one-year bursts, low likely-real share and batch size stands out | Each flag lists readable reasons; labelled "a reason to look closer, not proof"; rule and threshold published |
| Live registry check | Every 10 minutes the server reads the 200 newest retirements from Verra's public registry and scores each with Netra's rules: research share likely real by project type, ICVCM label, who the benefit is claimed for, and a link when the beneficiary is a reviewed company | Same project categories as the snapshot (`web/data/projects.json`); a project not in the snapshot gets no estimate; Live / Reconnecting indicator; Gold Standard not included live |
| Live on-chain feed | The site polls ClaimRegistry every 15 s; new checks and double-claim flags appear without a reload | Three public RPC nodes tried in order; Live / Reconnecting indicator |
| Always-on watcher | A server process reads every new check, verifies its serial list against the on-chain root and challenges any reused serial range | The contract verifies both Merkle proofs itself, so a wrong challenge fails; stops below 0.05 test ETH; testnet-only key, never in git |
| Name suggestions (internal) | Character n-gram TF-IDF proposes which reviewed company an unreviewed registry name belongs to | Not shown on the site: about one in five suggestions on real names was wrong, so each is checked by hand first (`data/name_suggestions_review.csv`) |

Each company result also shows the cost per likely-real tonne at the 2024 market average of $6.34 per credit (Ecosystem Marketplace, State of the Voluntary Carbon Market 2025, p. 10); what each buyer actually paid is not public.

Tested live on Sepolia: a demo duplicate (check #7) reusing five of Shell's serial ranges was flagged by the watcher about ten seconds after it read the check.

## Key findings

<p align="center"><img src="docs/assets/key-findings.svg" alt="Key findings" width="100%"></p>

- About **1 in 5** researched tonnes retired since 2020 is likely a real reduction (19.4%, range 2.4–68.8%), with no improvement from year to year (18–22%).
- **57%** of retired tonnes cannot be tied to a named claimant; 40.9% have no beneficiary at all.
- Only **4.5%** of retired tonnes use a methodology with the ICVCM Core Carbon Principles label.
- Company-reported and independent emissions differ by a factor of **2–3** for large emitters.

## Architecture

<p align="center"><img src="docs/assets/architecture.svg" alt="Architecture: sources, pipeline, static web app, ClaimRegistry contract" width="100%"></p>

The site is fully static: no backend, no accounts, no tracking. All data is pre-computed into JSON under `web/data/`.

## Repository layout

<p align="center"><img src="docs/assets/repo-map.svg" alt="Repository map" width="100%"></p>

```
.
├── brand/            Brand guidelines, tokens and font            → brand/guidelines.md
├── contracts/        ClaimRegistry smart contract (Hardhat)         → contracts/README.md
├── data/             Reviewed inputs                              → data/README.md
├── docs/             METHODS.md and visuals                       → docs/METHODS.md
├── pipeline/         Python scripts that build the web data         → pipeline/README.md
└── web/              Static site and its generated data             → web/README.md
```

Raw downloads (registry spreadsheets, Climate TRACE packages, company PDFs) are kept locally in `raw/`, which is not committed.

## Getting started

Requirements: Python 3.11+, Node.js 18–22.

```bash
# Run the web app
cd web && python -m http.server 8000      # open http://localhost:8000

# Test the contract
cd contracts && npm install && npx hardhat test

# Full on-chain demo on a local chain (no tokens needed)
npm run node            # terminal 1
npm run demo:local      # terminal 2: deploys, publishes six real buyer checks, flags a simulated double claim
```

## Rebuilding the data

```bash
pip install pandas openpyxl pyarrow
python pipeline/ownership.py raw/climate-trace/data 2025       # independent emissions per owner
python pipeline/build.py \
  raw/vrod-pack/<pack>/datasets/Berkeley_VROD_registry_files_2026-08.xlsx \
  raw/vrod-pack/<pack>/datasets/Berkeley_Voluntary_Registry_Offsets_Database_v2026-08.xlsx \
  raw/offsetsdb/projects.parquet                                # main dataset, with built-in checks
python pipeline/summaries.py                                    # hidden-buyer and company summaries
python pipeline/logos.py                                        # company logos and brand colours
python pipeline/exports.py                                      # branded downloads (Excel, CSV, JSON)
python brand/embed_font.py                                      # embed the brand font in docs/assets/*.svg
```

Reviewed inputs live in `data/`: `emissions_gaps.csv` (for every company group without a reported figure: what was checked and why no figure is shown), `logos.csv` (official domain per group), `buyers.csv` (written by `pipeline/curate_buyers.py`), `reported_emissions.csv` (one row per company group, with source URL and section; append with `pipeline/add_reported.py`) and `serials/` (written by `pipeline/serials.py`).

## Smart contract

<p align="center"><img src="docs/assets/contract.svg" alt="ClaimRegistry" width="100%"></p>

`contracts/src/ClaimRegistry.sol` (Solidity 0.8.24, OpenZeppelin MerkleProof):

| Function | Purpose |
|---|---|
| `recordRoot` | Publish a check: subject, report hash, report URI and the Merkle root of its serial-range nullifiers. Constant gas whatever the serial count (measured on Sepolia: 589,915 for Shell's 684 ranges, 589,903 for easyJet's 10). |
| `record` | Publish a check with explicit nullifiers; rejects any nullifier already claimed. |
| `challenge` | Prove with two Merkle proofs that one serial range backs two checks; the later check is flagged permanently. |

```bash
npm run demo:sepolia        # publish to Ethereum Sepolia (needs PRIVATE_KEY in .env and test ETH)
npm run demo:base-sepolia   # alternative public testnet
```

Network settings live in `contracts/scripts/chains.js`; the web app reads the active deployment from `web/data/deployment.json`.

## Data sources and licences

| Source | Use | Licence or version |
|---|---|---|
| Berkeley Carbon Trading Project, Voluntary Registry Offsets Database | Retirements, project types | v2026-08, CC BY 4.0 |
| CarbonPlan OffsetsDB | Second project-type signal | 2026 snapshot |
| ICVCM assessment status | CCP labels per methodology | Snapshot 18 Aug 2026 |
| Probst et al. 2024, *Nature Communications*, doi:10.1038/s41467-024-53645-z | Outcome achievement ratios and ranges | Published supplementary data |
| Climate TRACE | Independent emissions by owner | v5.7.0, 2025 |
| Company annual and sustainability reports | Reported emissions | Linked per row in `data/reported_emissions.csv` |

## Limitations

Research ratios are averages per project type, not verdicts on individual projects or companies. Project types without a published ratio (62% of tonnes) are not scored. Registry beneficiaries can be resellers or brands rather than the claimant. Company-reported and independent emissions use different boundaries and are never merged. Full detail: [docs/METHODS.md](docs/METHODS.md).

## Roadmap

| Next | Why it waits |
|---|---|
| Daily on-chain root of the live registry check | The watcher already writes to ClaimRegistry; a daily summary root would make the live feed tamper-evident too |
| Gold Standard in the live check | Its public registry needs its own reader |
| Report reader: a language model proposes Scope 1 figures with page and table row from company PDFs, a person confirms | Speeds up coverage; every figure must still be checked against the rendered page |
| Name suggestions on the site | About one in five suggestions on real names was wrong; published only after manual review |
| More registries (ACR, CAR, ART, national registries) | Same three-signal rules need their project types |
| Plant-level EU ETS data for utilities without a group report | Read from the EU registry, linked per plant |

## License

Company logos are trademarks of their owners and are shown only to identify each company. Hanken Grotesk is used under the SIL Open Font License (`brand/fonts/OFL.txt`).


Code: [MIT](LICENSE). Data derived from Berkeley VROD is shared under CC BY 4.0 with attribution to the Berkeley Carbon Trading Project.
