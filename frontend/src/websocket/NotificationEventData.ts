
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

export type ShowNotificationDataTypes = ShowCreatedNotificationData | ShowImageUploadedNotificationData;

export interface NotificationEventData {
    eventType: typeof NotificationEventType[keyof typeof NotificationEventType];
    txHash: string;
    data: ShowNotificationDataTypes;
}
