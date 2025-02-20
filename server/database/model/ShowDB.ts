import mongoose from "mongoose";
import { TxStatus } from "./TxStatus.js";
import { DB_ORDER_ASC } from "../const.js";

// Add type definition for ShowDB
export interface ShowDBType {
    address: string;
    userId: string;
    description: string;
    imageUrl: string | null;
    txHash: string;
    txStatus: typeof TxStatus[keyof typeof TxStatus];
    createdAt: Date;
}
// The id represents the show address in the Comedy Theater contract
const showSchema = new mongoose.Schema<ShowDBType>({
    address: {
        type: String, // Store it as a plain string
        required: true,
        unique: true // create a unique index
    },
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    txHash: {
        type: String,
        required: false
    },
    txStatus: {
        type: String,
        required: true,
        enum: TxStatus
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const ShowDB = mongoose.model<ShowDBType>('Show', showSchema);

// Create a unique index on the address field
showSchema.index({ txHash: DB_ORDER_ASC });

export default ShowDB;