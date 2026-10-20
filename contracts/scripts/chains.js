// Public RPC and block explorer per network; written to web/data/deployment.json for the web app.
module.exports = {
  local: { label: "local Hardhat chain", rpc: "http://127.0.0.1:8545", explorer: "" },
  hardhat: { label: "in-process Hardhat chain", rpc: "", explorer: "" },
  sepolia: { label: "Ethereum Sepolia testnet", rpc: "https://ethereum-sepolia-rpc.publicnode.com", explorer: "https://sepolia.etherscan.io" },
  baseSepolia: { label: "Base Sepolia testnet", rpc: "https://base-sepolia-rpc.publicnode.com", explorer: "https://sepolia.basescan.org" },
  amoy: { label: "Polygon Amoy testnet", rpc: "https://polygon-amoy-bor-rpc.publicnode.com", explorer: "https://amoy.polygonscan.com" },
};
