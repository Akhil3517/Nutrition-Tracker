
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MealPlanner from '../components/MealPlanner';
import { detectDeficiencies } from '../utils/nutrientUtils';
import { format, addDays, startOfWeek } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMeals } from '../services/mealService';
import './MealPlanningPage.css';

interface Deficiency {
  nutrient: string;
  foodSuggestions: string[];
}

interface SavedMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp?: string;
  id?: string;
  [key: string]: any;
}

const MealPlanningPage = () => {
  const [savedMeals, setSavedMeals] = useState([]);
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date()));
  const [deficiencies, setDeficiencies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load saved meals from API
    const loadMeals = async () => {
      try {
        setLoading(true);
        const mealsData = await fetchMeals();
        setSavedMeals(mealsData);
        
        // Load user profile for nutrition goals
        const userProfileData = localStorage.getItem('userProfile');
        if (userProfileData) {
          try {
            const userProfile = JSON.parse(userProfileData);
            // Detect deficiencies based on recent meals and user goals
            const deficiencyList = detectDeficiencies(mealsData, userProfile);
            setDeficiencies(deficiencyList);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeals();
  }, []);
  
  const startNewWeekPlan = () => {
    setWeekStartDate(startOfWeek(new Date()));
  };
  
  const getDayLabel = (dayOffset) => {
    const date = addDays(weekStartDate, dayOffset);
    return format(date, 'EEEE (MMM d)');
  };
  
  return (
    <div className="meal-planning-page">
      <Sidebar />
      
      <div className="meal-planning-content">
        <div className="meal-planning-header">
          <h1>Meal Prepping Planner</h1>
          <p className="text-muted-foreground">Plan your meals in advance for the week based on your nutrition needs.</p>
          <button className="btn btn-primary" onClick={startNewWeekPlan}>
            Start New Week Plan
          </button>
        </div>
        
        {loading ? (
          <p>Loading meal data...</p>
        ) : (
          <>
            {deficiencies.length > 0 && (
              <div className="deficiency-alerts">
                <h2>Nutrition Deficiencies Detected</h2>
                {deficiencies.map((deficiency, index) => (
                  <Alert key={index} variant="destructive" className="deficiency-alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{deficiency.nutrient} Deficiency</AlertTitle>
                    <AlertDescription>
                      Your {deficiency.nutrient} intake is below recommended levels. 
                      Consider adding more {deficiency.foodSuggestions.join(', ')} to your diet.
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
            
            <div className="weekly-plan-container">
              <h2>Your Weekly Meal Plan</h2>
              
              <div className="week-days">
                {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => (
                  <div key={dayOffset} className="day-plan">
                    <h3>{getDayLabel(dayOffset)}</h3>
                    <MealPlanner 
                      date={addDays(weekStartDate, dayOffset)} 
                      deficiencies={deficiencies}
                      savedMeals={savedMeals}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MealPlanningPage;
