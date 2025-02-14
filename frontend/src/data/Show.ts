export interface Show {
    readonly id: number; // The id represents the show index in the Comedy Theater contract
    readonly address: string; // The address represents the show address of the Comedy Clash contract
    readonly submissionCount: number;
    readonly isClosed: boolean;
    readonly description: string;
    readonly imageUrl?: string | null;
}

export function createShow({ id, address, submissionCount, isClosed, description, imageUrl, createdAt }: {
    id: number;
    address: string;
    submissionCount: number;
    isClosed: boolean;
    description: string;
    imageUrl?: string | null;
}): Show {
    return {
        id,
        address,
        submissionCount,
        isClosed,
        description,
        imageUrl,
    };
}   
