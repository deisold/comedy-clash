const ethers = require("ethers");
import ComedyClashJSON from "../utils/ComedyClash.json"

export const ComedyClashAdapter = (web3Provider, address) => {
    let contract;

    async function getContract(web3Provider, address) {
        return contract || (contract = new ethers.Contract(
            address,
            ComedyClashJSON.abi,
            web3Provider
        ));
    }

    return {
        getDescription: async () => (await getContract()).description(),
        isClosed: async () => (await getContract()).closed(),
        getSubmissionCount: async () => (await getContract()).submissionCount(),
    }
}
