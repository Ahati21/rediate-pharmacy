import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users.map(toPublicDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user identifier',
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: toPublicDocument(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { password, email, name, ...rest } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: toPublicDocument({
        ...user.toObject(),
        password: undefined,
      }),
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
        message: 'Invalid user identifier',
      });
    }

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const payload = { ...req.body };

    if (payload.email) {
      const userWithEmail = await User.findOne({
        email: String(payload.email).toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (userWithEmail) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email',
        });
      }
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: toPublicDocument(user),
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
        message: 'Invalid user identifier',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: toPublicDocument(user),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
