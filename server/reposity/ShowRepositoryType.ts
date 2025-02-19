import { Show } from "./data/Show";
//
export type ShowRepositoryType = {
    getShow: (id: string | undefined) => Promise<Show | null>;
    createShow: (show: Show) => Promise<Show>;
    updateShow: (id: string, show: Show) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
};
