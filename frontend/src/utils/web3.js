const ethers = require("ethers");

/**
 * Initializes a Web3 provider using either MetaMask or Infura fallback
 * @returns {Promise<ethers.Provider>} The initialized provider
 */
export async function initWeb3Provider() {
    let provider;
    
    console.log(`initWeb3Provider: INFURA_ENDPOINT=${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`);
    
    try {
        if (typeof window !== 'undefined' && window.ethereum) {
            // Use BrowserProvider (MetaMask)
            provider = new ethers.BrowserProvider(window.ethereum);
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            // Fallback to read-only JsonRpcProvider
            provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_ENDPOINT);
        }
        
        console.log('initWeb3Provider: Provider initialized successfully');
        return provider;
    } catch (error) {
        console.error('initWeb3Provider: Failed to initialize provider', error);
        throw error;
    }
}

/**
 * Checks if the provider is a write-enabled provider (MetaMask)
 * @param {ethers.Provider} provider The provider to check
 * @returns {boolean}
 */
export function isWriteProvider(provider) {
    return provider instanceof ethers.BrowserProvider;
}

/**
 * Gets the current signer if available
 * @param {ethers.Provider} provider The provider to get the signer from
 * @returns {Promise<ethers.Signer|null>}
 */
export async function getSigner(provider) {
    if (!isWriteProvider(provider)) return null;
    try {
        return await provider.getSigner();
    } catch (error) {
        console.error('getSigner: Failed to get signer', error);
        return null;
    }
}

/**
 * Gets the current network details
 * @param {ethers.Provider} provider The provider to get the network from
 * @returns {Promise<{chainId: number, name: string}|null>}
 */
export async function getNetwork(provider) {
    if (!provider) return null;
    try {
        return await provider.getNetwork();
    } catch (error) {
        console.error('getNetwork: Failed to get network', error);
        return null;
    }
}
