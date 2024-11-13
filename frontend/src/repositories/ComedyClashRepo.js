
export const ComedyClashRepo = (web3Provider, comedyTheaterAdapterfabric) => {
    const adapters = new Map();

    async function getAdapter(address) {
        return adapters[address]
            || (adapters[address] = comedyTheaterAdapterfabric(web3Provider, address));
    }

    return {
        getPrecision: async (address) => (await getAdapter(address)).getPrecision(),
        getDescription: async (address) => (await getAdapter(address)).getDescription(),
        isClosed: async (address) => (await getAdapter(address)).isClosed(),
        getSubmissionCount: async (address) => (await getAdapter(address)).getSubmissionCount(),
        getSubmission: async (address, index) => (await getAdapter(address)).getSubmission(index),
        createVotingForSubmission: async (address, index, voterName, comment, value) =>
            (await getAdapter(address)).createVotingForSubmission(index, voterName, comment, value),
        closeSubmission: async (address) => (await getAdapter(address)).closeSubmission(),
    }

}
