
import React, { useState, useEffect } from 'react';
import { FoodNutrition } from '../services/api';
import './NutritionTracker.css';

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionTrackerProps {
  addedFoods: FoodNutrition[];
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ addedFoods }) => {
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2181,
    protein: 136.3,
    carbs: 245.4,
    fat: 72.7,
  });

  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    // Load user's nutrition goals from localStorage if available
    const userProfileString = localStorage.getItem('userProfile');
    if (userProfileString) {
      try {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.calorieGoal) {
          setGoals({
            calories: userProfile.calorieGoal || 2181,
            protein: userProfile.proteinGoal || 136.3,
            carbs: userProfile.carbsGoal || 245.4,
            fat: userProfile.fatGoal || 72.7,
          });
        }
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Calculate total nutrition values from added foods
    const totals = addedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });

    setConsumed(totals);
  }, [addedFoods]);

  const calculateRemaining = (goal: number, consumed: number) => {
    const remaining = goal - consumed;
    return remaining > 0 ? remaining : 0;
  };

  const calculatePercentage = (consumed: number, goal: number) => {
    const percentage = (consumed / goal) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  // Generate the circle indicator with appropriate border color based on percentage
  const getCircleStyle = (consumed: number, goal: number) => {
    const percentage = (consumed / goal) * 100;
    
    // Base color is light gray
    if (percentage < 50) return { borderColor: '#e0e0e0' };
    
    // At 50-75% show green
    if (percentage < 75) return { borderColor: '#4caf50' };
    
    // At 75-90% show orange
    if (percentage < 90) return { borderColor: '#ff9800' };
    
    // At 90-100% show deep orange 
    if (percentage <= 100) return { borderColor: '#ff5722' };
    
    // Over 100% show red
    return { borderColor: '#f44336' };
  };

  return (
    <div className="nutrition-tracker card">
      <div className="tracker-header">
        <h2>Energy Summary</h2>
        <div className="tracker-targets">
          <h2>Targets</h2>
        </div>
      </div>
      
      <div className="tracker-content">
        <div className="nutrition-summary">
          <div className="energy-circles">
            <div 
              className="energy-circle" 
              style={getCircleStyle(consumed.calories, goals.calories)}
            >
              <div className="circle-content">
                <span className="circle-value">{consumed.calories}</span>
                <span className="circle-unit">kcal</span>
              </div>
              <span className="circle-label">Consumed</span>
            </div>
            
            <div className="energy-circle highlighted">
              <div className="circle-content">
                <span className="circle-value">{goals.calories}</span>
                <span className="circle-unit">kcal</span>
              </div>
              <span className="circle-label">Target</span>
            </div>
            
            <div 
              className="energy-circle"
              style={{
                borderColor: calculateRemaining(goals.calories, consumed.calories) > 0 
                  ? '#4caf50' 
                  : '#e0e0e0'
              }}
            >
              <div className="circle-content">
                <span className="circle-value">{calculateRemaining(goals.calories, consumed.calories)}</span>
                <span className="circle-unit">kcal</span>
              </div>
              <span className="circle-label">Remaining</span>
            </div>
          </div>
        </div>
        
        <div className="nutrition-targets">
          <h3>Nutrition Progress</h3>
          
          <div className="nutrition-details">
            <div className="nutrition-detail">
              <div className="nutrition-detail-header">
                <span>Energy</span>
                <span className="target-info">{consumed.calories.toFixed(0)} / {goals.calories} kcal</span>
                <span className="percentage">{Math.round(calculatePercentage(consumed.calories, goals.calories))}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${calculatePercentage(consumed.calories, goals.calories)}%`,
                    backgroundColor: consumed.calories > goals.calories ? '#f44336' : 'var(--accent-color)'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="nutrition-detail">
              <div className="nutrition-detail-header">
                <span>Protein</span>
                <span className="target-info">{consumed.protein.toFixed(1)} / {goals.protein} g</span>
                <span className="percentage">{Math.round(calculatePercentage(consumed.protein, goals.protein))}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${calculatePercentage(consumed.protein, goals.protein)}%`,
                    backgroundColor: consumed.protein > goals.protein ? '#f44336' : '#4caf50'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="nutrition-detail">
              <div className="nutrition-detail-header">
                <span>Net Carbs</span>
                <span className="target-info">{consumed.carbs.toFixed(1)} / {goals.carbs} g</span>
                <span className="percentage">{Math.round(calculatePercentage(consumed.carbs, goals.carbs))}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${calculatePercentage(consumed.carbs, goals.carbs)}%`,
                    backgroundColor: consumed.carbs > goals.carbs ? '#f44336' : '#ff9800'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="nutrition-detail">
              <div className="nutrition-detail-header">
                <span>Fat</span>
                <span className="target-info">{consumed.fat.toFixed(1)} / {goals.fat} g</span>
                <span className="percentage">{Math.round(calculatePercentage(consumed.fat, goals.fat))}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${calculatePercentage(consumed.fat, goals.fat)}%`,
                    backgroundColor: consumed.fat > goals.fat ? '#f44336' : '#2196f3'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
