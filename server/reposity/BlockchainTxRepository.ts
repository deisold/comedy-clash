import { BlockchainTx, fromDBBlockchainTx, toDBBlockchainTx } from "./data/BlockchainTx.js";
import { BlockchainTxDBModelType } from "../database/model/BlockchainTxDB.js";
import { TxStatus } from "../database/model/TxStatus.js";
//
export type BlockchainTxRepositoryType = {
    createBlockchainTx: (blockchainTx: BlockchainTx) => Promise<BlockchainTx>,
    getByTxHash: (txHash: string) => Promise<BlockchainTx | null>,
    updateByParams: (txHash: string, params: {
        txHash?: string;
        status?: typeof TxStatus[keyof typeof TxStatus];
        image?: Buffer | undefined;
        imageMimeType?: string | undefined;
        walletAddress?: string;
        userId?: string;
        timestamp?: Date;
    }) => Promise<BlockchainTx>,
    deleteImageForTxHash: (txHash: string) => Promise<BlockchainTx>,
    deleteBlockchainTx: (txHash: string) => Promise<void>,
}

export const BlockchainTxRepository = (db: BlockchainTxDBModelType): BlockchainTxRepositoryType => {

    const createBlockchainTx = async (blockchainTx: BlockchainTx) => {
        const blockchainTxDB = toDBBlockchainTx(blockchainTx);
        if (!blockchainTxDB) {
            throw new Error("BlockchainTx is null");
        }
        const newBlockchainTx = await db.create(blockchainTxDB);
        return fromDBBlockchainTx(newBlockchainTx)!!;
    }

    const getByTxHash = async (txHash: string) => {
        const blockchainTx = await db.findOne({ txHash });
        return fromDBBlockchainTx(blockchainTx);
    }

    const updateByParams = async (txHash: string, params: {
        txHash?: string;
        status?: typeof TxStatus[keyof typeof TxStatus];
        image?: Buffer | undefined;
        imageMimeType?: string | undefined;
        walletAddress?: string;
        userId?: string;
        timestamp?: Date;
    }) => {
        console.log(`BlockchainTxRepository::updateByParams txHash=${txHash}, params=${JSON.stringify(params)}`);
        try {
            const updatedBlockchainTx = await db.findOneAndUpdate(
                { txHash: txHash },
                { $set: params },
                { new: true }
            );
            return fromDBBlockchainTx(updatedBlockchainTx)!!;
        } catch (error) {
            console.error(`BlockchainTxRepository::updateByParams Error updating blockchainTx: txHash=${txHash}, error=${error}`);
            throw error;
        }
    }

    const deleteImageForTxHash = async (txHash: string) => {
        console.log(`BlockchainTxRepository::deleteImageForTxHash txHash=${txHash}`);
        try {
            const updatedBlockchainTx = await db.findOneAndUpdate(
                { txHash: txHash },
                { $unset: { image: "", imageMimeType: "" } }
            );
            return fromDBBlockchainTx(updatedBlockchainTx)!!;
        } catch (error) {
            console.error(`BlockchainTxRepository::deleteImageForTxHash Error deleting image for txHash=${txHash}, error=${error}`);
            throw error;
        }
    }

    const deleteBlockchainTx = async (txHash: string) => {
        await db.findOneAndDelete({ txHash: txHash });
    }

    return {
        createBlockchainTx,
        getByTxHash,
        updateByParams,
        deleteImageForTxHash,
        deleteBlockchainTx,
    }
}
