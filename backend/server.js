// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './routes/userRoutes.js';
import animalRoutes from './routes/animalRoutes.js';
import shedRoutes from './routes/shedRoutes.js';
import productRoutes from './routes/productRoutes.js';
import feedingRoutes from './routes/feedingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs API requests to the console

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/sheds', shedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/feedings', feedingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/', (req, res) => {
  res.send('✅ Farm Management API is running.');
});

// 404 Fallback Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
