import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['milk', 'egg', 'manure', 'wool', 'meat'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be a positive number'],
  },
  unit: {
    type: String,
    required: true,
    default: 'unit',
  },
  source: {
    type: String,
    required: true,
    default: 'manual',
  },
  icon: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Auto-assign icon based on product type if none provided
productSchema.pre('save', function (next) {
  if (!this.icon) {
    const iconMap = {
      milk: '/icons/milk.png',
      egg: '/icons/egg.png',
      manure: '/icons/manure.png',
    };
    this.icon = iconMap[this.type] || '/icons/fallback.png';
  }
  next();
});

export default mongoose.model('Product', productSchema);
