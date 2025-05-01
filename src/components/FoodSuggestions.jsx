import React, { useState } from 'react';
import { fetchFoodSuggestions } from '../services/api.js';
import './FoodSuggestions.css';

const FoodSuggestions = () => {
  const [course, setCourse] = useState('');
  const [diet, setDiet] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!course || !diet) {
      setError('Please provide both course and dietary preference');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await fetchFoodSuggestions(course, diet);
      setSuggestions(results);
      if (results.length === 0) {
        setError('No food suggestions found for these criteria. Try different options.');
      }
    } catch (err) {
      setError('Failed to fetch food suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="food-suggestions">
      <h2>Food Suggestions</h2>
      
      <form onSubmit={handleSubmit} className="suggestion-form">
        <div className="form-group">
          <label htmlFor="course">Course Type</label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Course</option>
            <option value="appetizer">Appetizer</option>
            <option value="main course">Main Course</option>
            <option value="side dish">Side Dish</option>
            <option value="dessert">Dessert</option>
            <option value="breakfast">Breakfast</option>
            <option value="snack">Snack</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="diet">Dietary Preference</label>
          <select
            id="diet"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="keto">Keto</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Suggestions'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="suggestions-list">
        {suggestions.map((food, index) => (
          <div key={index} className="suggestion-card">
            <div className="suggestion-info">
              <h3>{food.name}</h3>
              <p className="description">{food.description}</p>
              <div className="ingredients">
                <h4>Key Ingredients:</h4>
                <ul>
                  {food.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSuggestions;
