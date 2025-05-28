import React from 'react';
import './NutritionTracker.css';

const NutritionTracker = ({ nutritionTotals, nutritionGoals, progressPercentages }) => {
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
            <span className="nutrition-value">{nutritionTotals.calories.toFixed(0)}</span>
            <span className="nutrition-label">Calories</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.calories} kcal</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon protein-icon">🥩</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{nutritionTotals.protein.toFixed(1)}g</span>
            <span className="nutrition-label">Protein</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.protein}g</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon carbs-icon">🍚</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{nutritionTotals.carbs.toFixed(1)}g</span>
            <span className="nutrition-label">Carbs</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.carbs}g</span>
          </div>
        </div>
        
        <div className="nutrition-card">
          <div className="nutrition-icon fat-icon">🥑</div>
          <div className="nutrition-info">
            <span className="nutrition-value">{nutritionTotals.fat.toFixed(1)}g</span>
            <span className="nutrition-label">Fat</span>
            <span className="nutrition-goal">Goal: {nutritionGoals.fat}g</span>
          </div>
        </div>
      </div>

      <div className="nutrition-progress">
        <div className="progress-item">
          <div className="progress-labels">
            <span>Calories</span>
            <span className="progress-goal">{nutritionTotals.calories.toFixed(0)} / {nutritionGoals.calories} kcal</span>
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
            <span className="progress-goal">{nutritionTotals.protein.toFixed(1)} / {nutritionGoals.protein}g</span>
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
            <span className="progress-goal">{nutritionTotals.carbs.toFixed(1)} / {nutritionGoals.carbs}g</span>
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
            <span className="progress-goal">{nutritionTotals.fat.toFixed(1)} / {nutritionGoals.fat}g</span>
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