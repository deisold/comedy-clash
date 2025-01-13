import { Provider, Signer } from "ethers";
import { ComedyClashAdapterType } from "./ComedyClashAdapterType";
import { Submission } from "../data/submission";
import { MockTransactionResponse } from "./MockTransactionResponse";

export const MockComedyClashAdapter = (web3Provider: Provider, signer: Signer | null, address: string): ComedyClashAdapterType => {
    let submissions = 3;

    let closed = new Proxy<{ [key: string]: boolean }>(
        {},
        {
            get: (target, key: string): boolean => {
                return key !== '0';
            }
        }
    );

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    return ({
        getPrecision: async () => BigInt(10 ** 18),
        getDescription: async () => "Desc-" + address,
        isClosed: async () => closed[address],
        getSubmissionCount: async (): Promise<bigint> => BigInt(submissions),

        getSubmission: async (index: number): Promise<Submission> => ({
            id: index,
            artistAddress: String(900 + index),
            name: `Name${index}`,
            topic: `Topic${index}`,
            preview: `Preview${index}`,
            // votes: is not returned but also not needed
            averageTotal: index * 8,
            averageCount: index + 10,
            averageValue: BigInt(Math.floor(Math.random() * 401 + 100).toString() + Array(16).fill(0).map(() =>
                Math.floor(Math.random() * 10)).join('')),
        }),
        createVotingForSubmission: async (index: number, voterName: string, comment: string, value: bigint) => {
            await delay(1000);
            return { wait: async () => ({}) } as MockTransactionResponse;
        },
        createSubmissions: async (name: string, topic: string, preview: string) => {
            submissions++;
            await delay(1000);
            return { wait: async () => ({}) } as MockTransactionResponse;
        },
        closeSubmission: async () => {
            closed[address] = true;
            await delay(1000);
            return { wait: async () => ({}) } as MockTransactionResponse;
        }
    })
}