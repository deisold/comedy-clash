import { connectDB } from './config/database_config.js';
import dotenv from 'dotenv';
import app from './app.js';
import { envPath } from './utils/env_paht.js';
import { v2 as cloudinary } from 'cloudinary';
import { useServerContext } from './di/ServerContext.js';
import { ComedyTheaterEventObserverType } from './web3/ComedyTheaterEventObserver.js';
import { WebSocketServerInstance } from './websocket/WebSocketServer.js';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https, { Server as HttpsServer } from 'https';
import { WebSocketServer } from 'ws';
const { comedyTheaterEventObserver, comedyTheaterEventMockObserver, jobQueueProcessor, setWebSocketServerInstance } = useServerContext;
//
dotenv.config({ path: envPath });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//
const HOST = process.env.SERVER_HOST || 'localhost';
const PORT = process.env.SERVER_PORT || 5000;

function startServerAndListen(): http.Server | HttpsServer {
  let server: http.Server | HttpsServer;

  if (process.env.USE_HTTPS === 'true') {
    // HTTPS configuration
    const options = {
      key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH || 'ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH || 'ssl/cert.pem'))
    };

    server = https.createServer(options, app).listen(PORT, () => {
      console.log(`✅ Secure server running on https://${HOST}:${PORT}`);
    });
  } else {
    // Standard HTTP server
    server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://${HOST}:${PORT}`);
    });
  }
  return server;
}
// Create a startup function to handle async operations
async function startServer() {
  try {
    // Connect to database first
    await connectDB();

    // Start server after successful DB connection
    let server: http.Server | HttpsServer = startServerAndListen();

    const webSocketServerInstance = WebSocketServerInstance(() => {
      return new WebSocketServer({ server });
    });
    // Set the webSocketServerInstance for DI
    setWebSocketServerInstance(webSocketServerInstance);
    webSocketServerInstance.start();

    // Start ComedyTheaterEventObserver
    var comedyTheaterLocalEventObserver: ComedyTheaterEventObserverType;
    if (process.env.USE_MOCK_MODE === 'true') {
      console.log(`Server: 🔄 Starting to observe ComedyTheater events (mock mode)`);
      comedyTheaterLocalEventObserver = comedyTheaterEventMockObserver;
    } else {
      console.log(`Server: 🔄 Starting to observe ComedyTheater events`);
      comedyTheaterLocalEventObserver = comedyTheaterEventObserver;
    }
    await comedyTheaterLocalEventObserver.startObserving();

    jobQueueProcessor.start();

    // Handle Unhandled Promise Rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error(`Unhandled Rejection: ${err.message}`);

      comedyTheaterLocalEventObserver.stopObserving();

      // Gracefully close the server
      server.close(async () => {
        console.log("🔴 Shutting down gracefully...");
        process.exit(1);
      });
    });

  } catch (error: unknown) {
    console.error('Failed to start server:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Initialize the server
startServer();