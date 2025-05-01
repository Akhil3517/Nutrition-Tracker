
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Your Journey to Better Nutrition Starts Here</h1>
            <p>Track food intake, analyze nutrition, and discover personalized food suggestions with AI-powered recognition.</p>
            <div className="hero-cta">
              <Link to="/tracker" className="btn btn-primary">Start Tracking</Link>
              <Link to="/education" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📷</div>
              <h3>AI Food Recognition</h3>
              <p>Simply take a picture of your food, and our AI will identify it and provide nutritional information.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Nutrition Tracking</h3>
              <p>Keep track of your calories, protein, carbs, and fat intake with an easy-to-use dashboard.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Food Suggestions</h3>
              <p>Get personalized food recommendations based on your dietary preferences and goals.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Nutrition Education</h3>
              <p>Learn about nutrition basics and how to maintain a balanced diet for optimal health.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Take a Photo</h3>
              <p>Upload or capture a photo of your meal using our app.</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI recognizes the food and calculates nutritional values.</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track Progress</h3>
              <p>Monitor your nutritional intake and progress toward your goals.</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Recommendations</h3>
              <p>Receive personalized food suggestions based on your preferences.</p>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Home;
