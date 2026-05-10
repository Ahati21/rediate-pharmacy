import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { toPublicDocument } from '../utils/mongoose.js';
import { createAuthToken } from '../utils/token.js';

const router = Router();

function toAuthResponse(user) {
  const publicUser = toPublicDocument(user);
  const token = createAuthToken({
    sub: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    ...publicUser,
    token,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: 'customer',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: toAuthResponse(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please register first.',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account does not have a password. Please contact the admin.',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${user.role}`,
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: toAuthResponse(user),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    data: toAuthResponse(req.auth.user),
  });
});

export default router;
