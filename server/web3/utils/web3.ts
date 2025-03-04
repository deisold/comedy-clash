import { ethers } from "ethers";
import { WebSocketProvider, Provider } from "@ethersproject/providers";
import type { Network } from "@ethersproject/networks";
// import type { Provider } from "@ethersproject/providers";


/**
 * Initializes a Web3 Infura provider
 * @returns {Promise<Provider>} The initialized provider
 */
export async function initWeb3Provider(): Promise<Provider> {
    const infuraEndpointWs = process.env.INFURA_ENDPOINT_WS as string;
    console.log(`initWeb3Provider: INFURA_ENDPOINT_WS=${infuraEndpointWs}`);
    try {
        // Setup read-only JsonRpcProvider
        console.log("initWeb3Provider: using WebSocketProvider(infura)");
        const localProvider = new WebSocketProvider(infuraEndpointWs);
        console.log(`initWeb3Provider: Provider initialized successfully: provider=${localProvider}`);
        return localProvider;
    } catch (error) {
        console.error('initWeb3Provider: Failed to initialize provider', error);
        throw error;
    }
}

/**
 * Gets the current network details
 * @param {ethers.Provider} provider The provider to get the network from
 * @returns {Promise<Network|null>}
 */
export async function getNetwork(provider: ethers.providers.Provider): Promise<Network | null> {
    if (!provider) return null;
    try {
        return await provider.getNetwork();
    } catch (error) {
        console.error('getNetwork: Failed to get network', error);
        return null;
    }
}

export function generateRandomHash(): string {
    const length = 64; // 32 bytes in hexadecimal
    const characters = 'abcdef0123456789';
    let result = '0x';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}
