import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNutritionData, saveNutritionData } from '../services/nutritionService';
import { toast } from "../hooks/use-toast";

import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import FoodRecognition from '../components/FoodRecognition';
import NutritionTracker from '../components/NutritionTracker';
import MealList from '../components/MealList';
import ProfileMenu from '../components/ProfileMenu';
import './Dashboard.css';

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [pendingFoods, setPendingFoods] = useState([]);
  const [recognizedFoods, setRecognizedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const savedGoals = localStorage.getItem('nutritionGoals');
    return savedGoals ? JSON.parse(savedGoals) : {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    };
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        navigate('/login', { state: { from: { pathname: '/dashboard' } } });
        return;
      }

      try {
        setLoading(true);
        const nutritionData = await getNutritionData(currentUser.uid);
        
        if (nutritionData && nutritionData.foods) {
          setFoods(nutritionData.foods);
        }
      } catch (error) {
        console.error('Error loading nutrition data:', error);
        toast({
          title: "Error",
          description: "Failed to load nutrition data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, navigate]);

  // Listen for nutrition goals updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'nutritionGoals') {
        try {
          const newGoals = JSON.parse(e.newValue);
          setNutritionGoals(newGoals);
        } catch (error) {
          console.error('Error parsing nutrition goals:', error);
        }
      }
    };

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event for changes from the same window
    const handleGoalsUpdate = (e) => {
      if (e.detail && e.detail.goals) {
        setNutritionGoals(e.detail.goals);
      }
    };
    window.addEventListener('nutritionGoalsUpdate', handleGoalsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nutritionGoalsUpdate', handleGoalsUpdate);
    };
  }, []);

  const nutritionTotals = foods.reduce((totals, food) => {
    const foodCalories = parseFloat(food.calories) || 0;
    const foodProtein = parseFloat(food.protein) || 0;
    const foodCarbs = parseFloat(food.carbs) || 0;
    const foodFat = parseFloat(food.fat) || 0;

    return {
      calories: Number((totals.calories + foodCalories).toFixed(2)),
      protein: Number((totals.protein + foodProtein).toFixed(2)),
      carbs: Number((totals.carbs + foodCarbs).toFixed(2)),
      fat: Number((totals.fat + foodFat).toFixed(2))
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const progressPercentages = {
    calories: Math.min((nutritionTotals.calories / nutritionGoals.calories) * 100, 100),
    protein: Math.min((nutritionTotals.protein / nutritionGoals.protein) * 100, 100),
    carbs: Math.min((nutritionTotals.carbs / nutritionGoals.carbs) * 100, 100),
    fat: Math.min((nutritionTotals.fat / nutritionGoals.fat) * 100, 100)
  };

  const handleFoodRecognized = (detectedFoods) => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
      return;
    }
    setPendingFoods(detectedFoods);
  };

  const handleUpdateMealLog = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
      return;
    }
    try {
      const foodsWithDate = pendingFoods.map(food => ({
        ...food,
        date: new Date().toISOString(),
        addedAt: new Date().toISOString()
      }));
      
      const newFoods = [...foods, ...foodsWithDate];
      setFoods(newFoods);
      setPendingFoods([]);
      
      // Save to Firebase
      await saveNutritionData(currentUser.uid, {
        foods: newFoods,
        lastUpdated: new Date().toISOString()
      });

      // Show success message
      toast({
        title: "Success",
        description: "Food items added to meal log successfully",
      });

      // Force reload of MealLog page if it's open
      const mealLogEvent = new CustomEvent('mealLogUpdate', {
        detail: { foods: newFoods }
      });
      window.dispatchEvent(mealLogEvent);
    } catch (error) {
      console.error('Error saving food data:', error);
      toast({
        title: "Error",
        description: "Failed to save food data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFood = async (index) => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
      return;
    }

    try {
      const newFoods = foods.filter((_, i) => i !== index);
      setFoods(newFoods);
      
      await saveNutritionData(currentUser.uid, {
        foods: newFoods,
        lastUpdated: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Food item removed successfully",
      });
    } catch (error) {
      console.error('Error removing food:', error);
      toast({
        title: "Error",
        description: "Failed to remove food item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your nutrition data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <ThemeToggle />
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="food-recognition-section">
            <FoodRecognition onFoodRecognized={handleFoodRecognized} />
            {pendingFoods.length > 0 && (
              <div className="pending-foods-section">
                <h3>Foods ready to add to meal log:</h3>
                <ul>
                  {pendingFoods.map((food, idx) => (
                    <li key={idx}>{food.name} ({food.weight || 100}g)</li>
                  ))}
                </ul>
                <button className="btn btn-primary mt-2" onClick={handleUpdateMealLog}>
                  Update to Meal Log
                </button>
              </div>
            )}
          </div>

          <div className="nutrition-tracker-section">
            <NutritionTracker
              nutritionTotals={nutritionTotals}
              nutritionGoals={nutritionGoals}
              progressPercentages={progressPercentages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
