// End-to-end publish: fresh ClaimRegistry, one published check per buyer in data/serials/,
// one simulated duplicate claim, and the watcher flagging it on-chain.
// Usage: npx hardhat node (other terminal) then npm run demo:local; or npm run demo:sepolia (needs PRIVATE_KEY + test ETH)
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { root, proof, nullifier } = require("./merkle");
const { canonicalJSON } = require("../../web/canonical");

const ROOT = path.join(__dirname, "..", "..");
const DATA = path.join(ROOT, "web", "data");
const SERIALS = path.join(ROOT, "data", "serials");
const DUPLICATE = "Demo duplicate claimant (not a real company)";

async function main() {
  const { ethers } = hre;
  const reg = await (await ethers.getContractFactory("ClaimRegistry")).deploy();
  await reg.waitForDeployment();
  const address = await reg.getAddress();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);
  const net = require("./chains")[hre.network.name];
  if (!net) throw new Error(`add ${hre.network.name} to scripts/chains.js`);
  fs.writeFileSync(path.join(DATA, "deployment.json"),
    JSON.stringify({ network: hre.network.name, chainId, address, ...net }, null, 2));

  const checksDir = path.join(DATA, "checks");
  fs.rmSync(checksDir, { recursive: true, force: true });
  fs.mkdirSync(checksDir, { recursive: true });

  const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
  const published = [];
  const publish = async (name, report, serials, idx) => {
    const ns = serials.map(nullifier);
    const id = Number(await reg.count());
    const tx = await reg.recordRoot(ethers.id(name), ethers.keccak256(ethers.toUtf8Bytes(canonicalJSON(report))),
      `data/checks/${id}.json`, root(ns), serials.length);
    const rc = await tx.wait();
    fs.writeFileSync(path.join(checksDir, `${id}.json`),
      JSON.stringify({ id, buyer: name, index: idx, tx: tx.hash, serialRoot: root(ns), serials, report }));
    published.push({ id, name, ns, serials });
    console.log(`#${id} ${name}: ${serials.length} serial ranges, gas ${rc.gasUsed}`);
  };

  for (const file of fs.readdirSync(SERIALS).filter((f) => f.endsWith(".json")).sort()) {
    const name = file.slice(0, -5);
    const serials = JSON.parse(fs.readFileSync(path.join(SERIALS, file), "utf8"));
    const i = index.rows.findIndex((r) => r[0] === name);
    if (i < 0 || !serials.length) { console.log(`skip ${name}: ${i < 0 ? "not in index" : "no serials"}`); continue; }
    const owner = JSON.parse(fs.readFileSync(path.join(DATA, "o", `${Math.floor(i / index.shard)}.json`), "utf8"))[i % index.shard];
    await publish(owner.n, owner, serials, i);
  }

  // Simulated fraud: a made-up claimant reuses 10 serial ranges from the largest published claim.
  const victim = published.reduce((a, b) => (b.serials.length > a.serials.length ? b : a));
  await publish(DUPLICATE, { n: DUPLICATE }, victim.serials.slice(0, 10).concat(["VCS:demo-unique-1"]), -1);

  // Watcher: find reused serial ranges and challenge on-chain.
  const seen = new Map();
  for (const c of published) {
    for (const n of c.ns) {
      if (!seen.has(n)) { seen.set(n, c); continue; }
      const first = seen.get(n);
      if ((await reg.checks(c.id)).doubleClaim) continue;
      await (await reg.challenge(n, first.id, proof(first.ns, n), c.id, proof(c.ns, n))).wait();
      console.log(`watcher: claim #${c.id} (${c.name}) reuses a serial range from #${first.id} (${first.name}) -> flagged`);
    }
  }
  console.log(`ClaimRegistry ${address} on chain ${chainId}; web/data/deployment.json updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
