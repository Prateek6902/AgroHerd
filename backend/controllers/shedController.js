// controllers/shedController.js
import Shed from '../models/Shed.js';

export const getSheds = async (req, res) => {
  try {
    const sheds = await Shed.find({ user: req.user._id });
    res.status(200).json(sheds);
  } catch (error) {
    console.error('getSheds error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch sheds' });
  }
};

export const addShed = async (req, res) => {
  try {
    const { name, animal, capacity } = req.body;
    const parsedCapacity = Number(capacity);

    if (!name || !animal || isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        message: 'All fields are required and capacity must be a positive number',
      });
    }

    const shed = await Shed.create({
      name: name.trim(),
      animal,
      capacity: parsedCapacity,
      user: req.user._id,
    });

    res.status(201).json(shed);
  } catch (error) {
    console.error('addShed error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to add shed' });
  }
};

export const updateShed = async (req, res) => {
  try {
    const { name, animal, capacity } = req.body;
    const parsedCapacity = Number(capacity);

    if (!name || !animal || isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        message: 'All fields are required and capacity must be a positive number',
      });
    }

    const updated = await Shed.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name: name.trim(), animal, capacity: parsedCapacity },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Shed not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('updateShed error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to update shed' });
  }
};

export const deleteShed = async (req, res) => {
  try {
    const deleted = await Shed.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Shed not found' });
    }

    res.status(200).json({ message: 'Shed deleted successfully' });
  } catch (error) {
    console.error('deleteShed error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to delete shed' });
  }
};
