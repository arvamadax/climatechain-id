// Publish a Netra check on-chain.
// Usage: BUYER="Delta Air Lines" SERIALS=path/to/serials.json npx hardhat run scripts/record.js --network amoy
// The report hash is keccak256 of JSON.stringify(owner record), exactly as the web app recomputes it.
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

const DATA = path.join(__dirname, "..", "..", "web", "data");
const BATCH = 150; // serial ranges per transaction, to stay under the block gas limit

async function main() {
  const name = process.env.BUYER;
  if (!name) throw new Error("Set BUYER to the exact buyer name shown in Netra.");
  const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
  const i = index.rows.findIndex((r) => r[0] === name);
  if (i < 0) throw new Error(`Buyer not found: ${name}`);
  const shard = JSON.parse(fs.readFileSync(path.join(DATA, "o", `${Math.floor(i / index.shard)}.json`), "utf8"));
  const owner = shard[i % index.shard];

  const { ethers } = hre;
  const subject = ethers.id(owner.n);
  const report = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(owner)));
  const serials = process.env.SERIALS ? JSON.parse(fs.readFileSync(process.env.SERIALS, "utf8")) : [];
  const nullifiers = serials.map((s) => {
    const [reg, ...rest] = s.split(":");
    return ethers.solidityPackedKeccak256(["string", "string"], [reg, rest.join(":")]);
  });

  const { claimRegistry } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "deployments", `${hre.network.name}.json`), "utf8"));
  const reg = await ethers.getContractAt("ClaimRegistry", claimRegistry);
  const uri = `netra://buyer/${i}`;
  // first transaction carries the report; any remaining serial ranges are bound in follow-up checks with the same report
  const chunks = [];
  for (let k = 0; k < Math.max(1, nullifiers.length); k += BATCH) chunks.push(nullifiers.slice(k, k + BATCH));
  for (const [k, chunk] of chunks.entries()) {
    const tx = await reg.record(subject, report, uri, chunk);
    const rc = await tx.wait();
    console.log(`${owner.n}: tx ${k + 1}/${chunks.length} ${tx.hash} (${chunk.length} serial ranges, gas ${rc.gasUsed})`);
  }
  console.log({ buyer: owner.n, index: i, subject, report, serialRanges: nullifiers.length });
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
