const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const reg = await (await hre.ethers.getContractFactory("ClaimRegistry")).deploy();
  await reg.waitForDeployment();
  const address = await reg.getAddress();
  const out = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    claimRegistry: address,
    deployer: deployer.address,
    tx: reg.deploymentTransaction().hash,
    deployedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.join(__dirname, "..", "deployments"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "..", "deployments", `${hre.network.name}.json`), JSON.stringify(out, null, 2));
  // the web app reads its chain settings from web/data/deployment.json
  const web = { local: { rpc: "http://127.0.0.1:8545", explorer: "" }, amoy: { rpc: "https://polygon-amoy-bor-rpc.publicnode.com", explorer: "https://amoy.polygonscan.com" } }[hre.network.name];
  if (web) fs.writeFileSync(path.join(__dirname, "..", "..", "web", "data", "deployment.json"),
    JSON.stringify({ network: hre.network.name, chainId: out.chainId, address, ...web }, null, 2));
  console.log(out);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
