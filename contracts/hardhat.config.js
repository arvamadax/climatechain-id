require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const privateKey = process.env.PRIVATE_KEY;
const amoyRpc = process.env.POLYGON_AMOY_RPC_URL || "https://polygon-amoy-bor-rpc.publicnode.com";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    local: { url: "http://127.0.0.1:8545", chainId: 31337 },
    amoy: {
      url: amoyRpc,
      chainId: 80002,
      accounts: privateKey && privateKey.length === 66 ? [privateKey] : []
    }
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
