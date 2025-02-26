import mongoose from "mongoose";
import { TxStatus } from "./TxStatus.js";
/*
    This model is used to store the transaction hash and status of a transaction on the blockchain.
*/
export interface BlockchainTxDBType {
    txHash: string;
    walletAddress: string;
    userId: string;
    timestamp: Date;
    status: typeof TxStatus[keyof typeof TxStatus];
    image: Buffer | undefined;
}

const blockchainTxSchemaDB = new mongoose.Schema<BlockchainTxDBType>({
    txHash: {
        type: String,
        required: true,
        unique: true
    },
    walletAddress: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: TxStatus
    },
    image: {
        type: Buffer,
        required: false
    }
});

export type BlockchainTxDBModelType = mongoose.Model<BlockchainTxDBType>;
const BlockchainTxDB: BlockchainTxDBModelType = mongoose.model<BlockchainTxDBType>("BlockchainTxDB", blockchainTxSchemaDB);

export default BlockchainTxDB;