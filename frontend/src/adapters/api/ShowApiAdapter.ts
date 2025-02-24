import { Show, toShow } from "@/data/Show";
import { AxiosInstance } from "axios";
//
export type ShowApiAdapterType = {
    getShow: (id: string) => Promise<Show | null>;
    createShow: (txHash: string, description: string, file: File | null) => Promise<Show>;
    uploadImage: (id: string, file: File) => Promise<Show>;
    // updateShow: (show: ShowRequest) => Promise<ShowResponse>;
    // deleteShow: (id: string) => Promise<void>;
}

export const ShowApiAdapter = (httpClient: AxiosInstance): ShowApiAdapterType => {
    const getShow = async (id: string) => {
        try {
            const response = await httpClient.get<Show>(`/shows/${id}`);
            return toShow(response.data);
        } catch (error: any) {
            console.error(`ShowApiAdapter::getShow error: ${error}`);
            return null;
        }
    }

    const createShow = async (txHash: string, description: string, file: File | null) => {
        try {
            const formData = new FormData();
            formData.append("txHash", txHash);
            formData.append("description", description);
            if (file) {
                formData.append("image", file);
            }
            const response = await httpClient.post("/shows", formData, {
                headers: { "Content-Type": "multipart/form-data" }, // Only needed in Axios
            });
            return toShow(response.data);
        } catch (error: any) {
            console.error(`ShowApiAdapter::createShow error: ${error}`);
            throw error;
        }
    }

    const uploadImage = async (id: string, file: File) => {
        try {
            const response = await httpClient.post(`/shows/${id}/upload-image`, { image: file });
            return toShow(response.data);
        } catch (error: any) {
            console.error(`ShowApiAdapter::uploadImage error: ${error}`);
            throw error;
        }
    }

    return {
        getShow,
        createShow,
        uploadImage
    }
}
