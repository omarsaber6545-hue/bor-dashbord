import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { env } from './config/env';
import apiRoutes from './routes/api.routes';
import { DiscordManager } from './discord/DiscordManager';
import { logger } from './utils/logger';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server
const io = new SocketServer(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Pass Socket.IO instance to Logger and DiscordManager
logger.setSocketServer(io);
const discordManager = DiscordManager.getInstance();
discordManager.setSocketServer(io);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://cdn.discordapp.com'],
      },
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Swagger API Documentation Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Discord Bot Control Center REST API',
      version: '1.0.0',
      description: 'Production-ready REST API & Telemetry endpoints for Discord Bot Management',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount REST Routes
app.use('/api', apiRoutes);

// Socket.IO Connection Event Listener
io.on('connection', (socket) => {
  logger.info('SocketIO', `Dashboard client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info('SocketIO', `Dashboard client disconnected: ${socket.id}`);
  });
});

// Boot Server
server.listen(env.PORT, async () => {
  logger.info('Server', `🚀 Discord Bot Control Center Backend running on port ${env.PORT}`);
  logger.info('Server', `📖 Swagger documentation available at http://localhost:${env.PORT}/api-docs`);

  // Attempt auto-connection from stored database credentials
  await discordManager.autoConnectFromDatabase();
});

export { app, server };
