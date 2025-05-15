import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getMonthlyNutritionSummary } from '../services/nutritionService';
import { generateMealPlan } from '../services/geminiService';
import { detectDeficiencies } from '../utils/nutrientUtils';
import { toast } from '../hooks/use-toast';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import { AlertCircle, ChefHat, Clock, Utensils } from 'lucide-react';
import './MealPlanningPage.css';

const MealPlanningPage = () => {
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState([]);
  const [deficiencies, setDeficiencies] = useState([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState(null);
  const { currentUser } = useAuth();

  // Load nutrition goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('nutritionGoals');
    if (savedGoals) {
      setNutritionGoals(JSON.parse(savedGoals));
    }
  }, []);

  const startNewWeekPlan = async () => {
    try {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "Please log in to generate a meal plan",
          variant: "destructive",
        });
        return;
      }

      if (!nutritionGoals) {
        toast({
          title: "Error",
          description: "Please set up your nutrition goals first",
          variant: "destructive",
        });
        return;
      }

      setGeneratingPlan(true);
      
      // Get monthly nutrition summary
      const monthlySummary = await getMonthlyNutritionSummary(currentUser.uid);
      
      if (monthlySummary.daysWithData === 0) {
        toast({
          title: "Notice",
          description: "No nutrition data found for this month. Using default values for meal planning.",
        });
      }
      
      // Generate AI meal plan
      const generatedPlan = await generateMealPlan(monthlySummary, nutritionGoals, deficiencies);
      
      if (generatedPlan && generatedPlan.length > 0) {
        setMealPlan(generatedPlan);
        toast({
          title: "Success",
          description: "New meal plan generated based on your monthly nutrition data",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate meal plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPlan(false);
    }
  };

  const getMealTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍱';
      case 'dinner':
        return '🍽️';
      case 'snack':
        return '🥨';
      default:
        return '🍴';
    }
  };

  return (
    <div className="meal-planning-page">
      <Sidebar />
      <div className="meal-planning-content">
        <div className="meal-planning-header">
          <div className="header-content">
            <h1>Indian Meal Planning</h1>
            <p className="subtitle">Personalized weekly meal plans based on your nutrition goals</p>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>
        </div>

        {deficiencies.length > 0 && (
          <div className="deficiencies-section">
            <h2>
              <AlertCircle className="icon" />
              Nutrition Deficiencies Detected
            </h2>
            <div className="deficiency-cards">
              {deficiencies.map((deficiency, index) => (
                <div key={index} className="deficiency-card">
                  <h3>{deficiency.nutrient}</h3>
                  <p>Consider adding more:</p>
                  <ul>
                    {deficiency.foodSuggestions.map((food, i) => (
                      <li key={i}>{food}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="meal-planning-actions">
          <button 
            className="generate-plan-button"
            onClick={startNewWeekPlan}
            disabled={generatingPlan}
          >
            <ChefHat className="icon" />
            {generatingPlan ? 'Generating Plan...' : 'Generate Indian Meal Plan'}
          </button>
        </div>

        {mealPlan.length > 0 && (
          <div className="weekly-meal-plan">
            <h2>Your Weekly Indian Meal Plan</h2>
            <div className="meal-planners">
              {mealPlan.map((dayPlan, index) => (
                <div key={index} className="day-plan">
                  <div className="day-header">
                    <h3>{dayPlan.day}</h3>
                  </div>
                  <div className="meals">
                    {dayPlan.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="meal-card">
                        <div className="meal-header">
                          <span className="meal-type-icon">{getMealTypeIcon(meal.type)}</span>
                          <h4>{meal.type}</h4>
                        </div>
                        <div className="meal-content">
                          <h5>{meal.name}</h5>
                          <p className="meal-description">{meal.description}</p>
                          <div className="ingredients">
                            <h6>Ingredients:</h6>
                            <ul>
                              {meal.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="nutrition-info">
                            <div className="nutrition-item">
                              <span className="label">Calories</span>
                              <span className="value">{meal.nutrition.calories} kcal</span>
                            </div>
                            <div className="nutrition-item">
                              <span className="label">Protein</span>
                              <span className="value">{meal.nutrition.protein}g</span>
                            </div>
                            <div className="nutrition-item">
                              <span className="label">Carbs</span>
                              <span className="value">{meal.nutrition.carbs}g</span>
                            </div>
                            <div className="nutrition-item">
                              <span className="label">Fat</span>
                              <span className="value">{meal.nutrition.fat}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanningPage;
