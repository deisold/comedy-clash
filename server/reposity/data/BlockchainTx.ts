import { TxStatus } from "../../database/model/TxStatus.js";
import { BlockchainTxDBType } from "../../database/model/BlockchainTxDB.js";
//
export interface BlockchainTx {
    txHash: string;
    status: typeof TxStatus[keyof typeof TxStatus];
    image: Buffer | undefined;
    walletAddress: string;
    userId: string;
    timestamp: Date;
}

export function fromDBBlockchainTx(dbBlockchainTx: BlockchainTxDBType | null): BlockchainTx | null {
    return (dbBlockchainTx === null || dbBlockchainTx === undefined) ? null : {
        txHash: dbBlockchainTx.txHash,
        status: dbBlockchainTx.status,
        image: dbBlockchainTx.image ?? undefined,
        walletAddress: dbBlockchainTx.walletAddress,
        userId: dbBlockchainTx.userId,
        timestamp: dbBlockchainTx.timestamp
    };
}

export function toDBBlockchainTx(blockchainTx: BlockchainTx | null): BlockchainTxDBType | null {
    return (blockchainTx === null || blockchainTx === undefined) ? null : {
        txHash: blockchainTx.txHash,
        status: blockchainTx.status,
        image: blockchainTx.image ?? undefined,
        walletAddress: blockchainTx.walletAddress,
        userId: blockchainTx.userId,
        timestamp: blockchainTx.timestamp
    };
}