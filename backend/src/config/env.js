import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

const requiredVars = ['MONGODB_URI'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || 'rediate_pharmacy',
  authSecret: process.env.AUTH_SECRET || 'rediate-dev-secret-change-me',
  authExpiresInHours: Number(process.env.AUTH_EXPIRES_IN_HOURS || 24),
  adminName: process.env.ADMIN_NAME || 'Rediate Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@rediate.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin1234',
  adminPhone: process.env.ADMIN_PHONE || '',
  uploadDir: process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads'),
  maxUploadSizeBytes: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 10 * 1024 * 1024),
};
