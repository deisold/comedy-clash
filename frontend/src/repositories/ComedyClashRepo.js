
export const ComedyClashRepo = (web3Provider, comedyTheaterAdapterfabric) => {
    const adapters = new Map();

    async function getAdapter(address) {
        return adapters[address]
            || (adapters[address] = comedyTheaterAdapterfabric(web3Provider, address));
    }

    return {
        getDescription: async (address) => {
            return await getAdapter(address).getDescription();
        }
    }
}
