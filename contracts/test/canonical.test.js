const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { canonicalJSON } = require("../../web/canonical");

const hash = (o) => ethers.keccak256(ethers.toUtf8Bytes(canonicalJSON(o)));

describe("canonicalJSON", function () {
  it("sorts object keys recursively and identically for any input order", function () {
    const canonical = '{"a":{"c":3,"d":2},"b":1}';
    expect(canonicalJSON({ b: 1, a: { d: 2, c: 3 } })).to.equal(canonical);
    expect(canonicalJSON({ a: { c: 3, d: 2 }, b: 1 })).to.equal(canonical);
    expect(hash({ b: 1, a: { d: 2, c: 3 } })).to.equal(hash({ a: { c: 3, d: 2 }, b: 1 }));
  });

  it("keeps array order", function () {
    expect(canonicalJSON([3, 1, 2])).to.equal("[3,1,2]");
    expect(canonicalJSON({ z: [1, 2], a: [3, 1] })).to.equal('{"a":[3,1],"z":[1,2]}');
    expect(canonicalJSON({ a: null })).to.equal('{"a":null}');
  });

  it("matches the browser global build on a real owner record", function () {
    const src = fs.readFileSync(path.join(__dirname, "..", "..", "web", "canonical.js"), "utf8");
    const sandbox = {}; // no module: emulates the browser global
    vm.runInNewContext(src, sandbox);
    const rec = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "web", "data", "o", "0.json"), "utf8"))[0];
    const browser = ethers.keccak256(ethers.toUtf8Bytes(sandbox.canonicalJSON(rec)));
    expect(browser).to.equal(hash(rec));
    expect(sandbox.canonicalJSON(rec)).to.equal(canonicalJSON(rec));
  });
});
