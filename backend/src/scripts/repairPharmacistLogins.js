import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/db.js';
import { Pharmacist } from '../models/Pharmacist.js';
import { User } from '../models/User.js';

const defaultPassword = process.env.PHARMACIST_DEFAULT_PASSWORD || 'Pass1234';

async function repairPharmacistLogins() {
  await connectToDatabase();

  const pharmacists = await Pharmacist.find({});
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  let createdCount = 0;
  let skippedCount = 0;

  for (const pharmacist of pharmacists) {
    const email = pharmacist.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      skippedCount += 1;
      continue;
    }

    await User.create({
      name: pharmacist.name,
      email,
      password: hashedPassword,
      phone: pharmacist.phone,
      role: 'pharmacist',
      isActive: pharmacist.status !== 'Inactive',
    });

    createdCount += 1;
    console.log(`Created pharmacist login: ${email}`);
  }

  console.log(`Done. Created ${createdCount} login account(s), skipped ${skippedCount}.`);
  console.log(`Temporary pharmacist password: ${defaultPassword}`);
  await mongoose.disconnect();
}

repairPharmacistLogins().catch(async (error) => {
  console.error('Failed to repair pharmacist logins', error);
  await mongoose.disconnect();
  process.exit(1);
});
