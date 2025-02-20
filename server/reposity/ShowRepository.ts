import ShowDB from "../database/model/ShowDB.js";
import { fromDBShow, Show, toDBShow } from "./data/Show.js";
//
export type ShowRepositoryType = {
    createShow: (show: Show) => Promise<Show>;
    getShow: (id: string | null) => Promise<Show | null>;
    updateShow: (id: string, show: Show) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
};
//
export const ShowRepository = (showDB = ShowDB): ShowRepositoryType => {
   
    const createShow = async (show: Show) => {
        console.log(`ShowRepository::createShow ${show.id}`);
        const show_db = toDBShow(show);
        if (!show_db) {
            throw new Error("Show is null");
        }
        const newShow = await showDB.create(show_db);
        return fromDBShow(newShow)!!;
    }

    const getShow = async (id: string | null) => {
        if (!id) {
            return null;
        }
        const show = await showDB.findOne({ address: id });
        return fromDBShow(show);
    }

    const updateShow = async (id: string, show: Show) => {
        console.log(`ShowRepository::updateShow ${id} show: ${JSON.stringify(show)}`);
        const showToUpdate = toDBShow(show);
        if (!showToUpdate) {
            throw new Error("Show is null");
        }
        const updatedShow = await showDB.findOneAndUpdate({ address: id }, showToUpdate, { new: true });
        return fromDBShow(updatedShow)!!;
    }

    const deleteShow = async (id: string) => {
        await showDB.findByIdAndDelete({ address: id });
    }

    return {
        getShow,
        createShow,
        updateShow,
        deleteShow
    }
}