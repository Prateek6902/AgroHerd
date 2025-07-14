// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // optional: exclude password
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // now req.user has _id, name, email, etc.
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
