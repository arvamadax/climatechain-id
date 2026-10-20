require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const privateKey = process.env.PRIVATE_KEY;
const chains = require("./scripts/chains");
const accounts = privateKey && privateKey.length === 66 ? [privateKey] : [];

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
    sepolia: { url: process.env.SEPOLIA_RPC_URL || chains.sepolia.rpc, chainId: 11155111, accounts },
    baseSepolia: { url: process.env.BASE_SEPOLIA_RPC_URL || chains.baseSepolia.rpc, chainId: 84532, accounts },
    amoy: { url: process.env.POLYGON_AMOY_RPC_URL || chains.amoy.rpc, chainId: 80002, accounts }
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
