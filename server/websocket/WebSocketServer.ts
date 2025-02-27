import https from "https";
import fs from "fs";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Server } from 'http';
//
export interface WebSocketServerType {
    start: () => void;
    stop: () => void;
    emit: (ws: WebSocket, type: string, payload: any) => void;
    broadcast: (type: string, payload: any) => void;
    on: (event: string, handler: (ws: WebSocket, data: any) => void) => void;
}

export const WebSocketServerInstance = (createWebSocketServer: () => WebSocketServer): WebSocketServerType => {
    let wss: WebSocketServer | null = null;

    // Event handlers map
    const eventHandlers: { [event: string]: (ws: WebSocket, data: any) => void } = {};

    // Start WebSocket Server
    const start = () => {
        if (wss) {
            console.warn("WebSocket server is already running.");
            return;
        }

        console.log(`✅ Starting WSS server on port ${process.env.SERVER_PORT}...`);
        // Create WebSocket server and attach it to the same HTTPS server
        wss = createWebSocketServer();

        wss.on("connection", (ws) => {
            console.log("🔗 WebSocket client connected");

            // Handle incoming messages
            ws.on("message", (message) => {
                console.log("📩 Received:", message.toString());
                try {
                    const { type, payload } = JSON.parse(message.toString());
                    if (eventHandlers[type]) {
                        eventHandlers[type](ws, payload);
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });

            // Handle client disconnects
            ws.on("close", () => {
                console.log("❌ WebSocket client disconnected");
            });

            // Handle errors
            ws.on("error", (error) => {
                console.error("WebSocket error:", error);
            });
        });

        // // Start the server (HTTPS + WebSocket)
        // server.listen(port, () => {
        //     console.log(`Secure WebSocket server running on wss://localhost:${port}`);
        // });
    };

    // Stop WebSocket Server
    const stop = () => {
        if (wss) {
            console.log("🔴 Stopping WebSocket server...");
            wss.close();
            wss = null;
        }
    };

    // Emit message to a single client
    const emit = (ws: WebSocket, type: string, payload: any) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, payload }));
        }
    };

    // Broadcast message to all clients
    const broadcast = (type: string, payload: any) => {
        if (wss) {
            console.log(`🔄 Broadcasting message to all clients: ${type}, ${payload}`);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type, payload }));
                }
            });
        }
    };

    // Register event handlers for specific WebSocket events
    const on = (event: string, handler: (ws: WebSocket, data: any) => void) => {
        eventHandlers[event] = handler;
    };

    return {
        start,
        stop,
        emit,
        broadcast,
        on,
    };
};