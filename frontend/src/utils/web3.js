const ethers = require("ethers");

export async function initWeb3Provider() {
    let provider;

    console.log(`initWeb3Provider: INFURA_ENDPOINT=${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`);
    
    if (typeof window !== 'undefined' && window.ethereum) {
        // Use Web3Provider if MetaMask is available
        provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        // Fallback to JsonRpcProvider with your Infura endpoint
        provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_ENDPOINT);
    }
    console.log(`initWeb3Provider: ${provider ? 'Initialized' : 'Not initialized'}`);

    return provider;
}
