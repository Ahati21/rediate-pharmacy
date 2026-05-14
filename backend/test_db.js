import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rediate_pharmacy';
console.log('Testing connection to:', uri);

try {
  await mongoose.connect(uri);
  console.log('Successfully connected to MongoDB!');
  process.exit(0);
} catch (err) {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
}
