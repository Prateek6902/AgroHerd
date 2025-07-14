// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save(); // triggers password hash

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});


// ✅ DEBUG: List users (remove in production)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('❌ Debug route error:', err.message);
    res.status(500).json({ message: 'Could not fetch users' });
  }
});

// ✅ DEBUG: Drop broken index on `username` (run once if needed)
router.get('/debug/drop-username-index', async (req, res) => {
  try {
    await User.collection.dropIndex('username_1');
    res.send('✅ Dropped username_1 index');
  } catch (err) {
    console.error('❌ Failed to drop index:', err.message);
    res.status(500).send('Could not drop index');
  }
});

export default router;
