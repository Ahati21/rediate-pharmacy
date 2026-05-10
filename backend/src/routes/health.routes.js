import { Router } from 'express';
import fs from 'node:fs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import packageJson from '../../package.json' with { type: 'json' };

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Rediate Pharmacy API is running',
    environment: env.nodeEnv,
    version: packageJson.version,
    databaseState: mongoose.connection.readyState,
    uploadsReady: fs.existsSync(env.uploadDir),
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
