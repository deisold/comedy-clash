// frontend/src/adapters/MockComedyTheaterAdapter.ts
import { ComedyTheaterAdapterType } from "./ComedyTheaterAdapterType";
import { createDelayedMockResponse as createDelayedMockResponse, defaultDelayMS } from "./MockTransactionResponse";

const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MockComedyTheaterAdapter = (): ComedyTheaterAdapterType => {
    let amount: bigint = BigInt(5);
    return {
        getShowAmount: async () => amount,
        getShowAdress: async (index: number) => "0x0e6877867689768",
        // getShowAdress: async (index: number) => index.toString(),
        addShow: async (description: string, durationInDays: number) => {
            await delay(defaultDelayMS);
            amount++;
            return createDelayedMockResponse();
        },
        isManager: async () => true,
    }
}