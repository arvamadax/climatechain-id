# Netra: Devpost submission copy

Paste each section into the matching Devpost field. Replace the two `<...>` links before submitting.

## Project name
Netra

## Tagline
See what a carbon claim is really worth.

## Track
Track 1: Carbon Markets & Emissions Transparency

## Inspiration
Companies tell us they are "carbon neutral" because they retired carbon credits. The proof is usually a registry line, a PDF, or a press release. We wanted to know what sits behind these claims, so we downloaded every Verra and Gold Standard retirement since 2020. What we found was uncomfortable: research suggests only about one in five of those tonnes is a real emission reduction, more than half cannot be tied to a named company, and nothing public stops the same credit from backing two claims. We built Netra so that anyone, not just specialists, can check a claim in under a minute.

## What it does
Netra turns raw registry data into a plain answer: *what did this company retire, and how much of it is likely real?*

- **Check.** Search a company or paste a green claim. Netra shows every retirement grouped to the company, multiplied by the share of real reductions that peer-reviewed research found for each project type (Probst et al. 2024), as a grade from A to E with the published range.
- **Reported vs independent emissions.** A company's own reported figure, read from its primary report (79 company groups), next to Climate TRACE's independent ownership-weighted estimate. For 4 of 14 groups with both figures (Shell, Chevron, E.ON, Eni) the independent estimate is 3 to 6 times higher. Boundaries differ, so we present it as a question to ask, not a verdict.
- **Hidden buyers.** Anonymous, "Not Disclosed", reseller, wallet and untraceable accounts, labelled and quantified. 57% of retired tonnes cannot be tied to a named claimant.
- **Claim checker (AI).** A language model extracts who claims what, the scope, year and tonnes from pasted text. A field is kept only if its quote appears word for word in the text, and every number shown comes from Netra's data, never from the model.
- **Unusual patterns.** An Isolation Forest flags 8 of 540 large buyers with unusual mixes of old vintages, rejected methodologies and one-year bursts, with readable reasons and the label "a reason to look closer, not proof".
- **Live registry check.** Every 10 minutes the server reads the 200 newest Verra retirements and scores each with the same rules. It flags zombie credits (vintage 10+ years) and neutrality claims on products.
- **On-chain proof.** Each published check is anchored on Ethereum Sepolia in our `ClaimRegistry` contract: a hash of the report plus one Merkle root of its registry serial ranges. A serial range claimed twice is challenged on-chain by an always-on watcher, and by anyone else.

## How we built it
- **Data pipeline (Python, pandas).** Berkeley VROD, CarbonPlan OffsetsDB and Climate TRACE are joined into 342,012 retirement records (876 Mt). Reviewed inputs are version controlled in `data/`, with source URL and section for every reported figure.
- **Smart contract (Solidity 0.8.24, OpenZeppelin MerkleProof, Hardhat).** `recordRoot` stores a check with a Merkle root of serial-range nullifiers at constant gas: 589,915 for Shell's 684 ranges and 589,903 for easyJet's 10, measured on Sepolia. A challenge submits two Merkle proofs and the contract verifies both itself, so a wrong challenge fails.
- **Web app.** Fully static: no accounts, no tracking, no backend for the data views. It polls the contract every 15 seconds, so new checks and double-claim flags appear without a reload. Three public RPC nodes are tried in order. EN/ID switch.
- **Small Node services (no dependencies).** A claim reader with quote verification and a rate limit of 10 checks per hour with no text stored, and a registry watcher that retries failed or unfunded challenges and stops below 0.05 test ETH.

## Challenges we ran into
- **Honest grading.** A single "greenwash score" would have been easy and misleading. We kept published ranges, refused to score the 62% of tonnes with no published ratio, and wrote down limits in `docs/METHODS.md`.
- **Messy names.** The same company appears under dozens of beneficiary spellings. A TF-IDF name matcher was wrong about one time in five on real names, so we do not show it. Every match is reviewed by hand.
- **Keeping the model in its lane.** We made the language model an extractor only, with word-for-word quote verification, and a plain name-search fallback when it fails.
- **Real chain behaviour.** A network error cut off our first Sepolia run. We added retries and a balance floor so the watcher survives failures.

## Accomplishments that we're proud of
- A **live, tested double-claim catch**: a demo duplicate (check #7) reusing five of Shell's serial ranges was flagged about ten seconds after the watcher read it.
- Constant-gas proofs that scale from 10 to hundreds of ranges.
- A result that fits one sentence a journalist can use: about 1 in 5 tonnes likely real, and none of the 52 gradable large buyers reaches a B.
- Everything is traceable: data sources, licences, formulas and limits are public.

## What we learned
Transparency is as much a data problem as a blockchain problem. The chain cannot make a dubious credit good. What it can do is make a published check tamper-evident and a reused serial range impossible to hide. Combining careful research ratios with a small, boring contract worked better than a large tokenisation scheme, which is also why Netra does not mint, bridge or burn credits (Verra banned minting from retired credits in 2022 because it creates double counting).

## What's next
- A daily on-chain root of the live registry check, so the live feed becomes tamper-evident too.
- Gold Standard in the live check (its registry needs its own reader).
- Publishing reviewed company name matches once verified by hand.

## Track alignment
Track 1 asks for transparent carbon credit verification, smart contracts that prevent double counting, and stronger carbon market accountability. Netra covers all three: open verification of what companies retired, an on-chain Merkle registry with public challenge, and an independent view of what companies emit.

## Climate impact
Netra cannot reduce emissions by itself. It reduces the cost of asking whether a claim is true, so money and attention move toward credits that deliver real reductions and away from claims that cannot be verified. Users: journalists, regulators and auditors, NGOs, sustainability teams and informed buyers. EU rules now restrict "carbon neutral" product claims (from 27 Sep 2026), which makes independent checks directly useful.

## Scalability and sustainability
Static site and pre-computed JSON: hosting costs close to zero. Contract gas is constant for any number of serial ranges. Sources are open licences (CC BY 4.0 and similar), the code is MIT licensed, and new registries plug in through the same pipeline.

## Security and data integrity
Challenges are verified by the contract itself. The claim API is rate limited, stores and logs no text, and has a memory-capped limiter. The watcher key is testnet-only and never committed. On-chain data is hashes only, with no personal data. Everything runs on testnet.

## Limitations (stated on purpose)
Research ratios are averages by project type, not verdicts on a company or project. 62% of tonnes have no published ratio and are not scored. Registry beneficiaries can be resellers rather than the claimant. Reported and independent emissions use different boundaries and are never merged.

## Built with
Solidity, OpenZeppelin, Hardhat, Ethereum Sepolia, ethers.js, Python, pandas, scikit-learn (Isolation Forest, TF-IDF), Node.js, JavaScript, HTML/CSS, Climate TRACE, Berkeley VROD, CarbonPlan OffsetsDB, Verra public registry, a language model API.

## Team
- **Muhammad Rofi:** Developer. Pipeline, contract, web app, deployment.
- **Arva Mada Jayastu:** QA. Testing, edge cases, security review.
- **Zufar Maulana Firdaus:** Project Lead and Project Manager. Scope, research direction, story.

## Links
- Live app: https://netra.rofihosted.space
- Code: https://github.com/rofiperlungoding/climatechain-id
- Contract (Sepolia): https://sepolia.etherscan.io/address/0x8cac16962d34c6B6A302E7A05AEc9131d3E33909
- Demo video: `<YouTube link>`
- Method: docs/METHODS.md

## Image (3:2, 1200x800)
Result page for one large buyer showing its A-E grade and the line "About 1 in 5 tonnes likely real". Three big words only: **Check. Grade. Prove.**
