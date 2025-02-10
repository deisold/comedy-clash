import express, { Request, Response } from 'express';
import cors from "cors";    
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(cors()); // Enables CORS for all incoming requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads

const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Comedy Clash backend!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
}); 