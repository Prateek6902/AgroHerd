// userController.js - Placeholder content
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  try {
    const user = new User({ name, email, password });
    await user.save(); // triggers pre-save hook to hash password

    const token = generateToken(user);
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Registration error:', err); // ✅ log this!
    res.status(500).json({ message: 'Error registering user' });
  }
};

