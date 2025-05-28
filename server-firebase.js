import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = getFirestore();
const server = express();
const PORT = process.env.PORT || 5000;

// Middleware
server.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
server.use(express.json());

// Add request logging middleware
server.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// Error handling middleware
server.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Get user profile
server.get('/api/users/profile', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Fetching profile for email:', email);
    
    if (!email) {
      console.log('No email provided in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    const userDoc = await db.collection('users').doc(email).get();
    
    if (!userDoc.exists) {
      // If user doesn't exist, create a new one with default values
      const newUser = {
        email,
        name: email.split('@')[0],
        nutritionGoals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 70
        }
      };
      
      await db.collection('users').doc(email).set(newUser);
      console.log('Created new user:', newUser);
      return res.json(newUser);
    }
    
    console.log('Sending user data:', userDoc.data());
    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message 
    });
  }
});

// Create or update user
server.post('/api/users/profile', async (req, res) => {
  try {
    const { email, name, nutritionGoals } = req.body;
    
    console.log('Received request body:', req.body);
    
    if (!email) {
      console.log('Email missing in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Processing profile update request:', { email, name, nutritionGoals });
    
    // Check if user exists
    const userDoc = await db.collection('users').doc(email).get();
    console.log('User document exists:', userDoc.exists);
    
    if (userDoc.exists) {
      // Update existing user
      console.log('Updating existing user...');
      const updateData = {};
      if (name) updateData.name = name;
      if (nutritionGoals) {
        // Validate nutrition goals
        if (typeof nutritionGoals !== 'object') {
          console.log('Invalid nutrition goals format:', nutritionGoals);
          return res.status(400).json({ error: 'Invalid nutrition goals format' });
        }
        
        const { calories, protein, carbs, fat } = nutritionGoals;
        console.log('Nutrition goals values:', { calories, protein, carbs, fat });
        
        if ([calories, protein, carbs, fat].some(val => typeof val !== 'number' || val < 0)) {
          console.log('Invalid nutrition values detected');
          return res.status(400).json({ error: 'Invalid nutrition goals values' });
        }
        
        updateData.nutritionGoals = {
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat)
        };
      }
      
      console.log('Updating user with data:', updateData);
      await db.collection('users').doc(email).update(updateData);
      const updatedDoc = await db.collection('users').doc(email).get();
      console.log('User updated successfully:', updatedDoc.data());
      res.json({ 
        message: 'User updated successfully', 
        user: updatedDoc.data()
      });
    } else {
      // Create new user
      console.log('Creating new user...');
      const newUser = {
        email,
        name: name || email.split('@')[0],
        nutritionGoals: nutritionGoals ? {
          calories: Number(nutritionGoals.calories),
          protein: Number(nutritionGoals.protein),
          carbs: Number(nutritionGoals.carbs),
          fat: Number(nutritionGoals.fat)
        } : {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 70
        }
      };
      
      await db.collection('users').doc(email).set(newUser);
      console.log('New user created:', newUser);
      res.status(201).json({ 
        message: 'User created successfully', 
        user: newUser
      });
    }
  } catch (error) {
    console.error('Error saving user:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to save user',
      details: error.message,
      code: error.code
    });
  }
});

// Update user nutrition goals
server.put('/api/users/:email/goals', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.email).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await db.collection('users').doc(req.params.email).update({
      nutritionGoals: req.body
    });
    
    const updatedDoc = await db.collection('users').doc(req.params.email).get();
    res.json({ 
      message: 'Nutrition goals updated successfully', 
      user: updatedDoc.data() 
    });
  } catch (error) {
    console.error('Error updating nutrition goals:', error);
    res.status(500).json({ error: 'Failed to update nutrition goals' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 