import { Provider, Contract, BigNumberish } from "ethers";
import { ComedyClash__factory } from "../utils/types";

export const ComedyClashAdapter = (web3Provider: Provider, address: string) => {
    let contract: Contract | null = null;

    async function getContract() {
        return contract || ComedyClash__factory.connect(address, web3Provider);
    }

    return {
        getPrecision: async (): Promise<BigInt> => (await getContract()).PRECISION(),
        getDescription: async (): Promise<string> => (await getContract()).description(),
        isClosed: async (): Promise<boolean> => (await getContract()).closed(),
        getSubmissionCount: async (): Promise<number> => (await getContract()).submissionCount(),

        getSubmission: async (index: number) => {
            const submission = await (await getContract()).submissions(index);

            return ({
                id: submission.id,
                artistAddress: submission.artist,
                name: submission.name,
                topic: submission.topic,
                preview: submission.preview,
                votes: submission.votes,
                averageTotal: submission.averageTotal,
                averageCount: submission.averageCount,
                averageValue: BigInt(submission.averageValue),
            })
        },

        createVotingForSubmission: async (index: number, voterName: string, comment: string, value: BigNumberish): Promise<void> =>
            (await getContract()).createVotingForSubmission(index, voterName, comment, value),

        closeSubmission: async (): Promise<void> => (await getContract()).closeSubmission(),
    }
}
