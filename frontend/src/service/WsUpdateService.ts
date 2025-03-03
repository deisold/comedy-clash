import { NotificationEventData, NotificationEventType, ShowNotificationDataTypes } from "../websocket/NotificationEventData";
import { WebSocketInstanceType } from "../websocket/Websocket";
import { ShowEventProcessorType } from "./ShowEventProcessor";
//
export interface WsUpdateServiceType {
    start: () => void;
    stop: () => void;
}

export const WsUpdateService = (wsInstance: WebSocketInstanceType, showEventProcessor: ShowEventProcessorType): WsUpdateServiceType => {
    let removeListeners: Set<() => void> | null = null;

    const start = () => {
        console.log("✅ WsUpdateService: Starting...");
        const listener = (data: NotificationEventData) => {
            showEventProcessor.process(data.eventType, data.txHash, data.data);
        };
        removeListeners = new Set();
        removeListeners.add(wsInstance.addListener(NotificationEventType.SHOW_TX_CONFIRMED, listener));
        removeListeners.add(wsInstance.addListener(NotificationEventType.SHOW_IMAGE_UPLOADED, listener));
        console.log("✅ WsUpdateService: Started");
    };

    const stop = () => {
        console.log("🔴 WsUpdateService: Stopping...");
        if (removeListeners) {
            removeListeners.forEach(removeListener => removeListener());
            removeListeners = null;
        }
        console.log("🔴 WsUpdateService: Stopped");
    };

    return {
        start,
        stop
    }
}


