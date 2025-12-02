"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pino_http_1 = __importDefault(require("pino-http"));
const express_healthcheck_1 = __importDefault(require("express-healthcheck"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
const rateLimit_1 = require("./middleware/rateLimit");
const errorHandler_1 = require("./middleware/errorHandler");
const pdf_routes_1 = __importDefault(require("./routes/pdf.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb', type: 'application/json' })); // Only parse JSON for application/json
app.use((0, pino_http_1.default)());
// Health check (public)
app.use('/health', (0, express_healthcheck_1.default)());
// API Routes (protected)
app.use(rateLimit_1.limiter);
app.use(auth_1.apiKeyAuth);
app.use('/', pdf_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
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
