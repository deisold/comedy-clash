import { Provider } from "ethers";
import { ComedyClashAdapterType } from "../adapters/ComedyClashAdapterType";
import { Submission } from "../data/submission";

export type ComedyClashRepoType = {
    getPrecision: (address: string) => Promise<bigint>;
    getDescription: (address: string) => Promise<string>;
    isClosed: (address: string) => Promise<boolean>;
    getSubmissionCount: (address: string) => Promise<number>;
    getSubmission: (address: string, index: number) => Promise<Submission>;
    createVotingForSubmission: (address: string, index: number, voterName: string, comment: string, value: number) => Promise<any>;
    closeSubmission: (address: string) => Promise<any>;
}

export const ComedyClashRepo = (
    web3Provider: Provider,
    comedyTheaterAdapterfabric: (web3Provider: Provider, address: string) => ComedyClashAdapterType): ComedyClashRepoType => {
    const adapters = new Map<string, ComedyClashAdapterType>();

    async function getAdapter(address: string): Promise<ComedyClashAdapterType> {
        return adapters.get(address)
            ?? (adapters.set(address, comedyTheaterAdapterfabric(web3Provider, address)), adapters.get(address) as ComedyClashAdapterType);
    }

    return {
        getPrecision: async (address: string): Promise<bigint> => (await getAdapter(address)).getPrecision(),
        getDescription: async (address: string): Promise<string> => (await getAdapter(address)).getDescription(),
        isClosed: async (address: string): Promise<boolean> => (await getAdapter(address)).isClosed(),
        getSubmissionCount: async (address: string): Promise<number> => (Number(await (await getAdapter(address)).getSubmissionCount())),
        getSubmission: async (address: string, index: number) => (await getAdapter(address)).getSubmission(index),
        createVotingForSubmission: async (address: string, index: number, voterName: string, comment: string, value: number) =>
            (await getAdapter(address)).createVotingForSubmission(index, voterName, comment, BigInt(value)),
        closeSubmission: async (address: string) => (await getAdapter(address)).closeSubmission(),
    }

}
