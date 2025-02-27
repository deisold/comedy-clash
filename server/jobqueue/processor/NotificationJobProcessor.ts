import { NotificationJobData } from "../JobData";
import { WebSocketServerType } from "../../websocket/WebSocketServer";
//
export type NotificationJobProcessorType = {
    process: (data: NotificationJobData) => Promise<void>;
}

export const NotificationJobProcessor = (getWebSocketServerInstance: () => WebSocketServerType): NotificationJobProcessorType => {
    async function process(data: NotificationJobData) {
        console.log(`NotificationJobProcessor: Processing job: ${JSON.stringify(data)}`);
    }
    return {
        process
    }
}

export default NotificationJobProcessor;