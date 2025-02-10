import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from './config/database_config.js';

//
const app = express();

// Middleware
app.use(cors()); // Enables CORS for all incoming requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Comedy Clash backend!' });
});

export default app;