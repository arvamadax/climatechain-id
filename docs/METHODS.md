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

Result on VROD v2026-08 (since 2020): 234 projects (6.15% of tonnes) have at least one disagreeing signal; all are set to no OAR and listed in `data/classification_review.csv`. Only 2 of them were demoted from an OAR category: Katingan (VCS1477) and Sumatra Merang (VCS1899), typed REDD+ by OffsetsDB and the VM0007 code but Wetland Restoration by Berkeley; neither is in Probst's REDD+ sample (Latin America, Africa, Cambodia), so no OAR is applied. Automated checks live in the `__main__` block of `data/build.py`.

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
