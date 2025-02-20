import { ShowDBType } from "../../database/model/ShowDB.js";
import { TxStatus } from "../../database/model/TxStatus.js";
//
export interface Show {
    id: string; // The id represents the show address in the Comedy Theater contract
    userId: string;
    description: string;
    imageUrl: string | null;
    txHash: string;
    txStatus: typeof TxStatus[keyof typeof TxStatus];
    createdAt: Date;
}

// Convert from database Show type to repository Show type
export function fromDBShow(dbShow: ShowDBType | null): Show | null {
    return (dbShow === null || dbShow === undefined) ? null : {
        id: dbShow.address,
        userId: dbShow.userId,
        description: dbShow.description,
        imageUrl: dbShow.imageUrl,
        txHash: dbShow.txHash,
        txStatus: dbShow.txStatus,
        createdAt: dbShow.createdAt
    };
}

// Convert from repository Show type to database Show type
export function toDBShow(show: Show | null): ShowDBType | null {
    return (show === null || show === undefined) ? null : {
        address: show.id,
        userId: show.userId,
        description: show.description,
        imageUrl: show.imageUrl,
        txHash: show.txHash,
        txStatus: show.txStatus,
        createdAt: show.createdAt
    };
}


