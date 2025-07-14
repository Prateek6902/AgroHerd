// models/Shed.js
import mongoose from 'mongoose';

const shedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  animal: { type: String, required: true },
  capacity: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Shed', shedSchema);