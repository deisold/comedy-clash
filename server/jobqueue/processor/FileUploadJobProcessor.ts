import { ShowDBModelType } from "../../database/model/ShowDB";
import { BlockchainTxDBModelType } from "../../database/model/BlockchainTxDB";
import { FileUploadJobData, NotificationJobData, NotificationEvent, ShowImageUploadedNotificationData } from "../JobData";
import { UploadFileUtilsType } from "../../web3/utils/FileUploadUtils";
import { getImageBase64FromBuffer } from "../../utils/imageUtils";
import { Queue as BullQueue } from "bull";
import { GenericJobData } from "../JobData";
//
export type FileUploadJobProcessorType = {
    process: (data: FileUploadJobData) => Promise<void>;
}

export const FileUploadJobProcessor = (
    jobQueue: BullQueue<GenericJobData>,
    blockchainTxDB: BlockchainTxDBModelType,
    showDb: ShowDBModelType,
    uploadFileUtils: UploadFileUtilsType,
): FileUploadJobProcessorType => {
    async function process(data: FileUploadJobData) {
        console.log(`🔄 FileUploadJobProcessor: Processing job: ${JSON.stringify(data)}`);

        try {
            const dbTx = await blockchainTxDB.findOne({ txHash: data.txHash });
            const dbShow = await showDb.findOne({ txHash: data.txHash });
            if (!dbTx || !dbShow) {
                console.error(`FileUploadJobProcessor: Transaction or show not found: ${data.txHash}`);
                return;
            }

            const imageBase64 = getImageBase64FromBuffer(dbTx.image, dbTx.imageMimeType);
            if (!imageBase64) {
                console.log(`FileUploadJobProcessor: No image provided for txHash=${data.txHash}`);
                return;
            }
            // Upload image to cloud server
            const secureImageUrl = await uploadFileUtils.uploadFile(data.jobId, imageBase64, "shows");
            console.log(`FileUploadJobProcessor: File uploaded: secureImageUrl=${secureImageUrl}`);

            // Update show with secure image url
            const updatedShow = await showDb.updateOne({ txHash: data.txHash, imageUrl: secureImageUrl });
            console.log(`FileUploadJobProcessor: Show updated: ${JSON.stringify(updatedShow)}`);

            // Update blockchain tx and remove image
            const updatedTx = await blockchainTxDB.updateOne(
                { txHash: data.txHash },
                { $unset: { image: "", imageMimeType: "" } }
            );
            console.log(`FileUploadJobProcessor: Blockchain tx updated: ${JSON.stringify(updatedTx)}`);

            // Signal on web socket
            const notificationJobData: NotificationJobData = {
                jobId: data.jobId,
                event: NotificationEvent.SHOW_IMAGE_UPLOADED,
                txHash: data.txHash,
                data: {
                    showImageUrl: secureImageUrl
                } as ShowImageUploadedNotificationData
            }
            jobQueue.add({
                type: 'notification',
                data: notificationJobData
            });
        } catch (error) {
            console.error(`FileUploadJobProcessor: Error processing job: ${data.jobId}, txHash=${data.txHash}, error msg=${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    return {
        process
    }
}