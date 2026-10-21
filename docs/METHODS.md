<p align="center"><img src="assets/banner.svg" alt="Netra" width="100%"></p>

# Netra methods

<p align="center"><img src="assets/how-it-works.svg" alt="How Netra works in six steps" width="100%"></p>

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

## Grades

<p align="center"><img src="assets/grades.svg" alt="Grade scale A to E" width="100%"></p>

## Classification rules (three independent signals)

<p align="center"><img src="assets/three-signals.svg" alt="Three-signal classification" width="100%"></p>

Every project gets a category only when independent sources agree. Any disagreement gets **no OAR**, so a dispute can only lower a company's estimated real tonnes, never raise it.

1. **Berkeley VROD curated project Type** (PROJECTS sheet, 11,856 projects), joined by project ID (Verra `VCS<id>`, Gold Standard `GS<GSID>`). Join rate: 100% of rows and tonnes.
2. **CarbonPlan OffsetsDB project_type** (independent classification, parquet release; covers 78.2% of retired tonnes with a known type).
3. **Registry methodology code** (REDD+: VM0004/6/7/9/15/37/48; biomass cookstoves: VMR0006, AMS-II.G, VM0050, TPDDTEC, improved-cookstove and metered GS methodologies; grid renewables: ACM0002, AMS-I.D, AMS-I.F, VMR0017).

Type to OAR category: `REDD+` -> REDD+; `Cookstoves` -> cookstoves, except solar cookers, coal-ignition, LPG and stove-plus-water projects (Probst's cookstove studies cover biomass cookstoves only); `HFC23 Destruction` -> HFC-23; `Improved Forest Management` -> US IFM only in the US; `Wind` in China -> China wind; other wind, hydro, solar, geothermal, RE bundled, biomass -> renewables (no OAR); everything else -> no OAR. VROD's `SF6 Replacement` is not SF6 destruction and gets no OAR.

Result on VROD v2026-08 (since 2020): 234 projects (6.15% of tonnes) have at least one disagreeing signal; all are set to no OAR and listed in `data/classification_review.csv`. None of these disputes removed an OAR that Berkeley's type would have given; they are projects Berkeley already places outside the OAR categories while another signal points to one. The largest are Katingan (VCS1477) and Sumatra Merang (VCS1899): REDD+ according to OffsetsDB and the VM0007 code, Wetland Restoration according to Berkeley. Neither is in Probst's REDD+ sample (Latin America, Africa, Cambodia), so no OAR is applied. Automated checks live in the `__main__` block of `pipeline/build.py`.

## ICVCM status

Each methodology string is matched to the ICVCM table by code and version range: `approved` (CCP-Approved, including conditional), `not_approved` ("Does not meet"), or `not_assessed` (not listed, under assessment, or version outside an assessed range). Examples: ACM0002 and AMS-I.D do not meet; GS TPDDTEC v2.0-3.1, VM0050, VM0048 and the GS metered methodology v1.0-1.2 are approved; legacy REDD+ methodologies VM0007, VM0009 and VM0015 are not listed.

Share of retired tonnes since 2020: approved 4.5%, not approved 35.9%, not assessed 59.6%.

## Headline numbers (VROD v2026-08, Verra + Gold, since 2020)

<p align="center"><img src="assets/key-findings.svg" alt="Key findings" width="100%"></p>

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

Registry beneficiary names are shown as published, with two repairs (`clean_owner` in `pipeline/build.py`): 4,560 names exported with Mac Roman mojibake (e.g. "Societ√† Benefit") are decoded back to UTF-8 ("Società Benefit"), and statements such as "Retired on behalf of easyJet for aviation emissions period ..." are reduced to the named party ("easyJet"). Names are then normalized (case, punctuation, legal suffixes) to group retirements. Result: 44,546 buyers.

## Independent emissions (Climate TRACE)

<p align="center"><img src="assets/emissions.svg" alt="Emissions from two sources" width="100%"></p>

- **Source:** Climate TRACE Emissions Inventory v5.7.0 (CC BY 4.0, https://zenodo.org/records/20830133), sector packages for fossil fuel operations, power, manufacturing and mineral extraction, gas `co2e_100yr`, year 2025, monthly source-level emissions summed per asset.
- **Ownership:** the packages' `*_emissions_sources_ownership_*.csv` files give each parent's `overall_share_percent` per asset (the public API lists owners without shares, so it is not used for attribution).
- **Attribution (`pipeline/ownership.py`):** parent emissions = sum of asset emissions x known share. A parent holding one asset through several paths has its shares summed (capped at 100%). Where a share is unknown, the low value excludes the asset and the high value includes all of it: a range, never a guess. 12,120 parents; 10,371 are not controlled (>50%) by another real entity (pseudo-holders such as "small shareholder(s)" are ignored).
- **Matching buyers to parents:** only through the reviewed table `data/aliases.csv` (12 buyer names to 8 parents so far). Each row states how the buyer relates to the parent and whether Climate TRACE's ownership sectors cover the group's main emissions (`core`) or not (`partial`, e.g. Volkswagen vehicle production, Delta flights). Partial matches carry a visible warning.
- **Not comparable to self-reported scope 1.** Climate TRACE equity-share estimates differ from company reports by a factor of two or more in both directions. Spot checks (company figures from secondary sources, still to be confirmed against primary reports): Shell 123-151 Mt (CT 2025) vs about 50 Mt reported scope 1 (2024, Reuters); Holcim 35-45 Mt vs about 71 Mt (2024, Tracenable/DitchCarbon); ENGIE 32-39 Mt vs about 22 Mt (2024, Tracenable, ENGIE SASB disclosure). Netra therefore shows the independent figure with its basis and never computes a single "coverage" ratio from it.

## Buyer classification

<p align="center"><img src="assets/hidden-buyers.svg" alt="Hidden buyers" width="100%"></p>

`data/buyers.csv` (generated by `pipeline/curate_buyers.py`, every row reviewed against registry retirement details) classifies the 167 largest buyer names, which cover the top 160 entries by retired tonnes plus known subsidiaries of linked groups. Each name gets a group, a type and, where relevant, a Climate TRACE parent:
- **company** (118 names, 94 groups), **intermediary** (offset providers or carbon tax offset accounts retiring for clients, e.g. 4AIR, Pangolin, Ecologi, South African COAS accounts), **wallet** (crypto addresses; tokenized credits), **tokenization** (Moss.Earth), **anonymous** ("Not Disclosed", "Anonymous", blank), **unidentified** (codes such as "DL", "GP-2"; not guessed, e.g. "DL" is not assumed to be Delta), **public_body**.
- Several registry spellings map to one group (e.g. DPD Group, DPDgroup, Geopost; Delta Air Lines and the registry typo "Delta Air Lies"; Volkswagen brands, Audi, Skoda and SEAT under Volkswagen AG).
- Registry names are kept as published; the group is shown next to them. Holcim (Australia) is not linked to Holcim AG because ownership at the time of retirement was not verified.

## Company-reported emissions

`data/reported_emissions.csv` holds figures read by hand from each company's own primary document (annual report, sustainability statement, assurance or verification statement, SASB index, CDP response or ESG data book), one row per group, with boundary, URL, section and date checked (2026-10-20). Figures available only from aggregators (Tracenable, DitchCarbon) or AI-extracted summaries were **not** used, and figures whose table could not be read unambiguously were left out (e.g. Lyft). Where a company publishes only a combined Scope 1+2 or total figure, Scope 1 is left blank. Rows are shown next to, never merged with, the Climate TRACE estimate.

Coverage: 79 of the 94 classified company groups, together 94.3% of the tonnes retired by classified companies. Notable checks: "Hörmann Gruppe" reports belong to HÖRMANN Industries, not the buyer Hörmann KG, so they were not used; Civitas Resources is now part of SM Energy; Reports from Air France-KLM, Infosys, Allianz, BAT and BCG were read in a regular browser because those sites block scripted downloads; the CMA CGM report was read from the copy hosted by its subsidiary CEVA Logistics because the group site link is broken. BCG publishes Scope 1 only inside a chart without a clear label, so it was left out. The Civitas report was removed after the SM Energy merger. OVO and BrewDog figures come from their audited accounts filed at Companies House (scanned documents, read page by page); BrewDog labels its figures as estimates pending final calculation. Tables extracted from PDFs were checked against the rendered page or against the report's own totals, because text extraction can shift table rows. Greenchoice and ESWE servers could not be reached, LichtBlick's management report contains no emissions figures, and Bonnier reports emissions only per business unit. The remaining groups (mostly energy retailers and small private companies) publish no group-level absolute Scope 1 figure that could be found in a primary document.

Every group without a reported figure has a written reason in `data/emissions_gaps.csv` (what was checked, where, when, and why no figure is shown); the site shows that reason instead of a blank. A second, targeted search on 21 Oct 2026 found figures for three groups first listed as missing (Süwag, Friedrich Scharr, Städtische Werke Kassel via its parent KVV), which are now included.

| Group | Year | Scope 1 | Reported total | Boundary | Source |
|---|---|---|---|---|---|
| Shell plc | 2025 | 46.000 Mt | - | Scope 1 gross, operational control | [Shell plc Annual Report and Accounts 2025](https://www.shell.com/investors/results-and-reporting/annual-report.html) |
| Eni SpA | 2025 | 28.400 Mt | - | Scope 1, ESRS consolidated boundary (100% operated basis: 18.6 Mt) | [Eni Annual Report 2025 Sustainability Statement](https://report.eni.com/annual-report-2025/en/_assets/downloads/sustainability-eni-ar25.pdf) |
| Chevron Corp | 2025 | 52.000 Mt | - | Scope 1, equity share (operational control: 55 Mt) | [DNV assurance statement on Chevron 2025 GHG data (DNV-2026-ASR-863200-1)](https://www.chevron.com/-/media/chevron/sustainability/documents/ghg-assurance.pdf) |
| Volkswagen AG | 2025 | 2.700 Mt | - | Scope 1, Volkswagen Group and companies with operational control | [Volkswagen Group Annual Report 2025 - Climate change](https://annualreport2025.volkswagen-group.com/sustainability-report/environmental-information/climate-change.html) |
| Delta Air Lines Inc | 2025 | 39.302 Mt | - | Scope 1 total (mainline jet fuel, SAF, subsidiaries, other) | [2025 Delta Difference Report - GHG Emissions Data](https://esghub.delta.com/content/esg/en/2025/ghg-emissions-data.html) |
| easyJet plc | 2025 | 8.702 Mt | - | Scope 1, financial year 1 Oct 2024 - 30 Sep 2025 | [easyJet plc Environmental Disclosures ESG Factsheet (FY2025)](https://s203.q4cdn.com/522538739/files/doc_governance/2026/03/49677_easyjet_factsheet_Enviro_Disclosure_AW.pdf) |
| Netflix, Inc. | 2025 | 38,379 t | 1.092 Mt | Scope 1; total = target-based Scopes 1-3 | [2025 Netflix Environmental Social Governance Report](https://s22.q4cdn.com/959853165/files/doc_downloads/2026/6/2025-Netflix-Environmental-Social-Governance-Report.pdf) |
| Holcim AG | 2025 | 52.500 Mt | - | Scope 1, sum of calcination 32.6 Mt, fuel combustion 15.7 Mt, other operations 4.2 Mt (57.1% of footprint) | [Holcim 2025 Sustainability Statement](https://www.holcim.com/sites/holcim/files/docs/27022026-holcim-sustainability-statement-2025.pdf) |
| ENGIE SA | 2024 | 21.948 Mt | - | Total direct GHG emissions, Scope 1 | [ENGIE SASB Disclosure 2024-2023-2022](https://www.engie.com/app/uploads/2026/02/2025-04-23-ENGIE-SASB-Disclosure-2024-2023-2022.pdf) |
| PetroChina Co Ltd | 2024 | 122.760 Mt | 170.460 Mt | Scope 1; total = Scope 1 + 2, operational boundary | [PetroChina 2024 Environmental, Social and Governance Report](https://www.petrochina.com.cn/ptr/gsgg/202503/c7f46bff3c8548ecad122a1626d64831/files/cd0d49615ba241ea81c20860434cee66.pdf) |
| CPC Corporation, Taiwan | 2024 | - | 6.995 Mt | Scope 1 + 2 total, derived: 11.58 Mt (2005 base) x (1 - 39.59%) as stated by CPC; absolute 2024 figure not published as text | [CPC Corporation, Taiwan - Energy Conservation & Carbon Reduction](https://www.cpc.com.tw/en/cp.aspx?n=4278) |
| Boeing | 2025 | 0.525 Mt | - | Scope 1, operational control, calendar year 2025 | [DNV assurance statement on Boeing GHG emissions (DNV-2026-ASR-871413-1)](https://www.boeing.com/content/dam/boeing/v2/company/sustainability/documents/ghg_emissions_assurance_statement.pdf) |
| Takeda Pharmaceutical | 2023 | 0.279 Mt | - | Scope 1, global, fiscal year 1 Apr 2023 - 31 Mar 2024 (FY23) | [Takeda UK Carbon Reduction Plan 2025 (global FY23 emissions)](https://assets-dam.takeda.com/image/upload/v1743433700/LOC/en-gb/Corporate_Responsibility/Sustainability/TUK_CRP_2025.pdf) |
| Yamato Holdings | 2024 | - | 0.779 Mt | Scope 1 + 2, fiscal year ended 31 Mar 2025, consolidated companies in Japan and Swan Co. | [Yamato Holdings Integrated Report 2025 (non-financial highlights)](https://www.yamato-hd.co.jp/english/investors/library/annualreport/pdf/e_ir2025_07_01.pdf) |
| Geopost (DPD group, La Poste) | 2025 | - | 1.710 Mt | Group greenhouse gas emissions as reported; split by scope not given | [Geopost 2025 annual results](https://www.geopost.com/en/news/geopost-s-2025-annual-results/) |
| Woodside Energy Group | 2025 | - | 6.616 Mt | Gross equity Scope 1 + 2; net 5,334 kt after retiring 1,283 kt of carbon credits | [Woodside - Scope 1 and 2 GHG emissions](https://www.woodside.com/sustainability/environment/climate/Scope-1-and-2-ghg-emissions) |
| Apple Inc. | 2025 | 55,200 t | 0.570 Mt | Scope 1, fiscal 2025; total = corporate gross emissions (Scopes 1, 2 market-based, selected Scope 3) | [Apple Environmental Progress Report 2026](https://www.apple.com/environment/pdf/Apple_Environmental_Progress_Report_2026.pdf) |
| Bayer AG | 2025 | 1.890 Mt | 2.790 Mt | Scope 1 for sites using >1.5 TJ/year; total = Scope 1 + 2 | [Bayer SFDR Index 2025 (refers to Annual Report 2025 p. 151)](https://www.bayer.com/sites/default/files/2026-03/bayer-sfdr-index-2025.pdf) |
| Salesforce | 2025 | 6,000 t | 1.454 Mt | Scope 1, fiscal year ended 31 Jan 2025; total = absolute emissions (Scope 1, 2 LBM, 3 LBM) | [Salesforce FY25 Schedules of Environmental and Employee Metrics](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/white-papers/fy25-schedules-of-environmental-and-employee-metrics.pdf) |
| Interface, Inc. | 2025 | 13,578 t | - | Scope 1 gross, calendar year 2025 (5,194 t after green gas credits); reasonable assurance | [Interface GHG Verification Statement CY2025 (WAP Sustainability)](https://s205.q4cdn.com/354928249/files/doc_downloads/esg-resources/2026/Interface-GHG-Verification-Statement-CY2025.pdf) |
| Lufthansa Group | 2025 | 29.560 Mt | - | Gross global Scope 1 (29.37 Mt from flights) | [Lufthansa Group SASB Report 2025](https://www.lufthansagroup.com/media/downloads/en/responsibility/LHG-SASB-Report-2025.pdf) |
| Osaka Gas | 2023 | 4.441 Mt | 25.632 Mt | Scope 1, fiscal year ended 31 Mar 2024; total = Scopes 1-3 | [Daigas Group Integrated Report 2025](https://www.daigasgroup.com/en/files/data/sustainability/reportpolicy/integrated_report/report2025_81.pdf) |
| Vattenfall AB | 2025 | 3.400 Mt | 23.200 Mt | Scope 1 (direct emissions from owned or controlled sources); total = Scopes 1-3 | [Vattenfall AB net-zero assessment (June 2026)](https://group.vattenfall.com/globalassets/com/sustainability/net-zero-assessment-vattenfall-ab-04-jun-2026.pdf) |
| Kuehne+Nagel | 2025 | - | 15.826 Mt | Total Scopes 1-3 as reported (Scope 1 not split in the summary) | [Kuehne+Nagel Sustainability Report 2025](https://assets.kuehne-nagel.com/f/331466/x/a7fc2ff421/company-sustainability-esg-sustainability-report-2025.pdf) |
| Zalando | 2024 | 4,417 t | - | Gross global Scope 1 (CDP 7.6.1), reporting year 2024 | [Zalando SE CDP Climate Change Questionnaire 2025](https://corporate.zalando.com/sites/default/files/media-download/2025_11-zalando-se-cdp-climate-change-and-water-security-questionnaire.pdf) |
| VistaJet | 2020 | 0.210 Mt | 0.293 Mt | Scope 1 (VistaJet group, 2020; most recent group-level report found); total = Scopes 1-3 | [VistaJet Greenhouse gas (GHG) accounting report 2020](https://www.vistajet.com/globalassets/documents/vistajet-2020-ghg-accounting-report.pdf) |
| Telstra | 2026 | 26,922 t | 0.685 Mt | Scope 1, fiscal year ended 30 Jun 2026; total = Scope 1 + 2 | [Telstra Bigger Picture Report 2026 Data Pack](https://www.telstra.com.au/content/dam/tcom/about-us/community-environment/pdf/2026-telstra-bigger-picture-report-data-pack.xlsx) |
| Norwegian Cruise Line Holdings | 2025 | 3.172 Mt | - | Gross global Scope 1, fiscal year 2025 (SASB TR-CL-110a.1) | [2025 NCLH Sail & Sustain Technical Appendix](https://d1io3yog0oux5.cloudfront.net/_a1acaca7421666bca2f98a96c1a04fee/nclhltd/db/1204/11729/file/2025+NCLH+Sail+%26+Sustain+Technical+Appendix.pdf) |
| Microsoft | 2024 | 0.144 Mt | 15.543 Mt | Scope 1, fiscal year 1 Jul 2023 - 30 Jun 2024; total = Scopes 1-3 | [2025 Microsoft Environmental Data Fact Sheet](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/2025-Microsoft-Environmental-Data-Fact-Sheet-PDF.pdf) |
| Etsy | 2025 | 333 t | - | Scope 1, year ended 31 Dec 2025, operational control; PwC review | [Etsy management assertion and PwC report on 2025 GHG metrics](https://investors.etsy.com/_assets/_fea57334fe81a735b34cf3bf4bdcb553/etsy/db/938/10062/report_of_independent_accountants/PwC+Report+%28signed%29+%2B+Mgt+Assertion+2.19.26.pdf) |
| Grab Holdings | 2025 | 16,003 t | 3.290 Mt | Scope 1 direct GHG; total = market-based Scopes 1-3 | [Grab ESG Report 2025](https://s205.q4cdn.com/179588156/files/doc_downloads/2026/06/Grab-ESG-Report-2025.pdf) |
| Church & Dwight | 2025 | 66,135 t | 86,611 t | Scope 1; total = Scope 1 + Scope 2 market-based | [Church & Dwight 2025 Sustainability Report](https://www.churchdwight.com/pdf/Sustainability/2025-Sustainability-Report.pdf) |
| Qantas | 2025 | 12.139 Mt | - | Global Scope 1, 1 Jul 2024 - 30 Jun 2025; reasonable assurance | [Qantas Group Sustainability Report 2025 (ASX release)](https://announcements.asx.com.au/asxpdf/20250905/pdf/06nw0dw9w0xvsq.pdf) |
| EY | 2025 | 18,000 t | - | Scope 1 (gas and car fleet), global, fiscal year 2025 (to 30 Jun 2025) | [EY Value Realized 2025](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/campaigns/value-realized/documents/2025/ey-value-realized-report-2025.pdf) |
| The Walt Disney Company | 2025 | 0.899 Mt | - | Scope 1, fiscal year 1 Oct 2024 - 30 Sep 2025; limited verification | [Disney Emissions Verification Statement (2025)](https://impact.disney.com/resources/emissions-verification-2025/) |
| Beiersdorf | 2025 | 60,547 t | 62,708 t | Gross Scope 1, group; total = Scope 1 + 2 market-based | [Beiersdorf Annual Report 2025, E1 Climate change](https://reports.beiersdorf.com/annual-report/2025/combined-management-report/non-financial-statement/environmental-information/e1-climate-change.html) |
| Barilla Group | 2025 | 0.233 Mt | - | Gross Scope 1 (27.6% under emissions trading schemes) | [Barilla Group Sustainability Report 2025](https://www.barillagroup.com/media/filer_public/c3/5e/c35e76fb-8f41-4b30-88c2-0a783f233517/barilla_group_sustainabilityreport_2025.pdf) |
| Nestlé (Nespresso) | 2025 | 2.820 Mt | 69.000 Mt | Gross Scope 1, Nestlé group; total = Scopes 1-3 (GHG Protocol) | [Nestlé Non-Financial Statement 2025](https://www.nestle.com/sites/default/files/2026-02/non-financial-statement-2025.pdf) |
| AGL Energy | 2025 | 30.439 Mt | - | Scope 1, operational control (NGER), fiscal year to 30 Jun 2025 (updated Nov 2025) | [AGL ESG Data Centre FY25 - Operational greenhouse gas footprint](https://www.2025datacentre.agl.com.au/environment/greenhouse-energy/operational-greenhouse-gas-footprint-and-net-energy-production) |
| Origin Energy | 2025 | 15.799 Mt | 45.100 Mt | Scope 1 operated (operational control), fiscal year to 30 Jun 2025; total = equity Scopes 1-3 | [Origin Energy 2025 Sustainability Report and performance data](https://www.originenergy.com.au/wp-content/uploads/45/Origin_2025_Sustainability_Report.pdf) |
| Japan Airlines (ZIPAIR) | 2025 | 10.083 Mt | - | Scope 1 (direct CO2), JAL Group fiscal year 1 Apr 2025 - 31 Mar 2026, before SAF and credit offsets | [JAL Independent Verification Statement (GHG Ref. 884G)](https://www.jal.com/sites/en/sustainability/environment/environment-management/pdf_sites/en_CO2_JAL_verification_statements.pdf) |
| Booking Holdings | 2025 | 1,554 t | - | Scope 1 | [Booking Holdings 2025 Sustainability Report](https://www.bookingholdings.com/wp-content/uploads/2026/04/Booking-Holdings_2025-Sustainability-Report.pdf) |
| Maple Leaf Foods | 2025 | 0.121 Mt | - | Scope 1, year ended 31 Dec 2025; KPMG limited assurance | [KPMG assurance report on Maple Leaf Foods 2025 ESG metrics](https://www.mapleleaffoods.com/wp-content/uploads/sites/6/2026/06/2026-06-18-MLF-ESG-AR.pdf) |
| Jet2 | 2024 | 2.877 Mt | 2.878 Mt | Scope 1, year ended 31 Mar 2024 (latest absolute figure found); total = Scope 1 + 2 market-based; Verifavia reasonable assurance on aviation | [Jet2 plc Annual Report & Accounts 2024](https://www.jet2plc.com/-/media/jet2/jet2plc/pdfs/09-08-24/jet2-plc-annual-report-2024.pdf) |
| REI | 2025 | 5,739 t | - | Scope 1, reporting year 2025, operational control worldwide; limited verification | [REI 2025 GHG verification statement](https://www.rei.com/dam/25475257_rei-2025-ghg-verification-statement-03.23.26.pdf) |
| ANZ | 2025 | - | 80,870 t | Scope 1 + 2 location-based, year ended 30 Sep 2025; KPMG reasonable assurance | [ANZ 2025 GHG and Offsets Assurance Report (KPMG)](https://www.anz.com.au/content/dam/anzcomau/about-us/2025%20GHG%20and%20Offsets%20Assurance%20Opinion%20Report.pdf) |
| PwC | 2025 | - | 2.080 Mt | Gross GHG emissions (market-based) of the PwC network, FY25; Scope 1 not split | [PwC - Environmental stewardship](https://www.pwc.com/gx/en/about/corporate-sustainability/environmental-stewardship.html) |
| E.ON SE | 2024 | 1.980 Mt | 65.710 Mt | Scope 1 (2025 figure not yet confirmed); total = direct and indirect CO2e (Scopes 1-3) | [E.ON Integrated Annual Report 2024](https://annualreport.eon.com/content/dam/eon-annualreport/documents/en/GB24-gesamt-EN_final.pdf) |
| Groupe La Poste | 2025 | 0.353 Mt | 4.952 Mt | Scope 1 direct emissions (vehicle fleets 260,356 t, buildings 92,232 t); total = group GHG emissions | [La Poste Groupe GRI Index - ESRS 2025 ESG Metrics](https://www.lapostegroupe.com/assets/media/le-groupe-laposte/ajUVto1P9HI4UuNm_Cahier_des_indicateurs_ESG_2025_EN_VMEL.pdf) |
| Chanel | 2025 | - | 1.012 Mt | Total carbon footprint; Scope 1 + 2 = 23,447 t (Scope 1 not split) | [Chanel Climate Transition Plan FY25 Update](https://www.chanel.com/puls-img/1784902811893-chanel-climate-transition-plan-fy25.pdf) |
| CATL | 2023 | 0.750 Mt | - | Scope 1 after verification (latest verified figure found) | [CATL Carbon Accounting Report 2023](https://www.catl.com/en/uploads/1/file/public/202409/20240920152219_4mm2h2equv.pdf) |
| Tokyo Gas | 2024 | - | 4.360 Mt | Scope 1 + 2 combined, fiscal year to 31 Mar 2025 (Scope 1 not split in the source) | [Tokyo Gas Group Integrated Report 2025](https://www.tokyo-gas.co.jp/en/IR/library/pdf/anual/25e07.pdf) |
| Toho Gas | 2024 | - | 0.110 Mt | Scope 1 + 2 GHG (t-CO2e), fiscal year to 31 Mar 2025, excludes overseas subsidiaries | [Toho Gas Group Sustainability Factbook 2025](https://www.tohogas.co.jp/lang/en/approach/eco/eco-10/pdf/2025_en_sustainability_factbook.pdf) |
| Ovako | 2023 | - | 0.158 Mt | Scope 1 + 2, financial year 2023, verified by KPMG (latest absolute figure found) | [Ovako - Carbon offsetting](https://www.ovako.com/en/sustainability/environment/carbon-offset/) |
| Rémy Cointreau | 2025 | - | 0.154 Mt | Global carbon footprint, fiscal year 2024/25; scope coverage not stated next to the figure | [Rémy Cointreau Universal Registration Document 2024-25](https://www.remy-cointreau.com/app/uploads/2025/06/Universal-Registration-Document-2024-25.pdf) |
| Fortescue | 2025 | 2.640 Mt | 3.160 Mt | Total group Scope 1, fiscal year to 30 Jun 2025; total = Scope 1 + 2 market-based | [Fortescue FY25 ESG Databook](https://edge.sitecorecloud.io/fortescue17114-fortescueeb60-productionbbdb-8be5/media/project/fortescueportal/shared/documents/reporting/100-ds-gn-0003-fy25-esg-databook-rev5.xlsx) |
| Entega AG | 2025 | 0.129 Mt | 2.662 Mt | Gross Scope 1 (84% under emissions trading); total = market-based Scopes 1-3 | [ENTEGA Nachhaltigkeitsbericht 2025](https://www.entega.ag/fileadmin/downloads/nachhaltigkeit/Nachhaltigkeitsbericht_2025_WEB.pdf) |
| Nedbank Group | 2024 | - | 70,000 t | Own operational Scope 1 + 2 (stated as 70 ktCO2), year ended 31 Dec 2024 | [Nedbank Group 2024 Climate Report](https://group.nedbank.co.za/content/dam/group/pdf/21_integrated-reports/2024/climate-reporting/2024-climate-report-nedbank.pdf) |
| Schwarz Group (Lidl) | 2022 | 2.001 Mt | - | Gross Scope 1, Schwarz Group fiscal year 2022 (Lidl 547,589 t, Kaufland 400,569 t, PreZero 1,005,784 t); latest group table found | [Companies of Schwarz Group FY22 Key Figures Ecosystems](https://gruppe.schwarz/en/asset/download/10701/file/CompaniesOfSchwarzGroup_FY22_KeyFiguresEcosystems.pdf?version=4) |
| Lavazza Group | 2025 | 38,925 t | 1.981 Mt | Scope 1 direct emissions; total = Scopes 1-3 (ISO 14064-1 inventory) | [Lavazza Group Sustainability Report 2025](https://www.lavazzagroup.com/content/dam/lavazza/sostenibilit%C3%A0/aggiornamento-maggio-26/260520_Lavazza_BdS2025_ENG_interactive.pdf) |
| Kering (Gucci) | 2025 | 31,534 t | 41,802 t | Kering Group consolidated; total = Scope 1 + Scope 2 market-based (10,268) | [Kering 2025 Universal Registration Document](https://live.euronext.com/sites/default/files/esg_document_files/2026-07/003011_02%20-%20Universal%20Registration%20Document%202025_EN_2026-07-02_12:50.pdf) |
| Air Canada | 2025 | 12.007 Mt | - | Air Canada incl. Rouge, Vacations, Aeroplan, Trans-Canada Capital; gross Scope 1 (PwC limited assurance) | [Air Canada 2025 Corporate Sustainability Report (Citizens of the World)](https://content.presspage.com/uploads/3167/ddc6714f-ffcc-4d61-a382-ee84d8a6fb45/2025_csr_en.pdf) |
| Allianz | 2025 | 45,756 t | 97,051 t | Allianz Group ESRS E1-6 (own operations 30,761 t + on-balance real assets 14,994 t); total = Scope 1 + Scope 2 market-based | [Allianz Group Annual Report 2025 (Sustainability Statement)](https://www.allianz.com/content/dam/onemarketing/azcom/Allianz_com/investor-relations/en/results-reports/annual-report/ar-2025/en-allianz-group-annual-report-2025.pdf) |
| British American Tobacco (Nicoventures) | 2025 | 0.222 Mt | 0.289 Mt | BAT Group, operational control, reporting year 1 Dec 2024-30 Nov 2025, figures in thousand tonnes; total = Scope 1 + Scope 2 market-based (67 kt) | [BAT Sustainability Performance Data Book 2025](https://www.bat.com/content/dam/batcom/global/main-nav/investors-and-reporting/reporting/sustainability-reporting/BAT_Sustainability_Performance_Data_Book_2025.pdf) |
| Air France-KLM | 2024 | 25.727 Mt | 25.736 Mt | Air France-KLM Group gross Scope 1 (flight ops 25,693 kt + ground ops 33 kt); total = Scope 1 + Scope 2 market-based (9 kt) | [Air France-KLM 2024 Universal Registration Document](https://www.airfranceklm.com/sites/default/files/2025-04/2024_urd_ven_04032025.pdf) |
| Infosys | 2025 | 11,483 t | 45,834 t | Infosys, fiscal year to 31 Mar 2026; total = Scope 1 + Scope 2 (34,351 t, basis as stated in declaration) | [Infosys Carbon Neutrality Declaration 2026 (ISO 14068)](https://www.infosys.com/sustainability/documents/carbon-neutrality/carbon-neutrality-declaration2026.pdf) |
| CMA CGM | 2024 | 29.100 Mt | 29.300 Mt | CMA CGM Group Scope 1 CO2 (millions of tons, as published); total = Scope 1 + Scope 2 (0.2 Mt) | [CMA CGM Group 2024 CSR Report (Non-Financial Performance Report), copy hosted by group subsidiary CEVA Logistics](https://www.cevalogistics.com/documents/2025-03/2024%20CSR%20Report%20CMA%20CGM%20Group.pdf) |
| Natura &Co | 2025 | 8,286 t | 8,286 t | Natura Cosméticos (post-restructuring boundary; base year recalculated); total = Scope 1 + Scope 2 market-based (0.2 t) | [Natura Sustainability-Related Financial Information Report 2025 (IFRS S1 and S2)](https://filemanager-cdn.mziq.com/published/9e61d5ff-4641-4ec3-97a5-3595f938bb75/a27854da-40b3-4890-87c6-5bc397d8c2cf) |
| EnergyAustralia (energy retailer, offsets for customers) | 2025 | 16.570 Mt | 16.786 Mt | EnergyAustralia Group (CLP subsidiary), operational emissions; total = Scope 1 + Scope 2 (0.213 Mt) | [EnergyAustralia Climate-related Financial Disclosure (ASRS) Report FY25](https://www.energyaustralia.com.au/sites/default/files/2026-03/EA_ASRS%20Report%20-%20FY25.pdf) |
| Finarvedi (Arvedi steel) | 2025 | 0.919 Mt | 0.936 Mt | Arvedi Group (steelworks and tube mills); total = Scope 1 + Scope 2 market-based (17,604 t) | [Finarvedi S.p.A. Bilancio Consolidato 2025 (Sustainability Statement, voluntary CSRD)](https://www.arvedi.it/fileadmin/user_upload/2026/Finarvedi_SPA_Bilancio_Consolidato_2025.pdf) |
| OVO (energy retailer, offsets for customers) | 2025 | 588 t | 1,954 t | Energy Transition Holdings Ltd (OVO group parent; OVO 580 t + Kaluza 8 t); total = Scope 1 & 2 operational emissions KPI as reported | [Energy Transition Holdings Ltd Annual Report and Financial Statements 2025 (filed at Companies House under Energy Transition Group Ltd, 08862063)](https://find-and-update.company-information.service.gov.uk/company/08862063/filing-history/MzU0NjAyODE0NGFkaXF6a2N4/document?format=pdf&download=0) |
| BrewDog | 2024 | 7,827 t | 15,475 t | BrewDog group global; company states figures are estimates pending final calculation; total = Scope 1 + Scope 2 (7,648 t, location-based) | [BrewDog PLC Full Accounts for year ended 31 December 2024 (Companies House SC311560), Strategic report SECR](https://find-and-update.company-information.service.gov.uk/company/SC311560/filing-history/MzQ4MzI3MDk5MmFkaXF6a2N4/document?format=pdf&download=0) |
| AECI (AEL Mining Services) | 2025 | 0.163 Mt | 0.365 Mt | AECI Group, 2025 result before restated baseline for divestments (restated 154,289 t); total = Scope 1 + Scope 2 | [AECI Sustainability Report 2025](https://investor.aeciworld.com/pdf/integrated-reports/2025/2025-sustainability-report.pdf) |
| Lyft | 2024 | 2,451 t | 4,321 t | Lyft Inc., calendar 2024, limited assurance by Cameron-Cole; total = Scope 1 + Scope 2 market-based (1,870 t) | [Lyft 2024 Sustainability Impact Report](https://s27.q4cdn.com/263799617/files/doc_downloads/2025/09/Lyft-2024-Sustainability-Impact-Report.pdf) |
| Chiesi Group | 2025 | 21,358 t | 22,037 t | Chiesi Group, ISO 14064 / GHG Protocol; total = Scope 1 + Scope 2 market-based (679 t) | [Chiesi ESG Reports 2025 (TCFD Report 2025)](https://www.chiesi.com/content/dam/chiesi-corporate/global/en/archive/document-archive/2026/esg_reports_2025.pdf.coredownload.pdf) |
| Berkshire Hathaway (Shaw Industries) | 2025 | 0.290 Mt | 0.610 Mt | Shaw Industries Group (Berkshire Hathaway subsidiary), enterprise-wide; figures given to two decimals in million tonnes; total = Scope 1 + Scope 2 (0.32 Mt) | [Shaw Industries 2025 Corporate Sustainability Report](https://shawinc.com/2025sustainabilityreport) |
| Süwag (energy retailer) | 2025 | - | 3.290 Mt | Greenhouse gas emissions as published in the key figures (split by scope not given) | [Süwag Geschäftsbericht 2025, key figures (Kennzahlen, Nachhaltigkeit)](https://www.suewag.com/corp/ueber-uns/finanzen/zahlen-daten-fakten/geschaeftsbericht) |
| Friedrich Scharr KG | 2022 | 3,441 t | 21,828 t | SCHARR group, financial year 2022; total = Scope 1 + 2 (0 t) + 3; full calculation every two years | [SCHARR KLIMAWIN report 2023](https://scharr.de/fileadmin/media/KG/Dateien/Nachhaltigkeit/SCHARR-KLIMAWIN-Nachhaltigkeitsbericht-2023.pdf) |
| Städtische Werke Kassel (energy retailer) | 2022 | - | 0.783 Mt | KVV Kassel group (parent of Städtische Werke AG), all three scopes as far as recorded | [KVV Kassel sustainability report 2022](https://www.kvvks.de/fileadmin/kvvks/Dokumente/Geschaeftsberichte/2022/2023_01_Kassel__KVV_Nachhaltigkeitsbericht_DS.pdf) |

