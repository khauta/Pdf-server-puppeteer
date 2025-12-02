import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import healthcheck from 'express-healthcheck';
import dotenv from 'dotenv';
import { apiKeyAuth } from './middleware/auth';
import { limiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import pdfRoutes from './routes/pdf.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb', type: 'application/json' })); // Only parse JSON for application/json
app.use(pinoHttp());


// Health check (public)
app.use('/health', healthcheck());

// API Routes (protected)
app.use(limiter);
app.use(apiKeyAuth);
app.use('/', pdfRoutes);

// Error handling
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
