import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nutritionGoals: {
    calories: {
      type: Number,
      default: 2000
    },
    protein: {
      type: Number,
      default: 150
    },
    carbs: {
      type: Number,
      default: 200
    },
    fat: {
      type: Number,
      default: 70
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema); 