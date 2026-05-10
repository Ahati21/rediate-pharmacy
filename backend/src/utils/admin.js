import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function ensureDefaultAdmin() {
  const email = env.adminEmail.toLowerCase();
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    const passwordMatches = existingAdmin.password
      ? await bcrypt.compare(env.adminPassword, existingAdmin.password)
      : false;

    existingAdmin.name = env.adminName;
    existingAdmin.phone = env.adminPhone || existingAdmin.phone;
    existingAdmin.role = 'admin';
    existingAdmin.isActive = true;

    if (!passwordMatches) {
      existingAdmin.password = await bcrypt.hash(env.adminPassword, 10);
      console.log(`Default admin password updated: ${email}`);
    }

    await existingAdmin.save();
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

  const admin = await User.create({
    name: env.adminName,
    email,
    password: hashedPassword,
    phone: env.adminPhone,
    role: 'admin',
    isActive: true,
  });

  console.log(`Default admin account created: ${email}`);
  return admin;
}
