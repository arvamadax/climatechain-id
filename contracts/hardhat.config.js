require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const privateKey = process.env.PRIVATE_KEY;
const amoyRpc = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/";

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
