import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getProducts);
router.post('/', requireAuth, addProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct); // ✅ this line is crucial

export default router;
