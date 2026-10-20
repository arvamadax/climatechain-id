// Netra watcher: find serial ranges that back more than one published claim and, with CHALLENGE=1,
// submit the Merkle proofs on-chain so the later claim is flagged as a double claim.
// Usage: [CHALLENGE=1] npx hardhat run scripts/watch.js --network amoy
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { proof, nullifier } = require("./merkle");

const DIR = path.join(__dirname, "..", "..", "web", "data", "checks");

async function main() {
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")) : [];
  const checks = files.map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))).sort((a, b) => a.id - b.id);
  const seen = new Map(); // nullifier -> check
  const overlaps = [];
  for (const c of checks) {
    c.ns = c.serials.map(nullifier);
    for (const [k, n] of c.ns.entries()) {
      if (seen.has(n)) overlaps.push({ n, serial: c.serials[k], earlier: seen.get(n), later: c });
      else seen.set(n, c);
    }
  }
  console.log(`${checks.length} published checks, ${seen.size} distinct serial ranges, ${overlaps.length} reused`);
  for (const o of overlaps) console.log(`  ${o.serial}: claim #${o.earlier.id} (${o.earlier.buyer}) and #${o.later.id} (${o.later.buyer})`);
  if (!process.env.CHALLENGE || !overlaps.length) return;

  const { claimRegistry } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "deployments", `${hre.network.name}.json`), "utf8"));
  const reg = await hre.ethers.getContractAt("ClaimRegistry", claimRegistry);
  for (const o of overlaps) {
    if ((await reg.checks(o.later.id)).doubleClaim) continue;
    const tx = await reg.challenge(o.n, o.earlier.id, proof(o.earlier.ns, o.n), o.later.id, proof(o.later.ns, o.n));
    await tx.wait();
    console.log(`  flagged claim #${o.later.id}: ${tx.hash}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
