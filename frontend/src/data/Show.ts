import { TxStatus } from "./TxStatus";

export interface Show {
    readonly id: string; // The id represents the show address in the Comedy Theater contract
    readonly userId: string;
    readonly description: string;
    readonly imageUrl: string | null;
    readonly txHash: string;
    readonly txStatus: typeof TxStatus[keyof typeof TxStatus];
    readonly createdAt: Date;
    readonly submissionCount: number;
    readonly closed: boolean;
}

export function toShow({ id, userId, description, imageUrl, txHash, txStatus, createdAt, submissionCount, closed }: {
    id: string;
    userId: string;
    description: string;
    imageUrl?: string | null;
    txHash: string;
    txStatus: typeof TxStatus[keyof typeof TxStatus];
    createdAt: Date;
    submissionCount: number;
    closed: boolean;
}): Show {
    return {
        id,
        userId,
        description,
        imageUrl: imageUrl ?? null,
        txHash,
        txStatus,
        createdAt,
        submissionCount,
        closed,
    };
}   
