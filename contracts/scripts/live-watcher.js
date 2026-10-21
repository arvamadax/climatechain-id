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
    // A check counts as done only after its challenge went through: a failed tx or a low balance leaves it
    // unread, so the next tick tries again (re-reading doubleClaim, so a tx that landed is not sent twice).
    // ponytail: a low balance pauses every later check too; fine for one testnet key, per-check queue if that ever matters
    let flagged = c.doubleClaim;
    for (const x of ns) {
      const first = seen.get(x);
      if (!first || flagged) continue;
      const bal = await wallet.provider.getBalance(wallet.address);
      if (bal < MIN) { log({ event: "low_balance", eth: ethers.formatEther(bal), id }); return; }
      const tx = await reg.challenge(x, first.id, proof(first.ns, x), id, proof(ns, x));
      await tx.wait();
      flagged = true;
      log({ event: "double_claim_flagged", earlier: first.id, later: id, tx: tx.hash });
    }
    for (const x of ns) if (!seen.has(x)) seen.set(x, { id, ns });
    loaded.push({ id, ns, flagged });
    log({ event: "check", id, ranges: ns.length, flagged });
  }
}

async function loop() {
  try { await tick(); } catch (e) { reg = null; log({ event: "error", error: String(e.message || e) }); }
  setTimeout(loop, 30000);
}

// self-check: a challenge that fails once, and a low balance, are both retried on the next tick
async function check() {
  const dir = fs.mkdtempSync(path.join(require("os").tmpdir(), "watcher-"));
  const lists = [["VCS:1-10", "VCS:11-20"], ["VCS:11-20", "VCS:99"]];
  lists.forEach((s, i) => fs.writeFileSync(path.join(dir, `${i}.json`), JSON.stringify({ serials: s })));
  env.CHECKS_DIR = dir;
  const chain = lists.map((s, i) => ({ uri: `data/checks/${i}.json`, serialRoot: root(s.map(nullifier)), doubleClaim: false }));
  let balance = 0n, fail = 1, sent = 0;
  reg = { count: async () => chain.length, checks: async (id) => ({ ...chain[id] }),
    challenge: async (n, a, pa, b) => { if (fail-- > 0) throw new Error("rpc dropped"); sent++; chain[b].doubleClaim = true; return { hash: "0x1", wait: async () => {} }; } };
  wallet = { address: "0x0", provider: { getBalance: async () => balance } };
  const quiet = console.log; console.log = () => {};
  try {
    await tick(); // low balance: check 1 stays unread
    if (loaded.length !== 1) throw new Error("low balance should pause at check 1");
    balance = MIN;
    await tick().catch(() => {}); // challenge throws once
    if (loaded.length !== 1) throw new Error("a failed challenge must not mark the check done");
    await tick();
    if (loaded.length !== 2 || !loaded[1].flagged || sent !== 1 || !chain[1].doubleClaim) throw new Error("retry did not flag");
    await tick();
    if (sent !== 1) throw new Error("flagged twice");
  } finally { console.log = quiet; fs.rmSync(dir, { recursive: true, force: true }); }
  console.log("ok");
}

if (require.main === module && process.argv[2] === "--check") check().catch((e) => { console.error(e); process.exitCode = 1; });
else if (require.main === module) {
  for (const k of ["PRIVATE_KEY", "REGISTRY", "CHAIN_ID", "RPC_URLS", "CHECKS_DIR"]) if (!env[k]) throw new Error(`missing ${k}`);
  log({ event: "start", registry: env.REGISTRY });
  loop();
}
