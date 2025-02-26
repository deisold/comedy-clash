import { ShowDBModelType } from "../database/model/ShowDB.js";
import { fromDBShow, Show, toDBShow } from "./data/Show.js";
//
export type ShowRepositoryType = {
    createShow: (show: Show) => Promise<Show>;
    getShow: (id: string | null) => Promise<Show | null>;
    updateShow: (id: string, show: Show) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
};
//
export const ShowRepository = (db: ShowDBModelType): ShowRepositoryType => {

    const createShow = async (show: Show) => {
        console.log(`ShowRepository::createShow txHash=${show.txHash}`);
        const show_db = toDBShow(show);
        if (!show_db) {
            throw new Error("Show is null");
        }
        const newShow = await db.create(show_db);
        console.log(`ShowRepository::createShow Show created=${JSON.stringify(newShow)}`);
        return fromDBShow(newShow)!!;
    }

    const getShow = async (id: string | null) => {
        if (!id) {
            return null;
        }
        const show = await db.findOne({ address: id });
        return fromDBShow(show);
    }

    const updateShow = async (id: string, show: Show) => {
        console.log(`ShowRepository::updateShow ${id} show: ${JSON.stringify(show)}`);
        const showToUpdate = toDBShow(show);
        if (!showToUpdate) {
            throw new Error("Show is null");
        }
        const updatedShow = await db.findOneAndUpdate({ address: id }, showToUpdate, { new: true });
        return fromDBShow(updatedShow)!!;
    }

    const deleteShow = async (id: string) => {
        await db.findByIdAndDelete({ address: id });
    }

    return {
        getShow,
        createShow,
        updateShow,
        deleteShow
    }
}