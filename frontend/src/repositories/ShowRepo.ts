import { ShowApiAdapterType } from "../adapters/api/ShowApiAdapter";
import { fromApiShow, ShowRepoType } from "./data/ShowRepo";

export type ShowRepositoryType = {
    getShow: (id: string | undefined) => Promise<ShowRepoType | null>;
    // createShow: (show: Show) => Promise<Show>;
    // updateShow: (show: Show) => Promise<Show>;
    // deleteShow: (id: string) => Promise<void>;
}

export const ShowRepository = (showApiAdapter: ShowApiAdapterType): ShowRepositoryType => {
    const getShow = async (id: string | undefined) => {
        const show = await showApiAdapter.getShow(id);
        return fromApiShow(show);
    }

    return {
        getShow
    }
}
