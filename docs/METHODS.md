# Netra methods

Netra estimates how much of a company's retired carbon credits likely represent real emission reductions. It is a risk estimate based on average research findings per project type, not a verdict on any single project or company.

## Data

- **Retirements:** Berkeley Voluntary Registry Offsets Database (VROD) v2026-08, registry files for Verra (VCS) and Gold Standard, retirements from 2020-01-01. 342,012 rows, 876.05 million tCO2e. License: CC BY 4.0.
- **Owner:** Verra `Beneficial Owner` and Gold Standard `Using Entity`, normalized (lowercase, punctuation and legal suffixes removed). 59.6% of retired tonnes name an owner. Blank and "Not Applicable" entries are grouped as "(no owner listed)".
- **ICVCM status:** snapshot of https://icvcm.org/assessment-status/ (page modified 2026-08-18, retrieved 2026-10-20), 174 methodology rows, stored in `data/icvcm_status.json`.

## Outcome Achievement Ratio (OAR)

OAR = share of issued credits that research estimates to be real reductions. Source: Probst et al. 2024, *Nature Communications*, doi:10.1038/s41467-024-53645-z (2,346 projects, about 1 billion tCO2e). Ranges are the paper's central estimate minus and plus the weighted variance, from the Figure 4a source data (Supplementary Data 6), clipped to 0-100%.

| Category | Central | Range | Notes |
|---|---|---|---|
| Avoided deforestation (REDD+) | 24.7% | 0-96.7% | Wide range; see also West et al. 2023, *Science*, doi:10.1126/science.ade3535 |
| Cookstoves | 10.8% | 10.5-11.1% | Consistent with Gill-Wiehl et al. 2024, *Nature Sustainability*, doi:10.1038/s41893-023-01259-6 (9.2x over-crediting) |
| HFC-23 destruction | 68.3% | 65.6-70.9% | |
| SF6 destruction | 16.4% | 14.6-18.1% | |
| Wind power, China | 0% | 0% | No statistically significant reductions; paper sets 0% |
| Improved forest management, US | 0% | 0% | No statistically significant reductions; paper sets 0% |
| Other grid renewables, all other types | none | none | No published estimate; shown as "limited evidence" and never scored better than D |

## Classification rules (three independent signals)

Every project gets a category only when independent sources agree. Any disagreement gets **no OAR**, so a dispute can only lower a company's estimated real tonnes, never raise it.

1. **Berkeley VROD curated project Type** (PROJECTS sheet, 11,856 projects), joined by project ID (Verra `VCS<id>`, Gold Standard `GS<GSID>`). Join rate: 100% of rows and tonnes.
2. **CarbonPlan OffsetsDB project_type** (independent classification, parquet release; covers 78.2% of retired tonnes with a known type).
3. **Registry methodology code** (REDD+: VM0004/6/7/9/15/37/48; biomass cookstoves: VMR0006, AMS-II.G, VM0050, TPDDTEC, improved-cookstove and metered GS methodologies; grid renewables: ACM0002, AMS-I.D, AMS-I.F, VMR0017).

Type to OAR category: `REDD+` -> REDD+; `Cookstoves` -> cookstoves, except solar cookers, coal-ignition, LPG and stove-plus-water projects (Probst's cookstove studies cover biomass cookstoves only); `HFC23 Destruction` -> HFC-23; `Improved Forest Management` -> US IFM only in the US; `Wind` in China -> China wind; other wind, hydro, solar, geothermal, RE bundled, biomass -> renewables (no OAR); everything else -> no OAR. VROD's `SF6 Replacement` is not SF6 destruction and gets no OAR.

Result on VROD v2026-08 (since 2020): 234 projects (6.15% of tonnes) have at least one disagreeing signal; all are set to no OAR and listed in `data/classification_review.csv`. None of these disputes removed an OAR that Berkeley's type would have given; they are projects Berkeley already places outside the OAR categories while another signal points to one. The largest are Katingan (VCS1477) and Sumatra Merang (VCS1899): REDD+ according to OffsetsDB and the VM0007 code, Wetland Restoration according to Berkeley. Neither is in Probst's REDD+ sample (Latin America, Africa, Cambodia), so no OAR is applied. Automated checks live in the `__main__` block of `data/build.py`.

## ICVCM status

Each methodology string is matched to the ICVCM table by code and version range: `approved` (CCP-Approved, including conditional), `not_approved` ("Does not meet"), or `not_assessed` (not listed, under assessment, or version outside an assessed range). Examples: ACM0002 and AMS-I.D do not meet; GS TPDDTEC v2.0-3.1, VM0050, VM0048 and the GS metered methodology v1.0-1.2 are approved; legacy REDD+ methodologies VM0007, VM0009 and VM0015 are not listed.

Share of retired tonnes since 2020: approved 4.5%, not approved 35.9%, not assessed 59.6%.

## Headline numbers (VROD v2026-08, Verra + Gold, since 2020)

- Tonnes with a published OAR: 37.8%.
- Of those, likely real: 19.4% central (range 2.4-68.8%, driven mainly by REDD+ uncertainty).
- Largest single owner entry: "Not Disclosed", 89.4 million t.

## Known limits

- OAR values are averages per project type; individual projects vary widely.
- Categories without a published OAR (34.8% renewables, 26.8% other) cannot be scored and are reported separately.
- Owner names in registries do not always match the company making a claim (brokers, subsidiaries, brands).

## Past, present, future

- **Past to present:** per-owner and market-wide yearly series (2020-2026). Market-wide, the likely-real share of OAR-covered tonnes stayed flat at 18-22% every year (2020: 18.7%, 2021: 22.4%, 2022: 18.0%, 2023: 20.2%, 2024: 18.0%, 2025: 17.9%, 2026 to Aug: 18.0%). Quality of what is retired has not improved.
- **Present:** each owner's current mix, grade, ICVCM status share, and owner disclosure.
- **Future:** forward-looking flags already in the data: share of tonnes from methodologies ICVCM says do not meet the CCPs; ACM0002 and AMS-I.D will be inactivated as standalone methodologies in the VCS Program on 1 January 2027, and new registrations must apply VMR0017 (verified on Verra's VMR0017 page; VMR0017 active since 23 April 2026, CCP-approved); EU Directive 2024/825 bans offset-based product neutrality claims from 27 September 2026.

## Buyer names

Registry beneficiary names are shown as published, with two repairs (`clean_owner` in `data/build.py`): 4,560 names exported with Mac Roman mojibake (e.g. "Societ√† Benefit") are decoded back to UTF-8 ("Società Benefit"), and statements such as "Retired on behalf of easyJet for aviation emissions period ..." are reduced to the named party ("easyJet"). Names are then normalized (case, punctuation, legal suffixes) to group retirements. Result: 44,546 buyers.

## Independent emissions (Climate TRACE)

- **Source:** Climate TRACE Emissions Inventory v5.7.0 (CC BY 4.0, https://zenodo.org/records/20830133), sector packages for fossil fuel operations, power, manufacturing and mineral extraction, gas `co2e_100yr`, year 2025, monthly source-level emissions summed per asset.
- **Ownership:** the packages' `*_emissions_sources_ownership_*.csv` files give each parent's `overall_share_percent` per asset (the public API lists owners without shares, so it is not used for attribution).
- **Attribution (`data/ownership.py`):** parent emissions = sum of asset emissions x known share. A parent holding one asset through several paths has its shares summed (capped at 100%). Where a share is unknown, the low value excludes the asset and the high value includes all of it: a range, never a guess. 12,120 parents; 10,371 are not controlled (>50%) by another real entity (pseudo-holders such as "small shareholder(s)" are ignored).
- **Matching buyers to parents:** only through the reviewed table `data/aliases.csv` (12 buyer names to 8 parents so far). Each row states how the buyer relates to the parent and whether Climate TRACE's ownership sectors cover the group's main emissions (`core`) or not (`partial`, e.g. Volkswagen vehicle production, Delta flights). Partial matches carry a visible warning.
- **Not comparable to self-reported scope 1.** Climate TRACE equity-share estimates differ from company reports by a factor of two or more in both directions. Spot checks (company figures from secondary sources, still to be confirmed against primary reports): Shell 123-151 Mt (CT 2025) vs about 50 Mt reported scope 1 (2024, Reuters); Holcim 35-45 Mt vs about 71 Mt (2024, Tracenable/DitchCarbon); ENGIE 32-39 Mt vs about 22 Mt (2024, Tracenable, ENGIE SASB disclosure). Netra therefore shows the independent figure with its basis and never computes a single "coverage" ratio from it.

## Buyer classification

`data/buyers.csv` (generated by `data/curate_buyers.py`, every row reviewed against registry retirement details) classifies the 167 largest buyer names, which cover the top 160 entries by retired tonnes plus known subsidiaries of linked groups. Each name gets a group, a type and, where relevant, a Climate TRACE parent:
- **company** (118 names, 94 groups), **intermediary** (offset providers or carbon tax offset accounts retiring for clients, e.g. 4AIR, Pangolin, Ecologi, South African COAS accounts), **wallet** (crypto addresses; tokenized credits), **tokenization** (Moss.Earth), **anonymous** ("Not Disclosed", "Anonymous", blank), **unidentified** (codes such as "DL", "GP-2"; not guessed, e.g. "DL" is not assumed to be Delta), **public_body**.
- Several registry spellings map to one group (e.g. DPD Group, DPDgroup, Geopost; Delta Air Lines and the registry typo "Delta Air Lies"; Volkswagen brands, Audi, Skoda and SEAT under Volkswagen AG).
- Registry names are kept as published; the group is shown next to them. Holcim (Australia) is not linked to Holcim AG because ownership at the time of retirement was not verified.

## Company-reported emissions

`data/reported_emissions.csv` holds figures read by hand from each company's own primary document (annual report, sustainability statement, assurance statement, SASB or ESG data page), one row per group, with boundary, URL, section and date checked. Figures that were only available from aggregators (Tracenable, DitchCarbon) or AI-extracted summaries were **not** used. Rows are shown next to, never merged with, the Climate TRACE estimate. 24 company groups are covered, together 68% of the tonnes retired by classified companies; the remaining groups are listed as pending in the project status note.

| Group | Year | Scope 1 | Reported total | Boundary / source |
|---|---|---|---|---|
| Shell plc | 2025 | 46.000 Mt | - | Scope 1 gross, operational control; Shell plc Annual Report and Accounts 2025 |
| Eni SpA | 2025 | 28.400 Mt | - | Scope 1, ESRS consolidated boundary (100% operated basis: 18.6 Mt); Eni Annual Report 2025 Sustainability Statement |
| Chevron Corp | 2025 | 52.000 Mt | - | Scope 1, equity share (operational control: 55 Mt); DNV assurance statement on Chevron 2025 GHG data (DNV-2026-ASR-863200-1) |
| Volkswagen AG | 2025 | 2.700 Mt | - | Scope 1, Volkswagen Group and companies with operational control; Volkswagen Group Annual Report 2025 - Climate change |
| Delta Air Lines Inc | 2025 | 39.302 Mt | - | Scope 1 total (mainline jet fuel, SAF, subsidiaries, other); 2025 Delta Difference Report - GHG Emissions Data |
| easyJet plc | 2025 | 8.702 Mt | - | Scope 1, financial year 1 Oct 2024 - 30 Sep 2025; easyJet plc Environmental Disclosures ESG Factsheet (FY2025) |
| Netflix, Inc. | 2025 | 0.038 Mt | 1.092 Mt | Scope 1; total = target-based Scopes 1-3; 2025 Netflix Environmental Social Governance Report |
| Holcim AG | 2025 | 52.500 Mt | - | Scope 1, sum of calcination 32.6 Mt, fuel combustion 15.7 Mt, other operations 4.2 Mt (57.1% of footprint); Holcim 2025 Sustainability Statement |
| ENGIE SA | 2024 | 21.948 Mt | - | Total direct GHG emissions, Scope 1; ENGIE SASB Disclosure 2024-2023-2022 |
| PetroChina Co Ltd | 2024 | 122.760 Mt | 170.460 Mt | Scope 1; total = Scope 1 + 2, operational boundary; PetroChina 2024 Environmental, Social and Governance Report |
| CPC Corporation, Taiwan | 2024 | - | 6.995 Mt | Scope 1 + 2 total, derived: 11.58 Mt (2005 base) x (1 - 39.59%) as stated by CPC; absolute 2024 figure not published as text; CPC Corporation, Taiwan - Energy Conservation & Carbon Reduction |
| Boeing | 2025 | 0.525 Mt | - | Scope 1, operational control, calendar year 2025; DNV assurance statement on Boeing GHG emissions (DNV-2026-ASR-871413-1) |
| Takeda Pharmaceutical | 2023 | 0.279 Mt | - | Scope 1, global, fiscal year 1 Apr 2023 - 31 Mar 2024 (FY23); Takeda UK Carbon Reduction Plan 2025 (global FY23 emissions) |
| Yamato Holdings | 2024 | - | 0.779 Mt | Scope 1 + 2, fiscal year ended 31 Mar 2025, consolidated companies in Japan and Swan Co.; Yamato Holdings Integrated Report 2025 (non-financial highlights) |
| Geopost (DPD group, La Poste) | 2025 | - | 1.710 Mt | Group greenhouse gas emissions as reported; split by scope not given; Geopost 2025 annual results |
| Woodside Energy Group | 2025 | - | 6.616 Mt | Gross equity Scope 1 + 2; net 5,334 kt after retiring 1,283 kt of carbon credits; Woodside - Scope 1 and 2 GHG emissions |
| Apple Inc. | 2025 | 0.055 Mt | 0.570 Mt | Scope 1, fiscal 2025; total = corporate gross emissions (Scopes 1, 2 market-based, selected Scope 3); Apple Environmental Progress Report 2026 |
| Bayer AG | 2025 | 1.890 Mt | 2.790 Mt | Scope 1 for sites using >1.5 TJ/year; total = Scope 1 + 2; Bayer SFDR Index 2025 (refers to Annual Report 2025 p. 151) |
| Salesforce | 2025 | 0.006 Mt | 1.454 Mt | Scope 1, fiscal year ended 31 Jan 2025; total = absolute emissions (Scope 1, 2 LBM, 3 LBM); Salesforce FY25 Schedules of Environmental and Employee Metrics |
| Interface, Inc. | 2025 | 0.014 Mt | - | Scope 1 gross, calendar year 2025 (5,194 t after green gas credits); reasonable assurance; Interface GHG Verification Statement CY2025 (WAP Sustainability) |
| Lufthansa Group | 2025 | 29.560 Mt | - | Gross global Scope 1 (29.37 Mt from flights); Lufthansa Group SASB Report 2025 |
| Osaka Gas | 2023 | 4.441 Mt | 25.632 Mt | Scope 1, fiscal year ended 31 Mar 2024; total = Scopes 1-3; Daigas Group Integrated Report 2025 |
| Vattenfall AB | 2025 | 3.400 Mt | 23.200 Mt | Scope 1 (direct emissions from owned or controlled sources); total = Scopes 1-3; Vattenfall AB net-zero assessment (June 2026) |
| Kuehne+Nagel | 2025 | - | 15.826 Mt | Total Scopes 1-3 as reported (Scope 1 not split in the summary); Kuehne+Nagel Sustainability Report 2025 |

