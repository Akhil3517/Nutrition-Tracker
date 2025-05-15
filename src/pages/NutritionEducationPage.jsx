import React from 'react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import './NutritionEducationPage.css';

const NutritionEducationPage = () => {
  return (
    <div className="nutrition-education-page">
      <Sidebar />
      
      <div className="nutrition-education-content">
        <div className="nutrition-education-header">
          <div className="header-content">
            <h1>Nutrition Education</h1>
            <p>Learn about nutrition, healthy eating habits, and dietary guidelines.</p>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>
        </div>
        
        <div className="education-container">
          <div className="education-section">
            <h2>Understanding Nutrition Basics</h2>
            <div className="education-cards">
              <div className="education-card">
                <h3>Macronutrients</h3>
                <p>Learn about the three main macronutrients: proteins, carbohydrates, and fats. Understand their roles in your body and how to balance them in your diet.</p>
                <ul>
                  <li>Proteins: Building blocks for muscles and tissues</li>
                  <li>Carbohydrates: Primary energy source</li>
                  <li>Fats: Essential for hormone production and nutrient absorption</li>
                </ul>
              </div>
              
              <div className="education-card">
                <h3>Micronutrients</h3>
                <p>Discover the importance of vitamins and minerals in maintaining good health and preventing deficiencies.</p>
                <ul>
                  <li>Vitamins: Essential for various bodily functions</li>
                  <li>Minerals: Important for bone health and metabolism</li>
                  <li>Antioxidants: Help protect cells from damage</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="education-section">
            <h2>Healthy Eating Guidelines</h2>
            <div className="education-cards">
              <div className="education-card">
                <h3>Balanced Diet</h3>
                <p>Learn how to create a balanced diet that includes all necessary nutrients in the right proportions.</p>
                <ul>
                  <li>Portion control</li>
                  <li>Food variety</li>
                  <li>Meal timing</li>
                </ul>
              </div>
              
              <div className="education-card">
                <h3>Meal Planning</h3>
                <p>Tips and strategies for effective meal planning to maintain a healthy diet.</p>
                <ul>
                  <li>Weekly meal preparation</li>
                  <li>Smart grocery shopping</li>
                  <li>Healthy recipe ideas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="education-section">
            <h2>Special Dietary Considerations</h2>
            <div className="education-cards">
              <div className="education-card">
                <h3>Dietary Restrictions</h3>
                <p>Understanding and managing various dietary restrictions and preferences.</p>
                <ul>
                  <li>Vegetarian and vegan diets</li>
                  <li>Gluten-free eating</li>
                  <li>Food allergies and intolerances</li>
                </ul>
              </div>
              
              <div className="education-card">
                <h3>Health Conditions</h3>
                <p>Nutrition guidelines for managing specific health conditions.</p>
                <ul>
                  <li>Diabetes management</li>
                  <li>Heart health</li>
                  <li>Weight management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionEducationPage; 