import { TxStatus } from "../../database/model/TxStatus.js";
import { Show } from "../../reposity/data/Show.js";
//
export interface ShowCreationPayload {
    description: string;
    txHash: string;
}

export const validateShowCreation = (showCreation: ShowCreationPayload): boolean => {
    return typeof showCreation.txHash === 'string' && showCreation.txHash.trim() !== '' &&
           typeof showCreation.description === 'string' && showCreation.description.trim() !== '';
}

export function fromShowRequest({ description,
    txHash,
    id,
    imageUrl = null,
    txStatus,
    userId,
    createdAt = new Date()
}: {
    description: string,
    txHash: string,
    id: string,
    txStatus: typeof TxStatus[keyof typeof TxStatus],
    imageUrl?: string | null,
    userId: string,
    createdAt?: Date | null
}): Show {
    return {
        description: description,
        txHash: txHash,
        id: id,
        imageUrl: imageUrl,
        txStatus: txStatus,
        createdAt: createdAt ?? new Date(),
        userId: userId
    }
}
