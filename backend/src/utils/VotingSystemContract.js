import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";

// Read ABI dynamically
const contractABI = JSON.parse(
  readFileSync(
    new URL("../../artifacts/contracts/VotingSystem.sol/VotingSystem.json", import.meta.url)
  )
);

// Connect to Ethereum
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.VOTING_SYSTEM_CONTRACT_ADDRESS, contractABI.abi, wallet);

export { contract };
