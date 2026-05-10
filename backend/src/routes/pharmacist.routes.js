import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Pharmacist } from '../models/Pharmacist.js';
import { User } from '../models/User.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';

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

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: 'pharmacist',
      isActive: status !== 'Inactive',
    });

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

    const pharmacist = await Pharmacist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacist not found',
      });
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

    res.json({
      success: true,
      message: 'Pharmacist deleted successfully',
      data: toPublicDocument(pharmacist),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
