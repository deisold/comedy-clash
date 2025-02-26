import { BlockchainTx, fromDBBlockchainTx, toDBBlockchainTx } from "./data/BlockchainTx.js";
import { BlockchainTxDBModelType } from "../database/model/BlockchainTxDB.js";
//
export type BlockchainTxRepositoryType = {
    createBlockchainTx: (blockchainTx: BlockchainTx) => Promise<BlockchainTx>,
    getBlockchainTx: (txHash: string) => Promise<BlockchainTx | null>,
    updateBlockchainTx: (txHash: string, blockchainTx: BlockchainTx) => Promise<BlockchainTx>,
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

    const getBlockchainTx = async (txHash: string) => {
        const blockchainTx = await db.findOne({ txHash });
        return fromDBBlockchainTx(blockchainTx);
    }

    const updateBlockchainTx = async (txHash: string, blockchainTx: BlockchainTx) => {
        const blockchainTxDB = toDBBlockchainTx(blockchainTx);
        if (!blockchainTxDB) {
            throw new Error("BlockchainTx is null");
        }
        const updatedBlockchainTx = await db.findOneAndUpdate({ txHash: txHash }, blockchainTxDB, { new: true });
        return fromDBBlockchainTx(updatedBlockchainTx)!!;
    }

    const deleteBlockchainTx = async (txHash: string) => {
        await db.findOneAndDelete({ txHash: txHash });
    }

    return {
        createBlockchainTx,
        getBlockchainTx,
        updateBlockchainTx,
        deleteBlockchainTx,
    }
}
