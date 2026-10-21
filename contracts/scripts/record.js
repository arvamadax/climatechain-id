// Publish a Netra check on-chain (Merkle root mode: constant gas for any number of serial ranges).
// Usage: BUYER="Delta Air Lines" SERIALS=path/to/serials.json npx hardhat run scripts/record.js --network amoy
// Writes web/data/checks/<id>.json with the report and serial list so anyone can recompute both hashes.
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { root, nullifier } = require("./merkle");

const DATA = path.join(__dirname, "..", "..", "web", "data");

// Deployed address: contracts/deployments/<network>.json, else the web app's deployment for that network.
function registryAddress(network) {
  const f = path.join(__dirname, "..", "deployments", `${network}.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8")).claimRegistry;
  const web = JSON.parse(fs.readFileSync(path.join(DATA, "deployment.json"), "utf8"));
  if (web.network !== network) throw new Error(`no deployment for ${network}`);
  return web.address;
}

async function main() {
  const name = process.env.BUYER;
  if (!name) throw new Error("Set BUYER to the exact buyer name shown in Netra.");
  const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
  const i = index.rows.findIndex((r) => r[0] === name);
  if (i < 0) throw new Error(`Buyer not found: ${name}`);
  const owner = JSON.parse(fs.readFileSync(path.join(DATA, "o", `${Math.floor(i / index.shard)}.json`), "utf8"))[i % index.shard];
  const serials = process.env.SERIALS ? JSON.parse(fs.readFileSync(process.env.SERIALS, "utf8")) : [];
  if (!serials.length) throw new Error("Set SERIALS to a JSON list of registry serial ranges (pipeline/serials.py).");

  const { ethers } = hre;
  const subject = ethers.id(owner.n);
  const report = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(owner)));
  const serialRoot = root(serials.map(nullifier));
  const claimRegistry = registryAddress(hre.network.name);
  const reg = await ethers.getContractAt("ClaimRegistry", claimRegistry);
  const id = Number(await reg.count());
  const uri = `data/checks/${id}.json`;

  const tx = await reg.recordRoot(subject, report, uri, serialRoot, serials.length);
  const rc = await tx.wait();
  fs.mkdirSync(path.join(DATA, "checks"), { recursive: true });
  fs.writeFileSync(path.join(DATA, "checks", `${id}.json`),
    JSON.stringify({ id, buyer: owner.n, index: i, tx: tx.hash, serialRoot, serials, report: owner }));
  console.log({ id, buyer: owner.n, tx: tx.hash, gas: rc.gasUsed.toString(), serialRanges: serials.length, serialRoot, report });
}

module.exports = { registryAddress };

if (require.main === module) main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
