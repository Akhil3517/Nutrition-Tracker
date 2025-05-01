import express from 'express';
import NutritionLog from '../models/NutritionLog.js';
import User from '../models/User.js';

const router = express.Router();

// Get nutrition logs for a specific date
router.get('/logs', async (req, res) => {
  try {
    const { email, date } = req.query;
    
    // Find user first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get start and end of the requested date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const logs = await NutritionLog.findOne({
      userId: user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    res.json(logs || { foods: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add food items to log
router.post('/logs', async (req, res) => {
  try {
    const { email, date, foods } = req.body;

    // Find user first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create log for the date
    let log = await NutritionLog.findOne({
      userId: user._id,
      date: new Date(date)
    });

    if (!log) {
      log = new NutritionLog({
        userId: user._id,
        date: new Date(date),
        foods: []
      });
    }

    // Add new foods
    log.foods.push(...foods);
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove food item from log
router.delete('/logs/:logId/foods/:foodId', async (req, res) => {
  try {
    const { logId, foodId } = req.params;
    
    const log = await NutritionLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    log.foods = log.foods.filter(food => food._id.toString() !== foodId);
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nutrition summary for date range
router.get('/summary', async (req, res) => {
  try {
    const { email, startDate, endDate } = req.query;
    
    // Find user first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const logs = await NutritionLog.find({
      userId: user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    // Calculate totals
    const summary = logs.reduce((acc, log) => {
      log.foods.forEach(food => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    res.json({
      summary,
      goals: user.nutritionGoals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 