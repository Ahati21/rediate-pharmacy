import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/db.js';
import { Medicine } from '../models/Medicine.js';
import { Pharmacist } from '../models/Pharmacist.js';
import { User } from '../models/User.js';

const medicines = [
  {
    name: 'Amoxicillin',
    dosage: '500mg',
    category: 'Antibiotics',
    price: 345,
    stock: 1250,
    batchNumber: 'AX-2024-001',
    expiryDate: '2027-12-01',
    status: 'Approved',
    type: 'pill',
    notes: 'Store below 25C.',
  },
  {
    name: 'Paracetamol Syrup',
    dosage: '100ml Bottle',
    category: 'Analgesics',
    price: 320,
    stock: 12,
    batchNumber: 'PS-2024-089',
    expiryDate: '2026-10-15',
    status: 'Low Stock',
    type: 'medication_liquid',
    notes: 'Shake well before use.',
  },
  {
    name: 'Insulin Glargine',
    dosage: 'Injection',
    category: 'Antidiabetic',
    price: 890,
    stock: 45,
    batchNumber: 'IG-2023-V12',
    expiryDate: '2026-08-20',
    status: 'Expiring',
    type: 'vaccines',
    notes: 'Keep refrigerated.',
  },
];

// Demo pharmacist staff records.
// IMPORTANT: every pharmacist here MUST also have a matching User entry below
// so they can log in with their email + password.
const pharmacists = [
  {
    name: 'Dr. Julian Vance',
    role: 'Senior Clinical Lead',
    employeeId: 'RX-9042',
    email: 'julian.v@rediate.com',
    phone: '+251900000010',
    status: 'Approved',
  },
  {
    name: 'Sarah Sterling',
    role: 'Inventory Specialist',
    employeeId: 'RX-8821',
    email: 's.sterling@rediate.com',
    phone: '+251900000011',
    status: 'Approved',
  },
];

async function seed() {
  await connectToDatabase();

  // Clean only the demo accounts we are about to re-insert
  await Promise.all([
    Medicine.deleteMany({}),
    Pharmacist.deleteMany({}),
    User.deleteMany({
      email: {
        $in: [
          'admin@rediate.com',
          'julian.v@rediate.com',
          's.sterling@rediate.com',
          'customer@rediate.com',
        ],
      },
    }),
  ]);

  await Medicine.insertMany(medicines);
  await Pharmacist.insertMany(pharmacists);

  // Use one hash for all demo accounts (dev convenience)
  const hashedPassword = await bcrypt.hash('Pass1234', 10);

  await User.insertMany([
    // ── Admin ──────────────────────────────────────────
    {
      name: 'Rediate Admin',
      email: 'admin@rediate.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+251900000020',
      isActive: true,
    },

    // ── Pharmacist login accounts ───────────────────────
    // These MUST match the pharmacists array above so that
    // each pharmacist can log in with their email + password.
    {
      name: 'Dr. Julian Vance',
      email: 'julian.v@rediate.com',
      password: hashedPassword,
      role: 'pharmacist',
      phone: '+251900000010',
      isActive: true,
    },
    {
      name: 'Sarah Sterling',
      email: 's.sterling@rediate.com',
      password: hashedPassword,
      role: 'pharmacist',
      phone: '+251900000011',
      isActive: true,
    },

    // ── Demo Customer ───────────────────────────────────
    {
      name: 'Sample Customer',
      email: 'customer@rediate.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+251900000022',
      isActive: true,
    },
  ]);

  console.log('✅ Seed data inserted successfully!\n');
  console.log('Demo login credentials (password for all: Pass1234)');
  console.log('  Admin      → admin@rediate.com');
  console.log('  Pharmacist → julian.v@rediate.com');
  console.log('  Pharmacist → s.sterling@rediate.com');
  console.log('  Customer   → customer@rediate.com');

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await mongoose.disconnect();
  process.exit(1);
});
