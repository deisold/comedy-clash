import { FileUploadJobData, NotificationJobData, NotificationEventType, ShowImageUploadedNotificationData } from "../JobData";
import { UploadFileUtilsType } from "../../web3/utils/FileUploadUtils";
import { getImageBase64FromBuffer } from "../../utils/imageUtils";
import { Queue as BullQueue } from "bull";
import { GenericJobData } from "../JobData";
import { BlockchainTxRepositoryType } from "../../reposity/BlockchainTxRepository";
import { ShowRepositoryType } from "../../reposity/ShowRepository";
//
export type FileUploadJobProcessorType = {
    process: (data: FileUploadJobData) => Promise<void>;
}

export const FileUploadJobProcessor = (
    jobQueue: BullQueue<GenericJobData>,
    blockchainTxRepo: BlockchainTxRepositoryType,
    showRepository: ShowRepositoryType,
    uploadFileUtils: UploadFileUtilsType,
): FileUploadJobProcessorType => {
    async function process(data: FileUploadJobData) {
        console.log(`🔄 FileUploadJobProcessor: Processing job: ${JSON.stringify(data)}`);

        try {
            const dbTx = await blockchainTxRepo.getByTxHash(data.txHash);
            const dbShow = await showRepository.getShowByTxHash(data.txHash);
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
            const updatedShow = await showRepository.updateShowByParams(data.txHash, { imageUrl: secureImageUrl });
            console.log(`FileUploadJobProcessor: Show updated: ${JSON.stringify(updatedShow)}`);

            // Update blockchain tx and remove image
            const updatedTx = await blockchainTxRepo.deleteImageForTxHash(data.txHash);
            console.log(`FileUploadJobProcessor: Blockchain tx updated: ${JSON.stringify(updatedTx)}`);

            // Signal on web socket
            const notificationJobData: NotificationJobData = {
                jobId: data.jobId,
                eventType: NotificationEventType.SHOW_IMAGE_UPLOADED,
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