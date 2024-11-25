import { Provider, BigNumberish } from "ethers";
import { ComedyClash, ComedyClash__factory } from "../utils/types";
import { ComedyClashAdapterType } from "./ComedyClashAdapterType";


export const ComedyClashAdapter = (web3Provider: Provider, address: string): ComedyClashAdapterType => {
    let contract: ComedyClash | null = null;

    async function getContract() {
        return contract || ComedyClash__factory.connect(address, web3Provider);
    }

    return {
        getPrecision: async (): Promise<BigInt> => (await getContract()).PRECISION(),
        getDescription: async (): Promise<string> => (await getContract()).description(),
        isClosed: async (): Promise<boolean> => (await getContract()).closed(),
        getSubmissionCount: async (): Promise<bigint> => (await getContract()).submissionCount(),

        getSubmission: async (index: number) => {
            const submission = await (await getContract()).submissions(index);

            return ({
                id: submission.id,
                artistAddress: submission.artist,
                name: submission.name,
                topic: submission.topic,
                preview: submission.preview,
                // votes: is not returned but also not needed
                averageTotal: submission.averageTotal,
                averageCount: submission.averageCount,
                averageValue: BigInt(submission.averageValue),
            })
        },

        createVotingForSubmission: async (index: number, voterName: string, comment: string, value: bigint): Promise<void> => {
            (await getContract()).createVotingForSubmission(index, voterName, comment, value);
        },

        closeSubmission: async (): Promise<void> => {
            (await getContract()).closeSubmission();
        },
    }
}
