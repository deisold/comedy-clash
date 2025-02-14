import { ShowResponseType } from "../../adapters/api/data/ShowResponseType";

export interface ShowRepoType {
    readonly id: string; // The id represents the show address in the Comedy Theater contract
    readonly description: string;
    readonly imageUrl?: string | null;
    readonly createdAt: Date;
}

export function fromApiShow(apiShow: ShowResponseType | null): ShowRepoType | null {
    return (apiShow === null || apiShow === undefined) ? null : {
        id: apiShow.id,
        description: apiShow.description,
        imageUrl: apiShow.imageUrl,
        createdAt: apiShow.createdAt
    };
}
