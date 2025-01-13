// frontend/src/adapters/MockComedyTheaterAdapter.ts
import { ComedyTheaterAdapterType } from "./ComedyTheaterAdapterType";
import { MockTransactionResponse } from "./MockTransactionResponse";

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MockComedyTheaterAdapter = (): ComedyTheaterAdapterType => {
    let amount: bigint = BigInt(5);
    return {
        getShowAmount: async () => amount,
        getShowAdress: async (index: number) => index.toString(),
        addShow: async (description: string, durationInDays: number) => {
            await delay(1000);
            amount++;
            return { wait: async () => ({}) } as MockTransactionResponse;
        },
        isManager: async () => true,
    }
}