import { ShowDBType } from "../../database/model/ShowDB.js";
//
export interface Show {
    id: string; // The id represents the show address in the Comedy Theater contract
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
}

// Convert from database Show type to repository Show type
export function fromDBShow(dbShow: ShowDBType | null): Show | null {
    return (dbShow === null || dbShow === undefined) ? null : {
        id: dbShow.address,
        description: dbShow.description,
        imageUrl: dbShow.imageUrl,
        createdAt: dbShow.createdAt
    };
}

// Convert from repository Show type to database Show type
export function toDBShow(show: Show | null): ShowDBType | null {
    return (show === null || show === undefined) ? null : {
        address: show.id,
        description: show.description,
        imageUrl: show.imageUrl,
        createdAt: show.createdAt
    };
}


