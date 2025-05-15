import React from "react";
import { BookOpen, Apple, Droplet, Scale, Utensils, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import "./Education.css";

const Education = () => {
  return (
    <div className="education-page">
      <Navbar />
      <div className="education-container">
        <div className="education-header">
          <h1>Nutrition Education</h1>
          <p>Learn about the fundamentals of nutrition and how to maintain a healthy diet</p>
        </div>

        <div className="education-grid">
          <div className="education-card">
            <div className="education-icon">
              <BookOpen size={32} />
            </div>
            <div className="education-content">
              <h2>What Is Nutrition?</h2>
              <p>
                Nutrition is the science of how food affects the body's health and functioning. 
                It involves the intake of nutrients—substances in food that the body uses for 
                growth, energy, and maintenance. Good nutrition is essential for maintaining 
                a healthy weight, preventing chronic diseases, and promoting overall well-being.
              </p>
            </div>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <Scale size={32} />
            </div>
            <div className="education-content">
              <h2>Macronutrients</h2>
              <div className="nutrient-section">
                <div className="nutrient-item">
                  <h3>Proteins</h3>
                  <p>Essential for building and repairing tissues, making enzymes and hormones.</p>
                  <ul>
                    <li>Meat and fish</li>
                    <li>Eggs and dairy</li>
                    <li>Legumes and beans</li>
                  </ul>
                </div>
                <div className="nutrient-item">
                  <h3>Carbohydrates</h3>
                  <p>The body's main source of energy. Choose complex carbs over simple sugars.</p>
                  <ul>
                    <li>Whole grains</li>
                    <li>Fruits and vegetables</li>
                    <li>Legumes</li>
                  </ul>
                </div>
                <div className="nutrient-item">
                  <h3>Fats</h3>
                  <p>Important for energy storage, cell function, and nutrient absorption.</p>
                  <ul>
                    <li>Avocados and nuts</li>
                    <li>Olive oil</li>
                    <li>Fatty fish</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <Apple size={32} />
            </div>
            <div className="education-content">
              <h2>Micronutrients</h2>
              <div className="nutrient-section">
                <div className="nutrient-item">
                  <h3>Vitamins</h3>
                  <ul>
                    <li><strong>Vitamin C:</strong> Boosts immunity and skin health</li>
                    <li><strong>Vitamin D:</strong> Supports bone health and immune function</li>
                    <li><strong>B Vitamins:</strong> Aid in energy production and brain function</li>
                  </ul>
                </div>
                <div className="nutrient-item">
                  <h3>Minerals</h3>
                  <ul>
                    <li><strong>Calcium:</strong> For strong bones and teeth</li>
                    <li><strong>Iron:</strong> For oxygen transport in blood</li>
                    <li><strong>Potassium:</strong> For nerve and muscle function</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <Utensils size={32} />
            </div>
            <div className="education-content">
              <h2>Meal Planning</h2>
              <div className="meal-planning-section">
                <div className="plate-method">
                  <h3>Balanced Plate Method</h3>
                  <div className="plate-visual">
                    <div className="plate-section vegetables">50% Vegetables & Fruits</div>
                    <div className="plate-section grains">25% Whole Grains</div>
                    <div className="plate-section protein">25% Lean Proteins</div>
                  </div>
                </div>
                <div className="meal-tips">
                  <h3>Tips for Success</h3>
                  <ul>
                    <li>Plan meals ahead of time</li>
                    <li>Include a variety of colors</li>
                    <li>Control portion sizes</li>
                    <li>Stay hydrated with water</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <Info size={32} />
            </div>
            <div className="education-content">
              <h2>Reading Food Labels</h2>
              <div className="label-guide">
                <div className="guide-point">
                  <h3>Check Serving Sizes</h3>
                  <p>Always check the serving size first, as all nutritional information is based on this amount.</p>
                </div>
                <div className="guide-point">
                  <h3>Look for Key Nutrients</h3>
                  <p>Focus on fiber, protein, and essential vitamins while limiting saturated fat, sodium, and added sugars.</p>
                </div>
                <div className="guide-point">
                  <h3>Understand Percent Daily Value</h3>
                  <p>Use %DV to quickly evaluate if a food is high or low in a particular nutrient.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-icon">
              <Droplet size={32} />
            </div>
            <div className="education-content">
              <h2>Hydration</h2>
              <div className="hydration-section">
                <p className="hydration-intro">
                  Water is essential for maintaining bodily functions and overall health.
                </p>
                <div className="hydration-benefits">
                  <div className="benefit-item">
                    <h3>Key Functions</h3>
                    <ul>
                      <li>Regulating body temperature</li>
                      <li>Transporting nutrients</li>
                      <li>Removing waste</li>
                      <li>Lubricating joints</li>
                    </ul>
                  </div>
                  <div className="benefit-item">
                    <h3>Daily Recommendations</h3>
                    <ul>
                      <li>8-10 glasses of water daily</li>
                      <li>More if you're active</li>
                      <li>Adjust based on climate</li>
                      <li>Listen to your body's signals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
