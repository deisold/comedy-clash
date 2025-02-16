import { Show } from "../reposity/data/Show.js";
import { ShowRepositoryType } from "../reposity/ShowReposity.js";

export interface ShowServiceType {
    getShow: (id: string | undefined) => Promise<Show | null>;
    createShow: (show: Show) => Promise<Show>;
    updateShow: (show: Show) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
}

export const ShowService = (showRepository: ShowRepositoryType): ShowServiceType => {
    const getShow = async (id: string | undefined) => {
        return showRepository.getShow(id);
    }

    const createShow = async (show: Show) => {
        return showRepository.createShow(show);
    }

    const updateShow = async (show: Show) => {
        return showRepository.updateShow(show);
    }

    const deleteShow = async (id: string) => {
        return showRepository.deleteShow(id);
    }

    return {
        getShow,
        createShow,
        updateShow,
        deleteShow,
    }
}