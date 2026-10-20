const { expect } = require("chai");
const { ethers } = require("hardhat");
const { root, proof, nullifier } = require("../scripts/merkle");

describe("ClaimRegistry", function () {
  let reg, owner, other;
  const subject = ethers.id("Shell");
  const report = ethers.id("report-v1");
  const serials = Array.from({ length: 700 }, (_, i) => `VCS:11550-${339200000 + i * 100}-${339200099 + i * 100}`);
  const ns = serials.map(nullifier);

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    reg = await (await ethers.getContractFactory("ClaimRegistry")).deploy();
  });

  describe("strict record", function () {
    it("records a check and binds serial ranges to it", async function () {
      await expect(reg.record(subject, report, "ipfs://r1", [ns[0]]))
        .to.emit(reg, "CheckRecorded").withArgs(0, subject, report, ethers.ZeroHash, 1, "ipfs://r1")
        .and.to.emit(reg, "SerialBound").withArgs(ns[0], 0);
      expect((await reg.checks(0)).reportHash).to.equal(report);
      expect(await reg.claimedBy(ns[0])).to.equal(1);
    });

    it("rejects a serial range already used by another claim", async function () {
      await reg.record(subject, report, "", [ns[0]]);
      await expect(reg.record(ethers.id("Other"), ethers.id("r2"), "", [ns[0]]))
        .to.be.revertedWithCustomError(reg, "AlreadyClaimed").withArgs(ns[0], 0);
    });

    it("rejects a duplicate inside one call and empty hashes", async function () {
      await expect(reg.record(subject, report, "", [ns[1], ns[1]])).to.be.revertedWithCustomError(reg, "AlreadyClaimed");
      await expect(reg.record(ethers.ZeroHash, report, "", [])).to.be.revertedWithCustomError(reg, "EmptyHash");
    });
  });

  describe("Merkle root record", function () {
    it("costs the same gas for 700 serial ranges as for 1", async function () {
      await reg.recordRoot(ethers.id("warm-up"), report, "u", root([ns[1]]), 1); // first push initialises storage
      const big = await (await reg.recordRoot(subject, report, "u", root(ns), ns.length)).wait();
      const small = await (await reg.recordRoot(ethers.id("B"), report, "u", root([ns[0]]), 1)).wait();
      expect(big.gasUsed - small.gasUsed).to.be.lessThan(2000n);
      expect(big.gasUsed).to.be.lessThan(200000n);
    });

    it("flags the later claim when a serial range appears in two roots", async function () {
      await reg.recordRoot(subject, report, "a", root(ns.slice(0, 400)), 400);
      await reg.recordRoot(ethers.id("Other"), ethers.id("r2"), "b", root(ns.slice(390, 700)), 310);
      const n = ns[395];
      await expect(reg.connect(other).challenge(n, 0, proof(ns.slice(0, 400), n), 1, proof(ns.slice(390, 700), n)))
        .to.emit(reg, "DoubleClaim").withArgs(n, 0, 1, other.address);
      expect((await reg.checks(1)).doubleClaim).to.equal(true);
      expect((await reg.checks(0)).doubleClaim).to.equal(false);
    });

    it("rejects a challenge with a serial that is not in both claims", async function () {
      await reg.recordRoot(subject, report, "a", root(ns.slice(0, 400)), 400);
      await reg.recordRoot(ethers.id("Other"), ethers.id("r2"), "b", root(ns.slice(400, 700)), 300);
      const n = ns[10];
      await expect(reg.challenge(n, 0, proof(ns.slice(0, 400), n), 1, []))
        .to.be.revertedWithCustomError(reg, "BadChallenge");
      await expect(reg.challenge(n, 0, [], 0, [])).to.be.revertedWithCustomError(reg, "BadChallenge");
    });

    it("detects overlap between a root claim and a strict claim", async function () {
      await reg.record(subject, report, "", [ns[5]]);
      await reg.recordRoot(ethers.id("Other"), ethers.id("r2"), "b", root(ns.slice(0, 50)), 50);
      await expect(reg.challenge(ns[5], 0, [], 1, proof(ns.slice(0, 50), ns[5]))).to.emit(reg, "DoubleClaim");
    });
  });

  it("only attesters can record", async function () {
    await expect(reg.connect(other).recordRoot(subject, report, "", root([ns[0]]), 1))
      .to.be.revertedWithCustomError(reg, "AccessControlUnauthorizedAccount");
    await reg.grantRole(await reg.ATTESTER_ROLE(), other.address);
    await expect(reg.connect(other).recordRoot(subject, report, "", root([ns[0]]), 1)).to.emit(reg, "CheckRecorded");
  });
});
