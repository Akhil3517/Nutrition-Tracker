
import React, { useState } from 'react';
import { fetchFoodSuggestions } from '../services/api';
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
          <input
            type="text"
            placeholder="Course (e.g., Main Course, Dessert)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Diet (e.g., Vegetarian, Vegan, Non-Vegetarian)"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="form-control"
          />
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
            {food.imageUrl && (
              <img 
                src={food.imageUrl} 
                alt={food.name} 
                className="suggestion-image"
              />
            )}
            <div className="suggestion-info">
              <h3>{food.name}</h3>
              <p>{food.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSuggestions;
