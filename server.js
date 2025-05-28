import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

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
const isProduction = process.env.NODE_ENV === 'production';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
server.use(cors({
  origin: isProduction 
    ? ['https://nutrition-tracker-five.vercel.app', 'https://nutrition-tracker.vercel.app', 'http://localhost:3000']
    : ['http://localhost:8080', 'http://localhost:5000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true
}));

server.use(express.json());

// Add request logging middleware
server.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Origin:', req.headers.origin);
  console.log('Environment:', isProduction ? 'Production' : 'Development');
  next();
});

// Serve static files from the dist directory
server.use(express.static(path.join(__dirname, 'dist')));

// API Routes
server.get('/api/users/profile', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('GET /api/users/profile - Request received');
    console.log('Query parameters:', req.query);
    console.log('Headers:', req.headers);
    
    if (!email) {
      console.log('No email provided in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Fetching profile for email:', email);
    const userDoc = await db.collection('users').doc(email).get();
    console.log('Firestore response:', userDoc.exists ? 'User found' : 'User not found');
    
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
      
      console.log('Creating new user with data:', newUser);
      await db.collection('users').doc(email).set(newUser);
      console.log('New user created successfully');
      return res.json(newUser);
    }
    
    const userData = userDoc.data();
    console.log('Sending user data:', userData);
    res.json(userData);
  } catch (error) {
    console.error('Error in /api/users/profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message,
      stack: isProduction ? undefined : error.stack
    });
  }
});

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
    console.error('Error saving user:', error);
    res.status(500).json({ 
      error: 'Failed to save user',
      details: error.message
    });
  }
});

// Error handling middleware
server.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: isProduction ? undefined : err.stack
  });
});

// Handle all other routes by serving the index.html
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log('CORS allowed origins:', isProduction 
    ? ['https://nutrition-tracker-five.vercel.app', 'https://nutrition-tracker.vercel.app', 'http://localhost:3000']
    : ['http://localhost:8080', 'http://localhost:5000', 'http://localhost:3000']);
}); 