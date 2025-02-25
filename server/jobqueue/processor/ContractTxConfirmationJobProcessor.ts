import BlockchainTxDB from "../../database/model/BlockchainTxDB";
import { TxStatus } from "../../database/model/TxStatus";
import { ContractTxConfirmationJobData } from "../JobData.js";
//
export type ContractTxConfirmationJobProcessorType = {
    process: (data: ContractTxConfirmationJobData) => Promise<void>;
}

export const ContractTxConfirmationJobProcessor = (blockchainTxDB: typeof BlockchainTxDB) => {

    async function process(data: ContractTxConfirmationJobData) {
        console.log(`ContractTxConfirmationJobProcessor: Processing job: ${JSON.stringify(data)}`);

        const dbTx = await blockchainTxDB.findOne({ txHash: data.txHash });
        if (!dbTx) {
            console.error(`ContractTxConfirmationJobProcessor: Transaction not found: ${data.txHash}`);
            return;
        }

        switch (dbTx.status) {
            case TxStatus.CONFIRMED:
                console.log(`ContractTxConfirmationJobProcessor: Transaction already confirmed: ${data.txHash}`);
                return;
            case TxStatus.FAILED:
                console.error(`ContractTxConfirmationJobProcessor: Transaction failed: ${data.txHash}`);
                return;
            case TxStatus.PENDING:
                const newStatus = data.status;
                console.log(`ContractTxConfirmationJobProcessor: Transaction pending: ${data.txHash}, setting status to ${newStatus}`);

                dbTx.status = newStatus;
                const savedTx = await dbTx.save();
                console.log(`ContractTxConfirmationJobProcessor: Transaction saved: ${JSON.stringify(savedTx)}`);

                // TODO: Signal on web socket

                break;
            default:
                console.error(`ContractTxConfirmationJobProcessor: Unknown transaction status: ${dbTx.status}`);
                return;
        }
    }
    return {
        process
    }
}
