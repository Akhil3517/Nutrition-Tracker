import React, { useState, useEffect } from 'react';
import './NutritionTracker.css';

const NutritionTracker = ({ addedFoods }) => {
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

  // Calculate total nutrition values
  const calculateTotal = (field) => {
    return addedFoods.reduce((total, food) => total + (food[field] || 0), 0);
  };

  const totalCalories = calculateTotal('calories');
  const totalProtein = calculateTotal('protein');
  const totalCarbs = calculateTotal('carbs');
  const totalFat = calculateTotal('fat');

  // Calculate progress percentages
  const progressPercentages = {
    calories: Math.min((totalCalories / nutritionGoals.calories) * 100, 100),
    protein: Math.min((totalProtein / nutritionGoals.protein) * 100, 100),
    carbs: Math.min((totalCarbs / nutritionGoals.carbs) * 100, 100),
    fat: Math.min((totalFat / nutritionGoals.fat) * 100, 100)
  };

  // Get color based on progress
  const getProgressColor = (percentage) => {
    if (percentage <= 25) return 'var(--progress-low)';
    if (percentage <= 75) return 'var(--progress-medium)';
    if (percentage <= 90) return 'var(--progress-good)';
    return 'var(--progress-high)';
  };

  return (
    <div className="nutrition-tracker card">
      <h2 className="section-title">Daily Nutrition Summary</h2>
      <div className="nutrition-cards">
        <div className="nutrition-card">
          <div className="nutrition-icon calories-icon">🔥</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{totalCalories.toFixed(0)}</span>
            <span className="nutrition-label">Calories</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.calories} kcal</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon protein-icon">🥩</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{totalProtein.toFixed(1)}g</span>
            <span className="nutrition-label">Protein</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.protein}g</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon carbs-icon">🍚</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{totalCarbs.toFixed(1)}g</span>
            <span className="nutrition-label">Carbs</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.carbs}g</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon fat-icon">🥑</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{totalFat.toFixed(1)}g</span>
            <span className="nutrition-label">Fat</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.fat}g</span>
          </div>
        </div>
      </div>

      <div className="nutrition-progress">
        <div className="progress-item">
          <div className="progress-labels">
            <span>Calories</span>
            <span className="progress-goal">{totalCalories.toFixed(0)} / {nutritionGoals.calories} kcal</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill calories" 
              style={{ 
                width: `${progressPercentages.calories}%`,
                backgroundColor: getProgressColor(progressPercentages.calories)
              }} 
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-labels">
            <span>Protein</span>
            <span className="progress-goal">{totalProtein.toFixed(1)} / {nutritionGoals.protein}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill protein" 
              style={{ 
                width: `${progressPercentages.protein}%`,
                backgroundColor: getProgressColor(progressPercentages.protein)
              }} 
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-labels">
            <span>Carbs</span>
            <span className="progress-goal">{totalCarbs.toFixed(1)} / {nutritionGoals.carbs}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill carbs" 
              style={{ 
                width: `${progressPercentages.carbs}%`,
                backgroundColor: getProgressColor(progressPercentages.carbs)
              }} 
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-labels">
            <span>Fat</span>
            <span className="progress-goal">{totalFat.toFixed(1)} / {nutritionGoals.fat}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill fat" 
              style={{ 
                width: `${progressPercentages.fat}%`,
                backgroundColor: getProgressColor(progressPercentages.fat)
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker; 