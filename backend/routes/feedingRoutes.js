// server/routes/feedingRoutes.js
import express from 'express';
import {
  getFeedings,
  addFeeding,
  updateFeeding,
  deleteFeeding,
} from '../controllers/feedingController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Protected routes for feeding operations
router.get('/', requireAuth, getFeedings);
router.post('/', requireAuth, addFeeding);
router.put('/:id', requireAuth, updateFeeding);
router.delete('/:id', requireAuth, deleteFeeding);

export default router;
