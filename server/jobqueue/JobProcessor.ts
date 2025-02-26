import { Queue } from "bull";
import { FileUploadJobData, GenericJobData } from "./JobData";
import { ContractTxConfirmationJobProcessorType } from "./processor/ContractTxConfirmationJobProcessor";
import { ContractTxConfirmationJobData } from "./JobData";
import { FileUploadJobProcessorType } from "./processor/FileUploadJobProcessor";
//
export type JobProcessorType = {
    start: () => Promise<void>;
}
//  
export const JobProcessor = (
    jobQueue: Queue<GenericJobData>,
    contractTxConfirmationJobProcessor: ContractTxConfirmationJobProcessorType,
    fileUploadJobProcessor: FileUploadJobProcessorType
) => {
    async function start() {
        console.log(`JobProcessor: Starting job processor`);
        jobQueue.process(async (job) => {
            console.log(`JobProcessor: Processing job: ${job.id}, type: ${job.data.type}`);
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
                default:
                    console.error(`JobProcessor: Unknown job type: ${job.data.type}`);
                    break;
            }
        });
    }
    return {
        start
    }
}
