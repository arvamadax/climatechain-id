# Netra trust model

This document covers `contracts/src/ClaimRegistry.sol`. Every statement about the contract is readable in that file; the two hashing rules under Limits point to the scripts that define them.
## What the contract records

One check is one `Check` entry in the public `checks` array. Fields:

| Field | What it holds |
|---|---|
| `subject` | keccak256 of the claimant name as shown in Netra |
| `reportHash` | keccak256 of the published check report (JSON) |
| `serialRoot` | Merkle root of the serial-range nullifiers (`recordRoot`), zero for strict `record` entries |
| `serialCount` | number of serial ranges behind the claim |
| `uri` | where the report and its serial list can be fetched |
| `timestamp` | block timestamp of the recording transaction |
| `attester` | address that sent the recording transaction |
| `doubleClaim` | false when recorded, set to true by a successful `challenge` |

A nullifier is one serial range behind a claim, hashed as keccak256 of registry and serial range. Two ways to bind nullifiers. `record` stores every nullifier and reverts if one is reused. `recordRoot` stores only the Merkle root, at constant gas regardless of serial count. Events: `CheckRecorded`, `SerialBound`, `DoubleClaim`.

## What the contract does not do

- It does not verify that the report contents are true. It stores a hash of the report, not the report itself.
- It does not mint, hold or retire credits. Credits are retired in their own registry. This contract only anchors the check report and the serial ranges behind a claim. A reused serial range is rejected by `record`; with `recordRoot` it is recorded and only flagged once someone calls `challenge`.

## Roles

`DEFAULT_ADMIN_ROLE` can call `grantRole` and `revokeRole`. `ATTESTER_ROLE` can call `record` and `recordRoot`; no other address can record a check. The constructor grants both roles to the deployer.

Consequence: while one key holds both roles, that key decides what is recorded, and the admin key can make any address an attester. Each attester records on its own, so adding a second attester adds a second key that can record alone; it does not split the decision. Option to reduce this risk, not current state: grant both roles to a multisig, then revoke them from the deployer key. Both are ordinary `grantRole` / `revokeRole` calls; the contract adds no checks of its own on top.

## What anyone can do

- Call `challenge(nullifier, idA, proofA, idB, proofB)` to show that one serial range backs two checks. Two Merkle proofs are needed; for a strict `record` entry the stored binding is checked instead of a proof. No role is required. The earlier check stays as recorded, the later one is flagged `doubleClaim`.
- Read every check, every bound nullifier and every event.
- Recompute `reportHash` from the report at `uri` and `serialRoot` from its serial list, and compare both against the stored values.

## Limits

- Double claims are detected only among the checks recorded in this contract. The contract does not see retirements or claims in Verra, Gold Standard or any other registry.
- With `recordRoot`, the contract flags nothing by itself. A double claim stays unflagged until someone submits the two proofs to `challenge`. Netra runs a watcher that does this (`contracts/scripts/live-watcher.js`); if it stops, anyone else can still challenge.
- The contract does not check how `reportHash` was computed. Netra's rule is `reportHash` in `web/app.js`; the same report serialized another way gives a different hash. `serialRoot` depends on the exact text of each serial range; list order and duplicates do not change it (`contracts/scripts/merkle.js`).

## What this system cannot prove

1. That the report behind a `reportHash` is accurate. The contract stores a hash and never reads the report.
2. That the serial ranges behind a check exist in a registry or were retired as stated. The contract queries nothing outside itself.
3. That an attester verified anything before recording. Only the recording address is visible.

## Deployment

Ethereum Sepolia testnet, [`0x8cac16962d34c6B6A302E7A05AEc9131d3E33909`](https://sepolia.etherscan.io/address/0x8cac16962d34c6B6A302E7A05AEc9131d3E33909). The web app reads the active deployment from `web/data/deployment.json`; the report and serial list of each recorded check are in `web/data/checks/`.
