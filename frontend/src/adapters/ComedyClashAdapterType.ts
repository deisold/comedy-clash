// frontend/app/source/adapters/ComedyClashAdapterType.ts
import { BigNumberish } from "ethers";
import { Submission } from "../data/submission";

export type ComedyClashAdapterType = {
    getPrecision: () => Promise<BigInt>;
    getDescription: () => Promise<string>;
    isClosed: () => Promise<boolean>;
    getSubmissionCount: () => Promise<bigint>;
    getSubmission: (index: number) => Promise<Submission>;
    createVotingForSubmission: (index: number, voterName: string, comment: string, value: bigint) => Promise<void>;
    closeSubmission: () => Promise<any>;
}