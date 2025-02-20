import { TxStatus } from "../../database/model/TxStatus.js";
import { Show } from "../../reposity/data/Show.js";
//
export interface ShowCreation {
    description: string;
    txHash: string;
}

export const validateShowCreation = (showCreation: ShowCreation): boolean => {
    return typeof showCreation.txHash === 'string' && showCreation.txHash.trim() !== '' &&
           typeof showCreation.description === 'string' && showCreation.description.trim() !== '';
}

export function fromShowRequest({ showCreation,
    id,
    imageUrl = null,
    txStatus,
    userId,
    createdAt = new Date()
}: {
    showCreation: ShowCreation,
    id: string,
    txStatus: typeof TxStatus[keyof typeof TxStatus],
    imageUrl?: string | null,
    userId: string,
    createdAt?: Date | null
}): Show {
    return {
        ...showCreation,
        id: id,
        imageUrl: imageUrl,
        txStatus: txStatus,
        createdAt: createdAt ?? new Date(),
        userId: userId
    }
}
