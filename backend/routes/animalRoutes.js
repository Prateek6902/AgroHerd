import express from 'express';
import {
  getAllAnimals,
  getAnimalsByType,
  addAnimal,
  updateAnimal,
  deleteAnimal,
  reduceAnimalCount,
} from '../controllers/animalController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Get all animals (summary or total count by type)
router.get('/', requireAuth, getAllAnimals);

// ✅ Get specific type of animal (with breakdown by age/breed)
router.get('/:type', requireAuth, getAnimalsByType);

// ✅ Add new animals (requires type, ageGroup, breedGroup, count)
router.post('/', requireAuth, addAnimal);

// ✅ Update existing animal count or info
router.put('/:id', requireAuth, updateAnimal);

// ✅ Delete a specific animal entry by ID
router.delete('/:id', requireAuth, deleteAnimal);
router.patch('/:id/reduce', requireAuth, reduceAnimalCount); // ✅ new route

export default router;
