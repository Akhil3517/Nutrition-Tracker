import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile and nutrition goals
router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update user profile
router.post('/profile', async (req, res) => {
  try {
    const { email, name, nutritionGoals } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.name = name;
      if (nutritionGoals) {
        user.nutritionGoals = nutritionGoals;
      }
      await user.save();
    } else {
      // Create new user
      user = new User({
        email,
        name,
        nutritionGoals
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update nutrition goals
router.put('/nutrition-goals', async (req, res) => {
  try {
    const { email, nutritionGoals } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.nutritionGoals = nutritionGoals;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 