const { ethers } = require("ethers");
import ComedyClashJSON from "../utils/ComedyClash.json"

export const ComedyClashAdapter = (web3Provider, address) => {
    let contract;

    async function getContract() {
        return contract || (contract = new ethers.Contract(
            address,
            ComedyClashJSON.abi,
            web3Provider
        ));
    }

    return {
        getPrecision: async () => (await getContract()).PRECISION(),
        getDescription: async () => (await getContract()).description(),
        isClosed: async () => (await getContract()).closed(),
        getSubmissionCount: async () => (await getContract()).submissionCount(),

        getSubmission: async (index) => {
            const submission = (await getContract()).submissions(index);

            return ({
                id: submission.id,
                artistAddress: submission.artist,
                name: submission.name,
                topic: submission.topic,
                preview: submission.preview,
                votes: submission.votes,
                averageTotal: submission.averageTotal,
                averageCount: submission.averageCount,
                averageValue: ethers.BigNumber.from(submission.averageValue),
            })
        }
    }
}
