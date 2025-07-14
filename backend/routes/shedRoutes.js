import express from 'express';
import {
  getSheds,
  addShed,
  updateShed,
  deleteShed,
} from '../controllers/shedController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // ✅ Protects all shed routes

router.get('/', getSheds);         // 🔍 Fetch all sheds for logged-in user
router.post('/', addShed);         // ➕ Create new shed
router.put('/:id', updateShed);    // ✏️ Update shed by ID
router.delete('/:id', deleteShed); // ❌ Delete shed by ID

export default router;
