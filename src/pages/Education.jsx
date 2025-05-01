import React from "react";
import "./Education.css";

const Education = () => {
  return (
    <div className="education-container">
      <h1>Nutrition Education</h1>
      <div className="education-grid">
        <div className="education-card">
          <h2>What Is Nutrition?</h2>
          <p>
            trition is the science of how food affects the body's health and
            functioning. It involves the intake of nutrients—substances in food
            that the body uses for growth, energy, and maintenance.
          </p>
        </div>
        <div className="education-card">
          <h2>Macronutrients</h2>
          <p>
            Understand the role of proteins, carbohydrates, and fats in your
            diet.
          </p>
        </div>
        <div className="education-card">
          <h2>Micronutrients</h2>
          <p>
            Discover the importance of vitamins and minerals for your health.
          </p>
        </div>
        <div className="education-card">
          <h2>Meal Planning</h2>
          <p>Get tips and strategies for planning healthy, balanced meals.</p>
        </div>
      </div>
    </div>
  );
};

export default Education;
