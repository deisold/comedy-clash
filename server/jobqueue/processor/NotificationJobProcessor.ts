import { NotificationJobData } from "../JobData";
import { WebSocketServerType } from "../../websocket/WebSocketServer";
import { fromNotificationJobData } from "../../websocket/NotificationEventData";
//
export type NotificationJobProcessorType = {
    process: (data: NotificationJobData) => Promise<void>;
}

export const NotificationJobProcessor = (getWebSocketServerInstance: () => WebSocketServerType): NotificationJobProcessorType => {
    async function process(data: NotificationJobData) {
        console.log(`🔄 NotificationJobProcessor: Processing job id: ${data.jobId} : ${JSON.stringify(data)}`);
        const webSocketServerInstance = getWebSocketServerInstance();
        if (!webSocketServerInstance) {
            console.error("🔴 NotificationJobProcessor: WebSocket server instance not initialized");
            return;
        }
        const notificationEventData = fromNotificationJobData(data);
        webSocketServerInstance.broadcast(notificationEventData.eventType, notificationEventData);
        console.log(`🔄 NotificationJobProcessor: Broadcasted job id: ${data.jobId}`);
    }
    return {
        process
    }
}

export default NotificationJobProcessor;