import { Provider, BigNumberish } from "ethers";
import { ComedyClashAdapter } from "../adapters/ComedyClashAdapter";

export const ComedyClashRepo = (
    web3Provider: Provider,
    comedyTheaterAdapterfabric: (web3Provider: Provider, address: string) => typeof ComedyClashAdapter) => {
    const adapters = new Map();

    async function getAdapter(address: string) {
        return adapters[address]
            || (adapters[address] = comedyTheaterAdapterfabric(web3Provider, address));
    }

    return {
        getPrecision: async (address: string): Promise<BigInt> => (await getAdapter(address)).getPrecision(),
        getDescription: async (address: string): Promise<string> => (await getAdapter(address)).getDescription(),
        isClosed: async (address: string): Promise<boolean> => (await getAdapter(address)).isClosed(),
        getSubmissionCount: async (address: string): Promise<number> => (Number(await (await getAdapter(address)).getSubmissionCount())),
        getSubmission: async (address: string, index: number) => (await getAdapter(address)).getSubmission(index),
        createVotingForSubmission: async (address: string, index: number, voterName: string, comment: string, value: BigNumberish) =>
            (await getAdapter(address)).createVotingForSubmission(index, voterName, comment, value),
        closeSubmission: async (address: string) => (await getAdapter(address)).closeSubmission(),
    }

}
