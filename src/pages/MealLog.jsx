import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from '../contexts/AuthContext';
import { getNutritionData, saveNutritionData } from '../services/nutritionService';
import { toast } from "../hooks/use-toast";

import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import MealList from '../components/MealList';
import ProfileMenu from '../components/ProfileMenu';
import './MealLog.css';
import { normalizeDate, areSameDate } from '../utils/dateUtils';

const MealLog = () => {
  const [foods, setFoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Get nutrition goals from localStorage
  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const savedGoals = localStorage.getItem('nutritionGoals');
    return savedGoals ? JSON.parse(savedGoals) : {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    };
  });

  // Update goals when they change in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGoals = localStorage.getItem('nutritionGoals');
      if (savedGoals) {
        setNutritionGoals(JSON.parse(savedGoals));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to view meal logs",
          variant: "destructive",
        });
        return;
      }

      try {
        setLoading(true);
        const nutritionData = await getNutritionData(currentUser.uid);
        
        if (nutritionData && nutritionData.foods) {
          // Ensure all food entries have normalized dates
          const normalizedFoods = nutritionData.foods.map(food => ({
            ...food,
            date: food.date ? normalizeDate(food.date) : normalizeDate(new Date())
          }));
          setFoods(normalizedFoods);
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

    // Listen for updates from Dashboard
    const handleMealLogUpdate = (event) => {
      if (event.detail && event.detail.foods) {
        // Normalize dates for updated foods
        const normalizedFoods = event.detail.foods.map(food => ({
          ...food,
          date: food.date ? normalizeDate(food.date) : normalizeDate(new Date())
        }));
        setFoods(normalizedFoods);
      }
    };

    window.addEventListener('mealLogUpdate', handleMealLogUpdate);

    return () => {
      window.removeEventListener('mealLogUpdate', handleMealLogUpdate);
    };
  }, [currentUser, selectedDate]); // Reload when date changes
  
  const removeFoodFromLog = async (index) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to remove food items",
        variant: "destructive",
      });
      return;
    }

    try {
      const foodsForDate = foods.filter(food => 
        food.date && areSameDate(food.date, selectedDate)
      );
      
      const foodToRemove = foodsForDate[index];
      const updatedFoods = foods.filter(food => food !== foodToRemove);
      
      // Ensure normalized dates when saving
      const normalizedFoods = updatedFoods.map(food => ({
        ...food,
        date: food.date ? normalizeDate(food.date) : normalizeDate(new Date())
      }));
      
      setFoods(normalizedFoods);
      await saveNutritionData(currentUser.uid, {
        foods: normalizedFoods,
        lastUpdated: new Date().toISOString()
      });

      // Dispatch event to update Dashboard
      const mealLogEvent = new CustomEvent('mealLogUpdate', {
        detail: { foods: normalizedFoods }
      });
      window.dispatchEvent(mealLogEvent);

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

  // Filter foods based on selected date using the areSameDate utility
  const foodsForSelectedDate = foods.filter(food => {
    if (!food.date) return false;
    return areSameDate(food.date, selectedDate);
  });
  
  // Calculate nutrition totals using the same method as Dashboard
  const nutritionTotals = foodsForSelectedDate.reduce((totals, food) => {
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

  // Calculate progress percentages
  const progressPercentages = {
    calories: Math.min((nutritionTotals.calories / nutritionGoals.calories) * 100, 100),
    protein: Math.min((nutritionTotals.protein / nutritionGoals.protein) * 100, 100),
    carbs: Math.min((nutritionTotals.carbs / nutritionGoals.carbs) * 100, 100),
    fat: Math.min((nutritionTotals.fat / nutritionGoals.fat) * 100, 100)
  };

  if (loading) {
    return (
      <div className="meal-log-page">
        <Sidebar />
        <div className="meal-log-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your meal log...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-log-page">
      <Sidebar />
      
      <div className="meal-log-content">
        <div className="meal-log-header">
          <h1>Meal Log</h1>
          
          <div className="meal-log-actions">
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Normalize the selected date
                      const normalizedDate = new Date(normalizeDate(date));
                      setSelectedDate(normalizedDate);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>
        </div>
        
        <div className="meal-log-summary">
          <div className="nutrition-totals">
            <h3>Daily Nutrition Summary</h3>
            <div className="nutrition-cards">
              <div className="nutrition-card">
                <div className="nutrition-icon calories-icon">🔥</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.calories.toFixed(0)}</span>
                  <span className="nutrition-label">Calories</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill calories" 
                      style={{ 
                        width: `${progressPercentages.calories}%`,
                        backgroundColor: progressPercentages.calories > 100 ? 'var(--destructive)' : 'var(--primary)'
                      }}
                    />
                  </div>
                  <span className="progress-text">{progressPercentages.calories.toFixed(0)}% of {nutritionGoals.calories}</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon protein-icon">🥩</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.protein.toFixed(1)}g</span>
                  <span className="nutrition-label">Protein</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill protein" 
                      style={{ 
                        width: `${progressPercentages.protein}%`,
                        backgroundColor: progressPercentages.protein > 100 ? 'var(--destructive)' : 'var(--primary)'
                      }}
                    />
                  </div>
                  <span className="progress-text">{progressPercentages.protein.toFixed(0)}% of {nutritionGoals.protein}g</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon carbs-icon">🍚</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.carbs.toFixed(1)}g</span>
                  <span className="nutrition-label">Carbs</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill carbs" 
                      style={{ 
                        width: `${progressPercentages.carbs}%`,
                        backgroundColor: progressPercentages.carbs > 100 ? 'var(--destructive)' : 'var(--primary)'
                      }}
                    />
                  </div>
                  <span className="progress-text">{progressPercentages.carbs.toFixed(0)}% of {nutritionGoals.carbs}g</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon fat-icon">🥑</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.fat.toFixed(1)}g</span>
                  <span className="nutrition-label">Fat</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill fat" 
                      style={{ 
                        width: `${progressPercentages.fat}%`,
                        backgroundColor: progressPercentages.fat > 100 ? 'var(--destructive)' : 'var(--primary)'
                      }}
                    />
                  </div>
                  <span className="progress-text">{progressPercentages.fat.toFixed(0)}% of {nutritionGoals.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <MealList foods={foodsForSelectedDate} onRemoveFood={removeFoodFromLog} />
      </div>
    </div>
  );
};

export default MealLog;
