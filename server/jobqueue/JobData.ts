import { TxStatus } from "../database/model/TxStatus";
//
export interface ContractTxConfirmationJobData {
    jobId?: number | string;
    txHash: string;
    contractAddress: string;
    status: typeof TxStatus[keyof typeof TxStatus];
}
export interface FileUploadJobData {
    jobId?: number | string;
    txHash: string;
}

export interface GenericJobData {
    type: 'contractTxConfirmation' | 'fileUpload';
    data: ContractTxConfirmationJobData | FileUploadJobData;
}


