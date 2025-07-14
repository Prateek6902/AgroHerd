import Product from '../models/Product.js';
import Animal from '../models/Animal.js';

export const getMilkAnalytics = async (req, res) => {
  try {
    const milkData = await Product.find({ type: 'milk', user: req.user._id })
      .sort({ date: -1 }).limit(7);
    res.json(milkData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch milk data' });
  }
};

export const getEggAnalytics = async (req, res) => {
  try {
    const eggData = await Product.find({ type: 'egg', user: req.user._id })
      .sort({ date: -1 }).limit(7);
    res.json(eggData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch egg data' });
  }
};

export const getAnimalAnalytics = async (req, res) => {
  try {
    const result = await Animal.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$type', count: { $sum: '$count' } } }
    ]);
    const formatted = result.map((a) => ({ type: a._id, count: a.count }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch animal data' });
  }
};

export const getAnimalAgeAnalytics = async (req, res) => {
  try {
    const result = await Animal.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$ageGroup', count: { $sum: '$count' } } }
    ]);
    const formatted = result.map((a) => ({ ageGroup: a._id, count: a.count }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch age group data' });
  }
};

export const getDetailedProductAnalytics = async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { type: '$type', source: '$source' },
          total: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          type: '$_id.type',
          source: '$_id.source',
          total: 1,
          _id: 0
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product breakdown' });
  }
};
