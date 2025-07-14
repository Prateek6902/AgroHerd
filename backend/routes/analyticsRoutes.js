import express from 'express';
import {
  getMilkAnalytics,
  getEggAnalytics,
  getAnimalAnalytics,
  getAnimalAgeAnalytics,
  getDetailedProductAnalytics
} from '../controllers/analyticsController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // 🔐 apply auth to all routes

router.get('/milk', getMilkAnalytics);
router.get('/eggs', getEggAnalytics);
router.get('/animals', getAnimalAnalytics);
router.get('/animals/age', getAnimalAgeAnalytics);              // ✅ NEW
router.get('/products/detailed', getDetailedProductAnalytics);  // ✅ NEW

export default router;
