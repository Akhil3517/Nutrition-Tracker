
import React, { useState } from 'react';
import { format } from 'date-fns';
import { addMeal, deleteMeal } from '../services/mealService';
import { toast } from 'sonner';
import './MealPlanner.css';

const MealPlanner = ({ date, deficiencies, savedMeals }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const dateString = format(date, 'yyyy-MM-dd');
  const dayMeals = savedMeals.filter(meal => 
    meal.date === dateString || 
    (meal.timestamp && new Date(meal.timestamp).toISOString().split('T')[0] === dateString)
  );

  const handleAddMeal = async () => {
    try {
      const mealWithDate = {
        ...newMeal,
        date: dateString
      };
      
      await addMeal(mealWithDate);
      setNewMeal({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
      setIsAdding(false);
      toast.success('Meal added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to add meal:', error);
      toast.error('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await deleteMeal(mealId);
      toast.success('Meal deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No timestamp';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="meal-planner">
      {dayMeals.length > 0 ? (
        <div className="day-meals">
          {dayMeals.map((meal, index) => (
            <div key={index} className="meal-item">
              <div className="meal-info">
                <h4 className="meal-name">{meal.name}</h4>
                <div className="meal-timestamp">
                  {meal.timestamp && (
                    <span>Added at: {formatTimestamp(meal.timestamp)}</span>
                  )}
                </div>
                <div className="meal-macros">
                  <span>Calories: {meal.calories}</span>
                  <span>Protein: {meal.protein}g</span>
                  <span>Carbs: {meal.carbs}g</span>
                  <span>Fat: {meal.fat}g</span>
                </div>
              </div>
              <button 
                className="delete-meal-btn"
                onClick={() => handleDeleteMeal(meal.id)}
                aria-label="Delete meal"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-meals">No meals planned for this day.</p>
      )}
      
      {isAdding ? (
        <div className="add-meal-form">
          <input
            type="text"
            className="meal-input"
            placeholder="Meal name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
          />
          <input
            type="number"
            className="meal-input"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({...newMeal, calories: Number(e.target.value)})}
          />
          <input
            type="number"
            className="meal-input"
            placeholder="Protein (g)"
            value={newMeal.protein}
            onChange={(e) => setNewMeal({...newMeal, protein: Number(e.target.value)})}
          />
          <input
            type="number"
            className="meal-input"
            placeholder="Carbs (g)"
            value={newMeal.carbs}
            onChange={(e) => setNewMeal({...newMeal, carbs: Number(e.target.value)})}
          />
          <input
            type="number"
            className="meal-input"
            placeholder="Fat (g)"
            value={newMeal.fat}
            onChange={(e) => setNewMeal({...newMeal, fat: Number(e.target.value)})}
          />
          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
            <button className="save-btn" onClick={handleAddMeal}>Save Meal</button>
          </div>
        </div>
      ) : (
        <button className="add-meal-btn" onClick={() => setIsAdding(true)}>
          Add Meal
        </button>
      )}
    </div>
  );
};

export default MealPlanner;
