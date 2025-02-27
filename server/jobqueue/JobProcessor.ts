import { Queue } from "bull";
import { FileUploadJobData, GenericJobData } from "./JobData";
import { ContractTxConfirmationJobProcessorType } from "./processor/ContractTxConfirmationJobProcessor";
import { ContractTxConfirmationJobData } from "./JobData";
import { FileUploadJobProcessorType } from "./processor/FileUploadJobProcessor";
import { NotificationJobProcessorType } from "./processor/NotificationJobProcessor";
import { NotificationJobData } from "./JobData";
//
export type JobQueueProcessorType = {
    start: () => Promise<void>;
    close: () => Promise<void>;
}
//  
export const JobQueueProcessor = (
    jobQueue: Queue<GenericJobData>,
    contractTxConfirmationJobProcessor: ContractTxConfirmationJobProcessorType,
    fileUploadJobProcessor: FileUploadJobProcessorType,
    notificationJobProcessor: NotificationJobProcessorType
) => {
    async function start() {
        console.log(`✅ JobQueueProcessor: Starting job processor`);

        jobQueue.process(async (job) => {
            console.log(`🔄 JobQueueProcessor: Processing job: ${job.id}, type: ${job.data.type}`);
            switch (job.data.type) {
                case 'contractTxConfirmation':
                    const contractJobData = job.data.data as ContractTxConfirmationJobData;
                    contractJobData.jobId = job.id;
                    await contractTxConfirmationJobProcessor.process(contractJobData);
                    break;
                case 'fileUpload':
                    const fileJobData = job.data.data as FileUploadJobData;
                    fileJobData.jobId = job.id;
                    await fileUploadJobProcessor.process(fileJobData);
                    break;
                case 'notification':
                    const notificationJobData = job.data.data as NotificationJobData;
                    notificationJobData.jobId = job.id;
                    await notificationJobProcessor.process(notificationJobData);
                    break;
                default:
                    console.error(`JobProcessor: Unknown job type: ${job.data.type}`);
                    break;
            }
        });
    }
    async function close() {
        console.log(`🔴 JobQueueProcessor: Closing job processor`);
        await jobQueue.close();
    }
    return {
        start,
        close
    }
}
