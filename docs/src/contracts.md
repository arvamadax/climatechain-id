<p align="center"><img src="../docs/assets/contract.svg" alt="ClaimRegistry: record, verify, challenge" width="100%"></p>

# contracts · ClaimRegistry

The on-chain part of Netra. Each published check is anchored here so anyone can confirm later that the grade they see is the one that was published, and that no registry serial range backs two claims.

The contract **does not mint, bridge or burn credits**. Credits stay in their registry (Verra, Gold Standard). It only records a fingerprint of each check and of the serial ranges behind it. Minting tokens from retired credits can itself create double counting, which is why Verra banned it in 2022.

## Contents

| Path | What it is |
|---|---|
| `src/ClaimRegistry.sol` | The contract (Solidity 0.8.24, OpenZeppelin `MerkleProof`) |
| `test/claimRegistry.test.js` | 8 tests: recording, duplicate rejection, Merkle challenges, edge cases |
| `scripts/demo.js` | End-to-end publish: deploy, one check per buyer in `data/serials/`, a simulated duplicate, the watcher flagging it |
| `scripts/deploy.js` | Deploy only; writes `deployments/<network>.json` and `web/data/deployment.json` |
| `scripts/record.js` | Publish one buyer's check (`recordRoot`) |
| `scripts/watch.js` | Scan published checks and challenge any serial range claimed twice |
| `scripts/merkle.js` | Sorted-pair Merkle root and proofs, identical to the browser code in `web/app.js` |
| `scripts/chains.js` | Public RPC, block explorer and label per network |
| `scripts/live-watcher.js` | Always-on watcher (no Hardhat): reads new checks, verifies serial lists against their roots, challenges reused ranges |
| `scripts/demo-duplicate.js` | Live demo: publishes a made-up claimant that reuses a few serial ranges, for the watcher to catch |

## Functions

| Function | Who calls it | What it does |
|---|---|---|
| `recordRoot(subject, reportHash, uri, serialRoot, serialCount)` | Publisher | Stores one check with the Merkle root of its serial-range nullifiers. Constant gas for any number of ranges (Sepolia: 589,915 for 684 ranges, 589,903 for 10). |
| `record(subject, reportHash, uri, nullifiers[])` | Publisher | Stores one check with explicit nullifiers; reverts with `AlreadyClaimed` if any was used before. |
| `challenge(nullifier, idA, proofA, idB, proofB)` | Anyone | Proves one nullifier is inside two checks; the later one gets `doubleClaim = true` and a `DoubleClaim` event. |
| `checks(id)`, `count()` | Anyone | Read a check: subject, report hash, serial root, count, time, attester, flag, URI. |

**Definitions.** `subject` = keccak256 of the buyer name. `reportHash` = keccak256 of the buyer's JSON record exactly as published in `web/data/`. A nullifier = keccak256(registry, serial range); the Merkle leaf = keccak256(nullifier), pairs sorted.

## Run

```bash
npm install
npx hardhat test                 # 8 passing

npm run node                     # terminal 1: local chain
npm run demo:local               # terminal 2: six real buyers + one flagged duplicate

npm run demo:sepolia             # Ethereum Sepolia (PRIVATE_KEY in ../.env, a little test ETH)
npm run demo:base-sepolia        # alternative public testnet
```

On Sepolia, two publish runs (deploy, checks, challenge; the first was cut off by a network error) cost 0.020 test ETH in total.

## Trust model

| Question | Answer |
|---|---|
| Who can publish? | Any address; the attester is stored with each check. The web app shows the address it trusts from `web/data/deployment.json`. |
| Can a check be edited? | No. A new check can be published; the old one stays. |
| What if the data changes? | The page shows "differs from current data" for older checks. |
| What is still trusted off-chain? | That the published JSON reflects the registry. Anyone can recompute it from Berkeley VROD with `pipeline/build.py`. |
