import mongoose from 'mongoose';

const feedingSchema = new mongoose.Schema({
  animalType: { type: String, required: true },
  food: { type: String, required: true },
  quantity: { type: String, required: true },
  time: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model('Feeding', feedingSchema);
