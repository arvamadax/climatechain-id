# Netra

**The eye on net-zero claims.** Netra checks whether the carbon credits a company retired are likely to have cut real emissions, using open registry data and peer-reviewed research, and anchors each published check on-chain so anyone can verify it.

IEEE ClimateChain Global Hackathon 2026 · Track 1: Carbon Markets & Emissions Transparency.

## What it does
- **Search any buyer** (44,707 names) who retired Verra or Gold Standard credits since 2020.
- **Grade A-E with a plain-language sentence**: of every 100 tonnes retired, how many research covers and how many likely cut real emissions, with the research range.
- **Integrity context**: project types, ICVCM Core Carbon Principles status, pre-2016 vintages, past-to-present trend, EU Directive 2024/825 warning for product claims.
- **On-chain proof**: `ClaimRegistry` on Polygon Amoy stores the hash of each published report and binds every registry serial range to one claim only (no double claiming). The web app recomputes the hash from the open data and shows whether it matches.

## Repository
- `data/build.py` - builds the dataset from Berkeley VROD, CarbonPlan OffsetsDB and the ICVCM status table (three-signal classification, Probst et al. 2024 outcome ratios).
- `data/serials.py` - extracts the serial ranges retired for one buyer.
- `contracts/` - `ClaimRegistry.sol`, tests, deploy and record scripts.
- `web/` - static web app (no backend).
- `docs/METHODS.md` - method, sources, validation and limits.

## Run
```bash
# web app
cd web && python -m http.server 8000
# contracts
cd contracts && npm install && npx hardhat test
# full on-chain demo on a local chain (no testnet tokens needed)
npm run node            # terminal 1
npm run demo:local      # terminal 2: deploys, publishes 6 real buyer checks, flags a simulated double claim
```

## Deployment
Current contract (v2, Merkle-root claims + on-chain double-claim challenges) runs on a local Hardhat chain via `npm run demo:local`; Polygon Amoy deployment follows with `npm run deploy:amoy`. An earlier v1 is on Amoy at [0x052d89245Bf1EB867CE371817eDf74FBBc4f0be0](https://amoy.polygonscan.com/address/0x052d89245Bf1EB867CE371817eDf74FBBc4f0be0).

## Data and license notes
Berkeley Carbon Trading Project, Voluntary Registry Offsets Database v2026-08 (CC BY 4.0); CarbonPlan OffsetsDB; ICVCM assessment status (snapshot 18 Aug 2026); Probst et al. 2024, *Nature Communications*, doi:10.1038/s41467-024-53645-z. Netra shows risk estimates based on average research findings per project type, not verdicts on individual projects or companies.
