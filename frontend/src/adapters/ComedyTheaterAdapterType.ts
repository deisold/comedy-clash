// frontend/src/adapters/ComedyTheaterAdapterType.ts

interface ComedyTheaterAdapterType {
    getShowAmount: () => Promise<bigint>;
    getShowAdress: (index: number) => Promise<string>;
    addShow: (description: string, durationInDays: number) => Promise<void>;
    isManager: () => Promise<boolean>;
}

export type { ComedyTheaterAdapterType };