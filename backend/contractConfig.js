require("dotenv").config();
const { ethers } = require("ethers");

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

// Setup provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load contract ABI
const contractABI = require("./contractABI.json");  // ABI file

// Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

module.exports = contract;
