import { ComedyTheaterAdapterType } from "../adapters/ComedyTheaterAdapterType";

export type ComedyTheaterRepoType = {
    getShowAmount: () => Promise<number>;
    getShowAdress: (index: number) => Promise<string>;
    addShow: (description: string, durationInDays: number) => Promise<void>;
    isManager: () => Promise<boolean>;
}

export const ComedyTheaterRepo = (comedyTheaterAdapter: ComedyTheaterAdapterType): ComedyTheaterRepoType => ({
    getShowAmount: async (): Promise<number> => Number(await comedyTheaterAdapter.getShowAmount()),
    getShowAdress: async (index: number): Promise<string> => comedyTheaterAdapter.getShowAdress(index),
    addShow: async (description: string, durationInDays: number): Promise<void> =>
        comedyTheaterAdapter.addShow(description, durationInDays),
    isManager: async (): Promise<boolean> => comedyTheaterAdapter.isManager(),
}
)