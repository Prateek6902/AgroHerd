import Animal from '../models/Animal.js';
import Shed from '../models/Shed.js';

// Add Animal
export const addAnimal = async (req, res) => {
  try {
    const { type, ageGroup, breedGroup, count, shedId } = req.body;

    if (!type || !ageGroup || !breedGroup || !count || !shedId) {
      return res.status(400).json({ message: 'All fields including shed are required' });
    }

    const shed = await Shed.findOne({ _id: shedId, user: req.user._id });
    if (!shed) return res.status(404).json({ message: 'Shed not found' });

    if (shed.animal.toLowerCase() !== type.toLowerCase()) {
      return res.status(400).json({ message: `This shed is assigned to ${shed.animal}` });
    }

    const existing = await Animal.aggregate([
      { $match: { user: req.user._id, shed: shed._id, type: type.toLowerCase() } },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);

    const totalInShed = existing[0]?.total || 0;
    const remaining = shed.capacity - totalInShed;

    if (count > remaining) {
      return res.status(400).json({
        message: `Only ${remaining} spots left in shed "${shed.name}". Reduce animal count.`,
      });
    }

    const animal = await Animal.create({
      type: type.toLowerCase(),
      ageGroup,
      breedGroup,
      count,
      user: req.user._id,
      shed: shed._id,
    });

    res.status(201).json(animal);
  } catch (err) {
    console.error('Add animal error:', err);
    res.status(500).json({ message: 'Failed to add animal' });
  }
};

// Get All Animals
export const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ user: req.user._id }).populate('shed', 'name');
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch animals' });
  }
};

// Get Animals By Type
export const getAnimalsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const animals = await Animal.find({ type, user: req.user._id });

    const ageGroups = {};
    const breedGroups = {};

    animals.forEach((animal) => {
      ageGroups[animal.ageGroup] = (ageGroups[animal.ageGroup] || 0) + animal.count;
      breedGroups[animal.breedGroup] = (breedGroups[animal.breedGroup] || 0) + animal.count;
    });

    const total = animals.reduce((sum, animal) => sum + animal.count, 0);
    res.json({ total, ageGroups, breedGroups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch animals by type' });
  }
};

// Update Animal
export const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update animal' });
  }
};

// Delete Animal
export const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.json({ message: 'Animal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete animal' });
  }
};

// Reduce Animal Count
export const reduceAnimalCount = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const animal = await Animal.findOne({ _id: id, user: req.user._id });
    if (!animal) return res.status(404).json({ message: 'Animal record not found' });

    if (animal.count <= quantity) {
      await animal.deleteOne();
      return res.json({ message: 'Animal record deleted (count reduced to 0)' });
    } else {
      animal.count -= quantity;
      await animal.save();
      return res.json({ message: 'Animal count reduced', updated: animal });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to reduce animal count' });
  }
};
