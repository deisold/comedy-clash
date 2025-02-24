import { TxStatus } from "./TxStatus";

export interface Show {
    readonly id: string; // The id represents the show address in the Comedy Theater contract
    readonly userId: string;
    readonly description: string;
    readonly imageUrl: string | null;
    readonly txHash: string;
    readonly txStatus: typeof TxStatus[keyof typeof TxStatus];
    readonly createdAt: Date;
}

export function toShow({ id, userId, description, imageUrl, txHash, txStatus, createdAt }: {
    id: string;
    userId: string;
    description: string;
    imageUrl?: string | null;
    txHash: string;
    txStatus: typeof TxStatus[keyof typeof TxStatus];
    createdAt: Date;
}): Show {
    return {
        id,
        userId,
        description,
        imageUrl: imageUrl ?? null,
        txHash,
        txStatus,
        createdAt,
    };
}   
