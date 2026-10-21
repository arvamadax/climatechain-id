// Netra live watcher: runs all the time (runit service on the server). Every 30 s it reads new checks from
// ClaimRegistry, loads each check's serial list, verifies it against the on-chain Merkle root, and when one serial
// range backs two checks it submits the two Merkle proofs so the contract flags the later check. The contract
// verifies both proofs itself, so a wrong challenge cannot succeed.
// Env: PRIVATE_KEY, REGISTRY (address), CHAIN_ID, RPC_URLS (comma list), CHECKS_DIR (local folder that serves
// data/checks), MIN_BALANCE_ETH (default 0.05). Usage: node live-watcher.js
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { proof, nullifier, root } = require("./merkle");

const ABI = [
  "function count() view returns (uint256)",
  "function checks(uint256) view returns (bytes32 subject, bytes32 reportHash, bytes32 serialRoot, uint32 serialCount, uint64 timestamp, address attester, bool doubleClaim, string uri)",
  "function challenge(bytes32 nullifier, uint256 idA, bytes32[] proofA, uint256 idB, bytes32[] proofB)",
];
const env = process.env;
const RPCS = (env.RPC_URLS || "").split(",").map((s) => s.trim()).filter(Boolean);
const MIN = ethers.parseEther(env.MIN_BALANCE_ETH || "0.05");
const log = (o) => console.log(JSON.stringify({ t: new Date().toISOString(), ...o }));

let reg = null, wallet = null;
async function connect() {
  for (const url of RPCS) {
    try {
      const p = new ethers.JsonRpcProvider(url, Number(env.CHAIN_ID), { staticNetwork: true });
      const w = new ethers.Wallet(env.PRIVATE_KEY, p);
      const r = new ethers.Contract(env.REGISTRY, ABI, w);
      await r.count();
      log({ event: "connected", rpc: new URL(url).host });
      return ([reg, wallet] = [r, w]);
    } catch { /* next node */ }
  }
  throw new Error("no RPC answered");
}

async function serials(uri) {
  if (/^https?:\/\//.test(uri)) return (await (await fetch(uri)).json()).serials;
  return JSON.parse(fs.readFileSync(path.join(env.CHECKS_DIR, path.basename(uri)), "utf8")).serials;
}

const seen = new Map(); // nullifier -> { id, ns }
const loaded = [];      // checks already read: { id, ns, flagged }
async function tick() {
  if (!reg) await connect();
  const n = Number(await reg.count());
  for (let id = loaded.length; id < n; id++) {
    const c = await reg.checks(id);
    let ns = [];
    try {
      ns = (await serials(c.uri)).map(nullifier);
      if (ns.length && root(ns) !== c.serialRoot) { log({ event: "root_mismatch", id }); ns = []; }
    } catch (e) { log({ event: "serials_unavailable", id, error: String(e.message || e) }); return; } // retry next tick
    loaded.push({ id, ns, flagged: c.doubleClaim });
    log({ event: "check", id, ranges: ns.length, flagged: c.doubleClaim });
    for (const x of ns) {
      const first = seen.get(x);
      if (!first) { seen.set(x, { id, ns }); continue; }
      if (loaded[id].flagged) continue;
      const bal = await wallet.provider.getBalance(wallet.address);
      if (bal < MIN) { log({ event: "low_balance", eth: ethers.formatEther(bal), id }); continue; }
      const tx = await reg.challenge(x, first.id, proof(first.ns, x), id, proof(ns, x));
      await tx.wait();
      loaded[id].flagged = true;
      log({ event: "double_claim_flagged", earlier: first.id, later: id, tx: tx.hash });
    }
  }
}

async function loop() {
  try { await tick(); } catch (e) { reg = null; log({ event: "error", error: String(e.message || e) }); }
  setTimeout(loop, 30000);
}

if (require.main === module) {
  for (const k of ["PRIVATE_KEY", "REGISTRY", "CHAIN_ID", "RPC_URLS", "CHECKS_DIR"]) if (!env[k]) throw new Error(`missing ${k}`);
  log({ event: "start", registry: env.REGISTRY });
  loop();
}
