import React from 'react';
import Sidebar from '../components/Sidebar';
import FoodSuggestions from '../components/FoodSuggestions';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import './FoodSuggestionsPage.css';

const FoodSuggestionsPage = () => {
  return (
    <div className="food-suggestions-page">
      <Sidebar />
      
      <div className="food-suggestions-content">
        <div className="food-suggestions-header">
          <div className="header-content">
            <h1>Food Suggestions</h1>
            <p>Discover new foods based on your preferences and dietary needs.</p>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>
        </div>
        
        <div className="food-suggestions-container">
          <FoodSuggestions />
        </div>
      </div>
    </div>
  );
};

export default FoodSuggestionsPage;
