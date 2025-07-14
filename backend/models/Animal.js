import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['cow', 'buffalo', 'pig', 'sheep', 'hen', 'goat'],
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['0-6m', '6m-1y', '1-2y', '2+y'],
  },
  breedGroup: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shed',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Animal', animalSchema);
