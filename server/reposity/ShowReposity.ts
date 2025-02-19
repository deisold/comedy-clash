import ShowDB from "../database/model/ShowDB.js";
import { fromDBShow, Show, toDBShow } from "./data/Show.js";
import { ShowRepositoryType } from "./ShowRepositoryType.js";
//
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