
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import MealList from '../components/MealList';
import './MealLog.css';

const MealLog = () => {
  const [foods, setFoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  useEffect(() => {
    // Load meals from localStorage
    const savedMeals = localStorage.getItem('savedMeals');
    if (savedMeals) {
      try {
        setFoods(JSON.parse(savedMeals));
      } catch (error) {
        console.error('Error loading saved meals:', error);
        setFoods([]);
      }
    }
  }, []);
  
  const removeFoodFromLog = (index) => {
    const foodsForDate = foods.filter(food => 
      food.date && new Date(food.date).toDateString() === selectedDate.toDateString()
    );
    
    const foodToRemove = foodsForDate[index];
    const updatedFoods = foods.filter(food => food !== foodToRemove);
    
    setFoods(updatedFoods);
    localStorage.setItem('savedMeals', JSON.stringify(updatedFoods));
  };

  // Filter foods based on selected date
  const foodsForSelectedDate = foods.filter(food => {
    if (!food.date) return false; // Only show foods with dates
    return new Date(food.date).toDateString() === selectedDate.toDateString();
  });
  
  // Calculate nutrition totals
  const nutritionTotals = foodsForSelectedDate.reduce((totals, food) => {
    return {
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

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
                    "w-[200px] justify-start text-left font-normal ml-4",
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
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="meal-log-summary">
          <div className="nutrition-totals">
            <h3>Daily Nutrition Totals</h3>
            <div className="nutrition-cards">
              <div className="nutrition-card">
                <div className="nutrition-icon calories-icon">🔥</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.calories.toFixed(0)}</span>
                  <span className="nutrition-label">Calories</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon protein-icon">🥩</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.protein.toFixed(1)}g</span>
                  <span className="nutrition-label">Protein</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon carbs-icon">🍚</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.carbs.toFixed(1)}g</span>
                  <span className="nutrition-label">Carbs</span>
                </div>
              </div>
              
              <div className="nutrition-card">
                <div className="nutrition-icon fat-icon">🥑</div>
                <div className="nutrition-info">
                  <span className="nutrition-value">{nutritionTotals.fat.toFixed(1)}g</span>
                  <span className="nutrition-label">Fat</span>
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
