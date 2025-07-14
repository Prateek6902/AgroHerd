import Feeding from '../models/Feeding.js';

// GET all feeding schedules for the logged-in user
export const getFeedings = async (req, res) => {
  try {
    const feedings = await Feeding.find({ user: req.user._id });
    res.json(feedings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedings' });
  }
};

// POST a new feeding schedule
export const addFeeding = async (req, res) => {
  try {
    const { animalType, time, food, quantity } = req.body;

    if (!animalType || !time || !food) {
      return res.status(400).json({ message: 'Animal type, time, and food are required' });
    }

    const newFeeding = await Feeding.create({
      animalType,
      time,
      food,
      quantity: quantity || '1', // default to '1' if not provided
      user: req.user._id,
    });

    res.status(201).json(newFeeding);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add feeding schedule' });
  }
};

// PUT update feeding schedule
export const updateFeeding = async (req, res) => {
  try {
    const updated = await Feeding.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Feeding record not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update feeding record' });
  }
};

// DELETE a feeding schedule
export const deleteFeeding = async (req, res) => {
  try {
    const deleted = await Feeding.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Feeding record not found' });
    }

    res.json({ message: 'Feeding record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feeding record' });
  }
};
