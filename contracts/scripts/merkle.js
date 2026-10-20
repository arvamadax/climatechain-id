// Sorted-pair Merkle tree matching OpenZeppelin MerkleProof. Leaves: keccak256(nullifier).
const { ethers } = require("ethers");

const leaf = (n) => ethers.keccak256(n);
const pair = (a, b) => ethers.keccak256(ethers.concat(a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]));

function tree(nullifiers) {
  let level = [...new Set(nullifiers.map(leaf))].sort();
  const levels = [level];
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) next.push(i + 1 < level.length ? pair(level[i], level[i + 1]) : level[i]);
    levels.push((level = next));
  }
  return levels;
}

const root = (nullifiers) => tree(nullifiers).at(-1)[0];

function proof(nullifiers, nullifier) {
  const levels = tree(nullifiers);
  let idx = levels[0].indexOf(leaf(nullifier));
  if (idx < 0) throw new Error("nullifier not in tree");
  const out = [];
  for (const level of levels.slice(0, -1)) {
    const sib = idx ^ 1;
    if (sib < level.length) out.push(level[sib]);
    idx >>= 1;
  }
  return out;
}

const nullifier = (s) => {
  const [reg, ...rest] = s.split(":");
  return ethers.solidityPackedKeccak256(["string", "string"], [reg, rest.join(":")]);
};

module.exports = { root, proof, nullifier, leaf };
