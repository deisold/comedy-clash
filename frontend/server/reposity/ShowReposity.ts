import ShowDB from "../database/model/ShowDB.js";
import { fromDBShow, Show, toDBShow } from "./data/Show.js";
//
export type ShowRepositoryType = {
    getShow: (id: string | undefined) => Promise<Show | null>;
    createShow: (show: Show) => Promise<Show>;
    updateShow: (show: Show) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
}


export const ShowRepository = (showDB = ShowDB): ShowRepositoryType => {

    const getShow = async (id: string | undefined) => {
        if (!id) {
            return null;
        }
        const show = await showDB.findOne({ address: id });
        return fromDBShow(show);
    }

    const createShow = async (show: Show) => {
        console.log(`ShowRepository::createShow ${show.id}`);
        const show_db = toDBShow(show);
        if (!show_db) {
            throw new Error("Show is null");
        }
        const newShow = await showDB.create(show_db);
        return fromDBShow(newShow)!!;
    }

    const updateShow = async (show: Show) => {
        const updatedShow = await showDB.findByIdAndUpdate(show.id, show, { new: true });
        return fromDBShow(updatedShow)!!;
    }

    const deleteShow = async (id: string) => {
        await showDB.findByIdAndDelete(id);
    }

    return {
        getShow,
        createShow,
        updateShow,
        deleteShow
    }
}