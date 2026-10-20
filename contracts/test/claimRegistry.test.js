const { expect } = require("chai");
const { ethers } = require("hardhat");

const serial = (registry, range) => ethers.solidityPackedKeccak256(["string", "string"], [registry, range]);

describe("ClaimRegistry", function () {
  let reg, owner, other;
  const subject = ethers.id("shell");
  const report = ethers.id("report-v1");

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    reg = await (await ethers.getContractFactory("ClaimRegistry")).deploy();
  });

  it("records a check and binds serial ranges to it", async function () {
    const n = serial("VCS", "11550-339200258-339200341");
    await expect(reg.record(subject, report, "ipfs://r1", [n]))
      .to.emit(reg, "CheckRecorded").withArgs(0, subject, report, "ipfs://r1", owner.address)
      .and.to.emit(reg, "SerialBound").withArgs(n, 0);
    const c = await reg.checks(0);
    expect(c.reportHash).to.equal(report);
    expect(await reg.claimedBy(n)).to.equal(1);
    expect(await reg.count()).to.equal(1);
  });

  it("rejects a serial range already used by another claim", async function () {
    const n = serial("VCS", "11550-339200258-339200341");
    await reg.record(subject, report, "ipfs://r1", [n]);
    await expect(reg.record(ethers.id("other co"), ethers.id("r2"), "ipfs://r2", [n]))
      .to.be.revertedWithCustomError(reg, "AlreadyClaimed").withArgs(n, 0);
  });

  it("rejects a duplicate inside one call", async function () {
    const n = serial("GS", "GS1-1-XZ-GS12303-17-2022-30775");
    await expect(reg.record(subject, report, "", [n, n])).to.be.revertedWithCustomError(reg, "AlreadyClaimed");
  });

  it("rejects empty hashes", async function () {
    await expect(reg.record(ethers.ZeroHash, report, "", [])).to.be.revertedWithCustomError(reg, "EmptyHash");
    await expect(reg.record(subject, ethers.ZeroHash, "", [])).to.be.revertedWithCustomError(reg, "EmptyHash");
  });

  it("only attesters can record", async function () {
    await expect(reg.connect(other).record(subject, report, "", [])).to.be.revertedWithCustomError(
      reg, "AccessControlUnauthorizedAccount");
    await reg.grantRole(await reg.ATTESTER_ROLE(), other.address);
    await expect(reg.connect(other).record(subject, report, "", [])).to.emit(reg, "CheckRecorded");
  });
});
