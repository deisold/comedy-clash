import { ComedyTheaterAdapter } from "../adapters/ComedyTheaterAdapter";
import { ComedyTheaterAdapterType } from "../adapters/ComedyTheaterAdapterType";

export const ComedyTheaterRepo = (comedyTheaterAdapter: ComedyTheaterAdapterType) => ({
    getShowAmount: async (): Promise<number> => Number(await comedyTheaterAdapter.getShowAmount()),
    getShowAdress: async (index: number): Promise<string> => comedyTheaterAdapter.getShowAdress(index),
    addShow: async (description: string, durationInDays: number): Promise<void> =>
        comedyTheaterAdapter.addShow(description, durationInDays),
    isManager: async (): Promise<boolean> => comedyTheaterAdapter.isManager(),
}
)