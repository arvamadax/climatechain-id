// Live demo of double-claim detection: publishes a made-up claimant that reuses a few serial ranges from an
// existing check. Nothing else is done here; the live watcher on the server finds the reuse and flags it on-chain.
// Usage: FROM=4 RANGES=5 npx hardhat run scripts/demo-duplicate.js --network sepolia
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { root, nullifier } = require("./merkle");
const { registryAddress } = require("./record");

const CHECKS = path.join(__dirname, "..", "..", "web", "data", "checks");

async function main() {
  const from = JSON.parse(fs.readFileSync(path.join(CHECKS, `${process.env.FROM || 4}.json`), "utf8"));
  const serials = from.serials.slice(0, Number(process.env.RANGES || 5));
  const { ethers } = hre;
  const reg = await ethers.getContractAt("ClaimRegistry", registryAddress(hre.network.name));
  const id = Number(await reg.count());
  const name = `Demo duplicate claimant #${id} (not a real company)`;
  const report = { n: name, note: `reuses ${serials.length} serial ranges from check #${from.id}` };
  const tx = await reg.recordRoot(ethers.id(name), ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(report))),
    `data/checks/${id}.json`, root(serials.map(nullifier)), serials.length);
  await tx.wait();
  fs.writeFileSync(path.join(CHECKS, `${id}.json`), JSON.stringify({ id, buyer: name, index: -1, tx: tx.hash, serialRoot: root(serials.map(nullifier)), serials, report }));
  console.log({ id, name, tx: tx.hash, reusedFrom: from.id });
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
