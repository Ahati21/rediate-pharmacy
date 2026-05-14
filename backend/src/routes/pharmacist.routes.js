import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Pharmacist } from '../models/Pharmacist.js';
import { User } from '../models/User.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';
import Notification from '../models/Notification.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin', 'pharmacist'), async (_req, res, next) => {
  try {
    const pharmacists = await Pharmacist.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pharmacists.length,
      data: pharmacists.map(toPublicDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, requireRole('admin', 'pharmacist'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pharmacist identifier',
      });
    }

    const pharmacist = await Pharmacist.findById(req.params.id);

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found',
      });
    }

    res.json({
      success: true,
      data: toPublicDocument(pharmacist),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, employeeId, role, email, phone, status = 'Pending', avatar, password } = req.body;

    if (!name || !employeeId || !role || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, employee ID, specialization, email, phone, and password are required',
      });
    }

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A login account already exists with this email',
      });
    }

    const existingPharmacist = await Pharmacist.findOne({
      $or: [{ email: normalizedEmail }, { employeeId }],
    });

    if (existingPharmacist) {
      return res.status(409).json({
        success: false,
        message: 'A pharmacist already exists with this email or employee ID',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pharmacist = await Pharmacist.create({
      name,
      employeeId,
      role,
      email: normalizedEmail,
      phone,
      status,
      avatar,
    });

    const pharmacistUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: 'pharmacist',
      isActive: status !== 'Inactive',
    });

    // Create notification for the new pharmacist
    try {
      await Notification.create({
        user: pharmacistUser._id,
        title: 'Welcome to Rediate Pharmacy',
        message: 'Your professional account has been created successfully. You can now access the clinical queue.',
        type: 'success',
        link: '/pharmacist/queue',
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'Pharmacist and login account created successfully',
      data: toPublicDocument(pharmacist),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pharmacist identifier',
      });
    }

    const { email, status } = req.body;
    const existingPharmacist = await Pharmacist.findById(req.params.id);
    if (!existingPharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found',
      });
    }

    const pharmacist = await Pharmacist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Update corresponding user if email or status changed
    try {
      const updateData = {};
      if (email) updateData.email = email.trim().toLowerCase();
      if (status) updateData.isActive = status === 'Approved';
      
      if (Object.keys(updateData).length > 0) {
        await User.findOneAndUpdate({ email: existingPharmacist.email }, updateData);
      }
    } catch (err) {
      console.error('Failed to sync user update:', err);
    }

    res.json({
      success: true,
      message: 'Pharmacist updated successfully',
      data: toPublicDocument(pharmacist),
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pharmacist identifier',
      });
    }

    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found',
      });
    }

    // Delete corresponding user account
    try {
      await User.findOneAndDelete({ email: pharmacist.email });
    } catch (err) {
      console.error('Failed to delete pharmacist user account:', err);
    }

    res.json({
      success: true,
      message: 'Pharmacist and login account deleted successfully',
      data: toPublicDocument(pharmacist),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
