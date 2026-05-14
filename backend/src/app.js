import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'node:path';
import apiRoutes from './routes/index.js';
import { env } from './config/env.js';

export const app = express();

const allowedOrigins = new Set([
  env.clientUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(limiter);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Rediate Pharmacy backend',
  });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, error);

  if (error?.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path || 'resource'} identifier`,
    });
  }

  if (error?.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request payload is too large',
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with the same unique value already exists',
      details: error.keyValue,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});
