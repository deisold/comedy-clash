import {Queue } from "bull";
import { GenericJobData } from "./JobData";
import { ContractTxConfirmationJobProcessorType } from "./processor/ContractTxConfirmationJobProcessor";
import { ContractTxConfirmationJobData } from "./JobData";
//
export type JobProcessorType = {
    start: () => Promise<void>;
}
//  
export const JobProcessor = (jobQueue: Queue<GenericJobData>, contractTxConfirmationJobProcessor: ContractTxConfirmationJobProcessorType) => {
    async function start() {
        console.log(`JobProcessor: Starting job processor`);
        jobQueue.process(async (job) => {
            console.log(`JobProcessor: Processing job: ${job.id}, type: ${job.data.type}`);
            switch (job.data.type) {
                case 'contractTxConfirmation':
                    const jobData = job.data.data as ContractTxConfirmationJobData;
                    await contractTxConfirmationJobProcessor.process(jobData);
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
