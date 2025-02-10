import { connectDB } from './config/database_config.js';
import dotenv from 'dotenv';
import app from './app.js';
import { envPath } from './utils/env_paht.js';

dotenv.config({ path: envPath });
//
const PORT = 5000;

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