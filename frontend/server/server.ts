import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from './config/database_config.js';
import dotenv from 'dotenv';
//
dotenv.config();
//
const app = express();

// Middleware
app.use(cors()); // Enables CORS for all incoming requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(express.json());

const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Comedy Clash backend!' });
});

// Create a startup function to handle async operations
async function startServer() {
  try {
    // Connect to database first
    await connectDB();

    // Start server after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

    // Handle Unhandled Promise Rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error(`Unhandled Rejection: ${err.message}`);

      // Gracefully close the server
      server.close(async () => {
        console.log("Shutting down gracefully...");
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