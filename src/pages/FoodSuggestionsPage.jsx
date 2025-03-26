
import React from 'react';
import Sidebar from '../components/Sidebar';
import FoodSuggestions from '../components/FoodSuggestions';
import './FoodSuggestionsPage.css';

const FoodSuggestionsPage = () => {
  return (
    <div className="food-suggestions-page">
      <Sidebar />
      
      <div className="food-suggestions-content">
        <div className="food-suggestions-header">
          <h1>Food Suggestions</h1>
          <p>Discover new foods based on your preferences and dietary needs.</p>
        </div>
        
        <div className="food-suggestions-container">
          <FoodSuggestions />
        </div>
      </div>
    </div>
  );
};

export default FoodSuggestionsPage;
