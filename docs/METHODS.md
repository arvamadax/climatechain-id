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

## Classification rules

Each retirement row is assigned a category from its methodology code, project type, project name and country (`data/build.py`, function `category`):
- REDD+: VM0004, VM0006, VM0007, VM0009, VM0015, VM0037, VM0048.
- Cookstoves: cookstove methodologies (VMR0006, AMS-II.G, AMS-I.E, VM0050, GS TPDDTEC, GS improved cookstoves, GS metered) or Gold Standard "Energy Efficiency - Domestic", **and** the project name mentions cooking or stoves, **and** it does not mention biogas, biodigesters, water, filters, purification or lighting.
- HFC-23: AM0001. SF6: AM0035, AM0065, AM0078.
- IFM: VM0003, VM0005, VM0010, VM0012 or "improved forest" in the name; US projects only get the US OAR.
- Grid renewables: ACM0002, AMS-I.A, AMS-I.D, AMS-I.F or wind/solar/hydro/PV/geothermal in type or name; Chinese wind gets the China wind OAR.

Checks done on 2026-10-20: the 12 largest projects in each category were reviewed by hand. Fixes made after review: biogas (Vietnam), LifeStraw water filters and mixed stove-plus-water projects moved out of "cookstoves". Mixed projects are treated as "other" (no OAR) to stay conservative. Automated checks live in the `__main__` block of `data/build.py`.

## ICVCM status

Each methodology string is matched to the ICVCM table by code and version range: `approved` (CCP-Approved, including conditional), `not_approved` ("Does not meet"), or `not_assessed` (not listed, under assessment, or version outside an assessed range). Examples: ACM0002 and AMS-I.D do not meet; GS TPDDTEC v2.0-3.1, VM0050, VM0048 and the GS metered methodology v1.0-1.2 are approved; legacy REDD+ methodologies VM0007, VM0009 and VM0015 are not listed.

Share of retired tonnes since 2020: approved 4.5%, not approved 35.9%, not assessed 59.6%.

## Headline numbers (VROD v2026-08, Verra + Gold, since 2020)

- Tonnes with a published OAR: 42.1%.
- Of those, likely real: 20.0% central (range 2.2-71.9%, driven mainly by REDD+ uncertainty).
- Largest single owner entry: "Not Disclosed", 89.4 million t.

## Known limits

- OAR values are averages per project type; individual projects vary widely.
- Categories without a published OAR (35% grid renewables, 23% other) cannot be scored and are reported separately.
- Owner names in registries do not always match the company making a claim (brokers, subsidiaries, brands).
