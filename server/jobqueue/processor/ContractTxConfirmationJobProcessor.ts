import { BlockchainTxDBModelType } from "../../database/model/BlockchainTxDB";
import { TxStatus } from "../../database/model/TxStatus";
import { ContractTxConfirmationJobData, NotificationJobData, NotificationEvent, ShowCreatedNotificationData } from "../JobData.js";
import { ShowDBModelType } from "../../database/model/ShowDB.js";
import { Queue as BullQueue } from "bull";
import { GenericJobData } from "../JobData";
//
export type ContractTxConfirmationJobProcessorType = {
    process: (data: ContractTxConfirmationJobData) => Promise<void>;
}

export const ContractTxConfirmationJobProcessor = (jobQueue: BullQueue<GenericJobData>, blockchainTxDB: BlockchainTxDBModelType, showDb: ShowDBModelType) => {

    async function process(data: ContractTxConfirmationJobData) {
        console.log(`🔄 ContractTxConfirmationJobProcessor: Processing job: ${JSON.stringify(data)}`);

        try {
            const dbTx = await blockchainTxDB.findOne({ txHash: data.txHash });
            const dbShow = await showDb.findOne({ txHash: data.txHash });
            if (!dbTx || !dbShow) {
                console.error(`ContractTxConfirmationJobProcessor: Transaction or show not found: ${data.txHash}`);
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
                    const dbTxUpdate = dbTx.updateOne({ status: newStatus });
                    const dbShowUpdate = dbShow.updateOne({ txStatus: newStatus });
                    const [dbTxUpdateResult, dbShowUpdateResult] = await Promise.all([dbTxUpdate, dbShowUpdate]);
                    const { image, ...rest } = dbTxUpdateResult;
                    console.log(`ContractTxConfirmationJobProcessor: Transaction saved: ${data.txHash} with ${JSON.stringify(rest)}`);
                    console.log(`ContractTxConfirmationJobProcessor: Show saved: ${data.txHash} with ${JSON.stringify(dbShowUpdateResult)}`);

                    // TODO: Signal on web socket
                    const notificationJobData: NotificationJobData = {
                        jobId: data.jobId,
                        event: NotificationEvent.SHOW_TX_CONFIRMED,
                        txHash: data.txHash,
                        data: {
                            showId: data.contractAddress,
                            
                        } as ShowCreatedNotificationData
                    }
                    jobQueue.add({
                        type: 'notification',
                        data: notificationJobData
                    });
                    break;
                default:
                    console.error(`ContractTxConfirmationJobProcessor: Unknown transaction status: ${dbTx.status}`);
                    return;
            }
        } catch (error) {
            console.error(`ContractTxConfirmationJobProcessor: Error processing job: ${data.txHash}`, error);
        }
    }
    return {
        process
    }
}
