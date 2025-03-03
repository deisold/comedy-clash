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
    updateShow: (index: number, show: Partial<Show>) => void;
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
    updateShow: (index: number, show: Partial<Show>) => set((state) => ({
        showMapping: state.showMapping.map((userMapping) => userMapping.index === index ? { ...userMapping, data: { ...userMapping.data, ...show } } : userMapping)
    })),
}));