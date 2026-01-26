import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const setTokenCookie = (res, token) => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

export const clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict'
  });
};

export const verifyTokenFromRequest = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return { valid: false, error: 'Invalid token' };
    }
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: false, error: 'Invalid token' };
  }
};
