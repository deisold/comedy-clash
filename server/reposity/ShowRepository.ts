import { ShowDBModelType } from "../database/model/ShowDB.js";
import { TxStatus } from "../database/model/TxStatus.js";
import { fromDBShow, Show, toDBShow } from "./data/Show.js";
//
export type ShowRepositoryType = {
    createShow: (show: Show) => Promise<Show>;
    getShow: (id: string | null) => Promise<Show | null>;
    getShowByTxHash: (txHash: string) => Promise<Show | null>;
    updateShow: (id: string, show: Show) => Promise<Show>;
    updateShowByParams: (txHash: string, params: {
        id?: string; // The id represents the show address in the Comedy Theater contract
        userId?: string;
        description?: string;
        imageUrl?: string | null;
        txHash?: string;
        txStatus?: typeof TxStatus[keyof typeof TxStatus];
        createdAt?: Date;
    }) => Promise<Show>;
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
        try {
            const newShow = await db.create(show_db);
            console.log(`ShowRepository::createShow Show created=${JSON.stringify(newShow)}`);
            return fromDBShow(newShow)!!;
        } catch (error) {
            console.error(`ShowRepository::createShow Error creating show: ${error}`);
            throw error;
        }
    }

    const getShow = async (id: string | null) => {
        if (!id) {
            return null;
        }
        const show = await db.findOne({ address: id });
        return fromDBShow(show);
    }

    const getShowByTxHash = async (txHash: string) => {
        const show = await db.findOne({ txHash });
        return fromDBShow(show);
    }

    const updateShowByParams = async (txHash: string, params: {
        id?: string; // The id represents the show address in the Comedy Theater contract
        userId?: string;
        description?: string;
        imageUrl?: string | null;
        txHash?: string;
        txStatus?: typeof TxStatus[keyof typeof TxStatus];
        createdAt?: Date;
    }) => {
        console.log(`ShowRepository::updateShowTxStatus txHash=${txHash}, params=${JSON.stringify(params)}`);
        try {
            const updatedShow = await db.findOneAndUpdate(
                { txHash },
                { $set: params },
                { new: true }
            );
            return fromDBShow(updatedShow)!!;
        } catch (error) {
            console.error(`ShowRepository::updateShowTxStatus Error updating show: txHash=${txHash}, error=${error}`);
            throw error;
        }
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
        deleteShow,
        getShowByTxHash,
        updateShowByParams
    }
}