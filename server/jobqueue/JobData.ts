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

export const NotificationEventType = {
    SHOW_TX_CONFIRMED: "SHOW_TX_CONFIRMED",
    SHOW_IMAGE_UPLOADED: "SHOW_IMAGE_UPLOADED",
} as const;

export interface ShowCreatedNotificationData {
    showId: string | null;
}
export interface ShowImageUploadedNotificationData {
    showImageUrl: string | null;
}

export interface NotificationJobData {
    jobId?: number | string;
    eventType: typeof NotificationEventType[keyof typeof NotificationEventType];
    txHash: string;
    data: ShowCreatedNotificationData | ShowImageUploadedNotificationData;
}

export interface GenericJobData {
    type: 'contractTxConfirmation' | 'fileUpload' | 'notification';
    data: ContractTxConfirmationJobData | FileUploadJobData | NotificationJobData;
}


