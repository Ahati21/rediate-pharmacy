/**
 * createAdmin.js
 * --------------
 * Run this script ONCE to add the admin account to the database.
 * It is SAFE to run multiple times — it will skip creation if the admin already exists.
 *
 * Admin credentials are read from environment variables (or .env file):
 *   ADMIN_EMAIL    (default: admin@rediate.com)
 *   ADMIN_PASSWORD (default: Admin1234)
 *   ADMIN_NAME     (default: Rediate Admin)
 *   ADMIN_PHONE    (optional)
 *
 * Usage (from backend/ directory):
 *   npm run create-admin
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

async function createAdmin() {
  await connectToDatabase();

  const email = env.adminEmail.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role === 'admin') {
      console.log(`✅ Admin already exists: ${email}`);
    } else {
      console.warn(
        `⚠️  An account with "${email}" exists but is NOT an admin (role: ${existing.role}). No changes made.`,
      );
    }
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

  await User.create({
    name: env.adminName,
    email,
    password: hashedPassword,
    phone: env.adminPhone || undefined,
    role: 'admin',
    isActive: true,
  });

  console.log('✅ Admin account created successfully!');
  console.log(`   Email   : ${email}`);
  console.log(`   Password: ${env.adminPassword}`);
  console.log('   ⚠️  Please change the password after first login!');

  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error('❌ Failed to create admin:', error);
  await mongoose.disconnect();
  process.exit(1);
});
