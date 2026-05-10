import { User } from '../models/User.js';
import { verifyAuthToken } from '../utils/token.js';

function getBearerToken(headerValue) {
  if (!headerValue || !headerValue.startsWith('Bearer ')) {
    return null;
  }

  return headerValue.slice(7).trim();
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive account',
      });
    }

    req.auth = {
      token,
      user,
      userId: String(user._id),
      role: user.role,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    return next();
  };
}
