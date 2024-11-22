// frontend/src/adapters/MockComedyTheaterAdapter.ts
import { ComedyTheaterAdapterType } from "./ComedyTheaterAdapterType";

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
        },
        isManager: async () => true,
    }
}