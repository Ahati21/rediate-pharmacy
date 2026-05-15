import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Approved', 'Low Stock', 'Expiring', 'Expired', 'Pending'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['pill', 'medication_liquid', 'vaccines'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Medicine = mongoose.model('Medicine', medicineSchema);
