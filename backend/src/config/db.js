import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectToDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    dbName: env.dbName,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}/${env.dbName}`);
}
