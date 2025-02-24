import { Show } from "@/data/Show";
import { ShowApiAdapterType } from "../adapters/api/ShowApiAdapter";
//
export type ShowRepositoryType = {
    getShow: (id: string) => Promise<Show | null>;
    createShow: (txHash: string, description: string, file: File | null) => Promise<Show>;
    uploadImage: (id: string, file: File) => Promise<Show>;
    // updateShow: (show: Show) => Promise<Show>;
    // deleteShow: (id: string) => Promise<void>;
}

export const ShowRepository = (showApiAdapter: ShowApiAdapterType) => {
    const getShow = async (id: string) => {
        return showApiAdapter.getShow(id);
    }

    const createShow = async (txHash: string, description: string, file: File | null) => {
        console.log(`ShowRepository::createShow txHash=${txHash}, description=${description}, file=${file ? file.name : 'null'}`);
        return showApiAdapter.createShow(txHash, description, file);
    }

    const uploadImage = async (id: string, file: File) => {
        return showApiAdapter.uploadImage(id, file);
    }

    return {
        getShow,
        createShow,
        uploadImage
    }
}
