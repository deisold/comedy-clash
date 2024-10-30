const ethers = require("ethers");
import dotenv from 'dotenv';

dotenv.config();

const { INFURA_ENDPOINT } = process.env;

export async function initWeb3Provider() {
    let provider;
    if (typeof window !== 'undefined' && window.ethereum) {
        // Use Web3Provider if MetaMask is available
        provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        // Fallback to JsonRpcProvider with your Infura endpoint
        provider = new ethers.JsonRpcProvider(INFURA_ENDPOINT);
    }
    console.log(`initWeb3Provider: ${provider ? 'Initialized' : 'Not initialized'}`);

    return provider;
}
