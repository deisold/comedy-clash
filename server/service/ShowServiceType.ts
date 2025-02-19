import { Show } from "../reposity/data/Show";
//
export interface ShowServiceType {
    getShow: (id: string) => Promise<Show | null>;
    createShow: (show: Show) => Promise<Show>;
    uploadImage: (id: string, imageName: string, fileBase64: string) => Promise<Show>;
    updateShow: (id: string, description: string, imageUrl: string | null) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
}
