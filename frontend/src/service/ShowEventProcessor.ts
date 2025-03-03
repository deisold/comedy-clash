import { ShowStoreType } from "../store/ShowStore";
import { ShowCreatedNotificationData, ShowImageUploadedNotificationData, ShowNotificationDataTypes, NotificationEventType } from "../websocket/NotificationEventData";
//
export type ShowNotificationEventType = Pick<typeof NotificationEventType,
    typeof NotificationEventType.SHOW_TX_CONFIRMED |
    typeof NotificationEventType.SHOW_IMAGE_UPLOADED
>;

export type ShowEventProcessorType = {
    process: (
        type: ShowNotificationEventType[keyof ShowNotificationEventType],
        txHash: string,
        data: ShowNotificationDataTypes
    ) => void;
}

export const ShowEventProcessor = (showStore: ShowStoreType): ShowEventProcessorType => {
    const processShowTxConfirmed = (txHash: string, data: ShowCreatedNotificationData) => {
        if (!data.showId) {
            console.error(`ShowEventProcessor: showId is null for txHash: ${txHash}`);
            return;
        }
        showStore.updateShowForTxHash(txHash, { id: data.showId });
    };

    const processShowImageUploaded = (txHash: string, data: ShowImageUploadedNotificationData) => {
        if (!data.showImageUrl) {
            console.error(`ShowEventProcessor: showImageUrl is null for txHash: ${txHash}`);
            return;
        }
        showStore.updateShowForTxHash(txHash, { imageUrl: data.showImageUrl });
    };

    const process = (type: ShowNotificationEventType[keyof ShowNotificationEventType], txHash: string, data: ShowNotificationDataTypes) => {
        console.log(`ShowEventProcessor: Processing show event: ${type}, txHash: ${txHash}, data: ${JSON.stringify(data)}`);
        switch (type) {
            case NotificationEventType.SHOW_TX_CONFIRMED:
                processShowTxConfirmed(txHash, data as ShowCreatedNotificationData);
                break;
            case NotificationEventType.SHOW_IMAGE_UPLOADED:
                processShowImageUploaded(txHash, data as ShowImageUploadedNotificationData);
                break;
        }
    };
    return {
        process
    };
};
