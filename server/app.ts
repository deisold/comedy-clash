import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { useServerContext } from './di/ServerContext.js';
import { AuthUser } from './store/AuthStore.js';
//
const { showRoutes, showRoutesMock, showService, authStore } = useServerContext;
//
console.log(`showService: ${showService}, showService.getShow: ${showService.getShow}`);
const app = express();

// Middleware
app.use(cors()); // Enables CORS for all incoming requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Comedy Clash backend!' });
});

const isMockMode = process.env.USE_MOCK_MODE === 'true';
// Routes
const routePrefix = '/api';
app.use(`${routePrefix}/`, showRoutes.bind());
if (isMockMode) {
  console.log(`🔄 Mock mode is enabled: adding mock routes to ${routePrefix}/mock`);
  app.use(`${routePrefix}/mock`, showRoutesMock.bind());
}


// Auth: setup fake user
const fakeUser: AuthUser = {
  walletAddress: '0x1234567890123456789012345678901234567890',
  userId: 'diego01',
  token: 'bearer 1234567890'
};
authStore.login(fakeUser);

export default app;