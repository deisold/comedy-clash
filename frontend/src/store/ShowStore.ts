import { create } from 'zustand';
import { Show } from '@/data/Show';
//
interface UserMappingType {
    index: number;
    address: string;
    data: Show;
}

export interface ShowStoreType {
    showAmount: number;
    showMapping: UserMappingType[];
    setShowAmount: (amount: number) => void;
    storeShows: (shows: Show[]) => void;
    setShowForIndex: (index: number, show: Show) => void;
    getShowForIndex: (index: number) => Show | null;
    updateShowForIndex: (index: number, show: Partial<Show>) => void;
    updateShowForTxHash: (txHash: string, show: Partial<Show>) => void;
}

export const useShowStore = create<ShowStoreType>((set, get) => ({
    showAmount: 0,
    showMapping: [],
    setShowAmount: (amount: number) => set({ showAmount: amount }),
    storeShows: (shows: Show[]) => set({ showMapping: shows.map((show, index) => ({ index, address: show.id, data: show })) }),
    setShowForIndex: (index: number, show: Show) => set((state) => ({
        showMapping: [...state.showMapping,
        { index, address: show.id, data: show }]
    })),
    getShowForIndex: (index: number) => {
        const showEntry = get().showMapping.find((userMapping) => userMapping.index === index);
        return showEntry ? showEntry.data : null;
    },
    updateShowForIndex: (index: number, show: Partial<Show>) => set((state) => {
        console.log(`ShowStore::updateShowForIndex index=${index} update=${JSON.stringify(show)}`);
        return {
            showMapping: state.showMapping.map((userMapping) => userMapping.index === index ? { ...userMapping, data: { ...userMapping.data, ...show } } : userMapping)
        }
    }),
    updateShowForTxHash: (txHash: string, show: Partial<Show>) => set((state) => {
        console.log(`ShowStore::updateShowForTxHash txHash=${txHash} update=${JSON.stringify(show)}`);
        return {
            showMapping: state.showMapping.map((userMapping) => userMapping.address === txHash ? { ...userMapping, data: { ...userMapping.data, ...show } } : userMapping)
        }
    }),
}));