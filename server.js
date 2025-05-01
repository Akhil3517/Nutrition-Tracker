const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrition-tracker')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Test route to check MongoDB connection
app.get('/api/test', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: states[dbState],
    message: dbState === 1 ? 'MongoDB is connected' : 'MongoDB is not connected',
    timestamp: new Date().toISOString()
  });
});

// User routes
// Get user by email
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create or update user
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, nutritionGoals } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.nutritionGoals = nutritionGoals || user.nutritionGoals;
      await user.save();
      res.json({ message: 'User updated successfully', user });
    } else {
      // Create new user
      user = new User({
        email,
        name,
        nutritionGoals: nutritionGoals || {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 70
        }
      });
      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Update user nutrition goals
app.put('/api/users/:email/goals', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.nutritionGoals = req.body;
    await user.save();
    
    res.json({ message: 'Nutrition goals updated successfully', user });
  } catch (error) {
    console.error('Error updating nutrition goals:', error);
    res.status(500).json({ error: 'Failed to update nutrition goals' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
