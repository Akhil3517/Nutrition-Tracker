
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create meals log file if it doesn't exist
const mealsLogPath = path.join(dataDir, 'meals.json');
if (!fs.existsSync(mealsLogPath)) {
  fs.writeFileSync(mealsLogPath, JSON.stringify([]));
}

// API Routes
app.get('/api/meals', (req, res) => {
  try {
    const meals = JSON.parse(fs.readFileSync(mealsLogPath, 'utf8'));
    res.json(meals);
  } catch (error) {
    console.error('Error reading meals:', error);
    res.status(500).json({ error: 'Failed to retrieve meals' });
  }
});

app.post('/api/meals', (req, res) => {
  try {
    const meals = JSON.parse(fs.readFileSync(mealsLogPath, 'utf8'));
    const newMeal = {
      ...req.body,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    meals.push(newMeal);
    fs.writeFileSync(mealsLogPath, JSON.stringify(meals, null, 2));
    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error saving meal:', error);
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

app.delete('/api/meals/:id', (req, res) => {
  try {
    const meals = JSON.parse(fs.readFileSync(mealsLogPath, 'utf8'));
    const filteredMeals = meals.filter(meal => meal.id !== req.params.id);
    fs.writeFileSync(mealsLogPath, JSON.stringify(filteredMeals, null, 2));
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
