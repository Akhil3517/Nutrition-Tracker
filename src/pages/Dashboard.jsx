
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import FoodRecognition from '../components/FoodRecognition';
import NutritionTracker from '../components/NutritionTracker';
import MealList from '../components/MealList';
import { toast } from "../hooks/use-toast";
import './Dashboard.css';

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [recognizedFoods, setRecognizedFoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
    
    // Load saved meals from localStorage
    const savedMeals = localStorage.getItem('savedMeals');
    if (savedMeals) {
      try {
        setFoods(JSON.parse(savedMeals));
      } catch (error) {
        console.error('Error loading saved meals:', error);
        setFoods([]);
      }
    }
  }, [navigate]);

  const handleFoodRecognized = (detectedFoods) => {
    // Update the recognizedFoods state with the detected foods
    setRecognizedFoods(detectedFoods);
  };

  const addFoodToLog = () => {
    if (recognizedFoods.length > 0) {
      // Add all recognized foods with the current selected date and current time
      const now = new Date();
      const currentTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
      
      const foodsWithDate = recognizedFoods.map(food => ({
        ...food,
        date: currentTime.toISOString()
      }));
      
      const updatedFoods = [...foods, ...foodsWithDate];
      setFoods(updatedFoods);
      setRecognizedFoods([]);
      
      // Save to localStorage
      localStorage.setItem('savedMeals', JSON.stringify(updatedFoods));
      
      toast({
        title: "Food Added",
        description: `${recognizedFoods.length} food item(s) added to your meal log.`,
      });
    }
  };

  const removeFoodFromLog = (index) => {
    const foodsForDate = foods.filter(food => 
      food.date && new Date(food.date).toDateString() === selectedDate.toDateString()
    );
    
    const foodToRemove = foodsForDate[index];
    const updatedFoods = foods.filter(food => food !== foodToRemove);
    
    setFoods(updatedFoods);
    localStorage.setItem('savedMeals', JSON.stringify(updatedFoods));
    
    toast({
      title: "Food Removed",
      description: "Item removed from your meal log.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filter foods based on selected date
  const foodsForSelectedDate = foods.filter(food => {
    if (!food.date) return false; // Only show foods with dates
    return new Date(food.date).toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="dashboard-page">
      <Sidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Dashboard</h1>
          <div className="dashboard-actions">
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
            <button className="btn btn-danger ml-4" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        
        <div className="food-recognition-section card">
          <h2 className="section-title">Food Recognition</h2>
          <FoodRecognition onFoodRecognized={handleFoodRecognized} />
          
          {recognizedFoods.length > 0 && (
            <div className="recognized-foods-container">
              <h3>Recognized Foods Summary</h3>
              <div className="recognized-foods-list">
                {recognizedFoods.map((food, index) => (
                  <div key={index} className="recognized-food-card">
                    <div className="recognized-food-info">
                      <h4>{food.name}</h4>
                      <div className="nutrition-facts">
                        <div className="nutrition-fact">
                          <span className="label">Weight:</span>
                          <span className="value">{food.weight || 100}g</span>
                        </div>
                        <div className="nutrition-fact">
                          <span className="label">Calories:</span>
                          <span className="value">{food.calories} kcal</span>
                        </div>
                        <div className="nutrition-fact">
                          <span className="label">Protein:</span>
                          <span className="value">{food.protein}g</span>
                        </div>
                        <div className="nutrition-fact">
                          <span className="label">Carbs:</span>
                          <span className="value">{food.carbs}g</span>
                        </div>
                        <div className="nutrition-fact">
                          <span className="label">Fat:</span>
                          <span className="value">{food.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="btn btn-primary mt-4" onClick={addFoodToLog}>
                Add All to Meal Log
              </button>
            </div>
          )}
        </div>
        
        <NutritionTracker addedFoods={foodsForSelectedDate} />
        
        <div className="meal-list-container card">
          <MealList foods={foodsForSelectedDate} onRemoveFood={removeFoodFromLog} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
