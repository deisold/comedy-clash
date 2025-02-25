import { TxStatus } from "../database/model/TxStatus";
//
export interface ContractTxConfirmationJobData {
    txHash: string;
    contractAddress: string;
    status: typeof TxStatus[keyof typeof TxStatus];
}

export interface GenericJobData {
    type: 'contractTxConfirmation';
    data: ContractTxConfirmationJobData;
}


