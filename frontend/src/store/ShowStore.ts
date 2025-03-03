import { create } from 'zustand';
import { Show } from '@/data/Show';
//
interface UserMappingType {
    index: number;
    address: string;
    data: Show;
}

export interface ShowStoreType {
    showMapping: UserMappingType[];
    storeShows: (shows: Show[]) => void;
    setShowForIndex: (index: number, show: Show) => void;
    getShowForIndex: (index: number) => Show | null;
    updateShowAddress: (txHash: string, address: string) => void;
}

export const useShowStore = create<ShowStoreType>((set, get) => ({
    showMapping: [],
    storeShows: (shows: Show[]) => set({ showMapping: shows.map((show, index) => ({ index, address: show.id, data: show })) }),
    setShowForIndex: (index: number, show: Show) => set((state) => ({
        showMapping: [...state.showMapping,
        { index, address: show.id, data: show }]
    })),
    getShowForIndex: (index: number) => {
        const showEntry = get().showMapping.find((userMapping) => userMapping.index === index);
        return showEntry ? showEntry.data : null;
    },
    updateShowAddress: (txHash: string, address: string) => set((state) => ({
        showMapping: state.showMapping.map((userMapping) => userMapping.address === txHash ? { ...userMapping, address } : userMapping)
    })),
}));