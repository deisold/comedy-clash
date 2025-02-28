import { NotificationEventData, NotificationEventType } from "./NotificationEventData";
//
export interface WebSocketInstanceType {
    start: () => void;
    stop: () => void;
    addListener: (eventType: string, callback: (data: NotificationEventData) => void) => () => void;
}

export const WebSocketInstance = (url: string, maxRetries: number, retryDelayMs: number): WebSocketInstanceType => {
    let ws: WebSocket | null = null;
    let retries = 0;
    let retryTimer: NodeJS.Timeout | null = null;
    // Map to store event listeners
    const listeners: Map<string, Set<(data: NotificationEventData) => void>> = new Map();

    const start = () => {
        if (ws) {
            console.warn("WebSocketInstance: WebSocket is already running");
            return;
        }

        console.log(`✅ WebSocketInstance: Connecting to ${url}...`);
        ws = new WebSocket(url);
        ws.onmessage = (event) => {
            console.log("📩 WebSocketInstance: Received message from WebSocket server", event.data.toString());
            const { type, payload } = JSON.parse(event.data.toString());
            processNotification(type, payload);
        };
        ws.onopen = () => {
            console.log("🔗 WebSocketInstance: Connected to WebSocket server");
            retries = 0;
            if (retryTimer) {
                clearTimeout(retryTimer);
                retryTimer = null;
            }
        };

        ws.onclose = () => {
            console.log("🔴 WebSocketInstance: Disconnected from WebSocket server");
            // Retry logic for reconnecting
            if (retries < maxRetries) {
                const retryDelay = retryDelayMs * (retries + 1); // Increase delay after each retry
                retries++;
                console.log(`🔄 WebSocketInstance: Retrying connection in ${retryDelay}ms...`);
                retryTimer = setTimeout(start, retryDelay); // Reconnect after delay
            } else {
                console.log('Max retries reached, not reconnecting');
            }
        };

        ws.onerror = (error) => {
            console.error("🔴 WebSocketInstance: Error on WebSocket connection", error);
            ws?.onclose; // trigger reconnect
        };
    };

    const processNotification = async (type: string, payload: any) => {
        if (!(type in NotificationEventType)) {
            console.error("WebSocketInstance: Received unknown event type", type);
            return;
        }
        // Check if payload has the expected structure
        if (!payload || typeof payload !== 'object') {
            console.error("WebSocketInstance: Received invalid payload");
            return;
        }
        const eventType = type as typeof NotificationEventType[keyof typeof NotificationEventType];
        const notificationEventData = payload as NotificationEventData;

        console.log(`📩 WebSocketInstance: Processing notification: ${eventType}`, notificationEventData);

        // Notify all listeners for this event type
        if (listeners.has(eventType)) {
            const eventListeners = listeners.get(eventType);
            console.log(`WebSocketInstance: Notifying ${eventListeners?.size} listeners for event ${eventType}`);
            if (eventListeners) {
                eventListeners.forEach(callback => {
                    try {
                        callback(notificationEventData);
                    } catch (error) {
                        console.error(`Error in listener for event ${eventType}:`, error);
                    }
                });
            }
        }
    };

    const stop = () => {
        if (ws) {
            console.log("🔴 WebSocketInstance: Stopping WebSocket client...");
            ws.close();
            ws = null;
        }
    };

    const addListener = (eventType: string, callback: (data: NotificationEventData) => void) => {
        if (!listeners.has(eventType)) {
            listeners.set(eventType, new Set());
        }

        const eventListeners = listeners.get(eventType);
        if (eventListeners) {
            console.log(`WebSocketInstance: Adding listener for event ${eventType}`);
            eventListeners.add(callback);
        }

        // Return a function to remove this listener
        return () => {
            const eventListeners = listeners.get(eventType);
            if (eventListeners) {
                console.log(`WebSocketInstance: Removing listener for event ${eventType}`);
                eventListeners.delete(callback);
                if (eventListeners.size === 0) {
                    listeners.delete(eventType);
                }
            }
        };
    };

    return {
        start,
        stop,
        addListener,
    };
};
