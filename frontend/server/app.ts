import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { serverContext } from './di/ServerContext.js';
//
const { showRoutes, showService } = serverContext;
//
console.log(`showService: ${showService}, showService.getShow: ${showService.getShow}`);
const app = express();

// Middleware
app.use(cors()); // Enables CORS for all incoming requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Comedy Clash backend!' });
});

// Routes
const routePrefix = '/api';
app.use(`${routePrefix}/`, showRoutes.bind());

export default app;