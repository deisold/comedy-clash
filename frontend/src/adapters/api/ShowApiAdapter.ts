import { ShowResponseType } from "./data/ShowResponseType";
import { ShowRequestType } from "./data/ShowRequestType";
import { AxiosInstance } from "axios";
//
export type ShowApiAdapterType = {
    getShow: (id: string | undefined) => Promise<ShowResponseType | null>;
    // createShow: (show: ShowRequest) => Promise<ShowResponse>;
    // updateShow: (show: ShowRequest) => Promise<ShowResponse>;
    // deleteShow: (id: string) => Promise<void>;
}

export const ShowApiAdapter = (httpClient: AxiosInstance): ShowApiAdapterType => {
    const getShow = async (id: string | undefined) => {
        try {
            const response = await httpClient.get<ShowResponseType>(`/shows/${id}`);
            return response.data;
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    return {
        getShow
    }
}
