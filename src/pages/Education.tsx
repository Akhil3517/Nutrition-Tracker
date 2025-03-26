
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Education.css';

const Education: React.FC = () => {
  return (
    <div className="education-page">
      <Navbar />
      
      <div className="education-container">
        <div className="education-header">
          <h1>Nutrition Education</h1>
          <p>Learn about nutrition basics and how to maintain a balanced diet for optimal health.</p>
        </div>
        
        <div className="education-content">
          <section className="education-section">
            <h2>Understanding Macronutrients</h2>
            
            <div className="education-card">
              <div className="education-icon">🥩</div>
              <div className="education-info">
                <h3>Protein</h3>
                <p>Proteins are essential for building and repairing tissues, making enzymes and hormones, and supporting immune function. Good sources include meat, poultry, fish, eggs, dairy, legumes, and nuts.</p>
                <p><strong>Recommended daily intake:</strong> 0.8g per kg of body weight for average adults, more for athletes and active individuals.</p>
              </div>
            </div>
            
            <div className="education-card">
              <div className="education-icon">🍚</div>
              <div className="education-info">
                <h3>Carbohydrates</h3>
                <p>Carbs are your body's main energy source. Complex carbs from whole grains, fruits, and vegetables provide sustained energy and essential nutrients. Simple carbs from processed foods can cause blood sugar spikes.</p>
                <p><strong>Recommended daily intake:</strong> 45-65% of total daily calories, preferably from complex carbohydrates.</p>
              </div>
            </div>
            
            <div className="education-card">
              <div className="education-icon">🥑</div>
              <div className="education-info">
                <h3>Fats</h3>
                <p>Healthy fats are essential for brain health, hormone production, and nutrient absorption. Focus on unsaturated fats from sources like olive oil, avocados, nuts, and fatty fish, while limiting saturated and trans fats.</p>
                <p><strong>Recommended daily intake:</strong> 20-35% of total daily calories, emphasizing unsaturated fats.</p>
              </div>
            </div>
          </section>
          
          <section className="education-section">
            <h2>Reading Nutrition Labels</h2>
            
            <div className="nutrition-label-guide">
              <div className="guide-point">
                <h3>1. Check the Serving Size</h3>
                <p>All nutrition information is based on one serving. Be aware that packages often contain multiple servings.</p>
              </div>
              
              <div className="guide-point">
                <h3>2. Look at Total Calories</h3>
                <p>Consider how a food's calories fit into your daily caloric needs.</p>
              </div>
              
              <div className="guide-point">
                <h3>3. Review the Macronutrients</h3>
                <p>Check the grams of fat, carbs, and protein to see how they align with your nutritional goals.</p>
              </div>
              
              <div className="guide-point">
                <h3>4. Examine Sugar Content</h3>
                <p>Be aware of added sugars versus natural sugars. The FDA recommends limiting added sugars to less than 10% of daily calories.</p>
              </div>
              
              <div className="guide-point">
                <h3>5. Check Fiber Content</h3>
                <p>Look for foods with higher fiber content, which helps digestion and keeps you feeling full longer.</p>
              </div>
            </div>
          </section>
          
          <section className="education-section">
            <h2>Hydration</h2>
            
            <div className="hydration-info">
              <p>Proper hydration is essential for overall health. Water helps regulate body temperature, lubricate joints, transport nutrients, and remove waste.</p>
              
              <div className="hydration-tips">
                <div className="tip">
                  <h3>Daily Water Intake</h3>
                  <p>General recommendation is about 3.7 liters (15.5 cups) for men and 2.7 liters (11.5 cups) for women, including water from all beverages and foods.</p>
                </div>
                
                <div className="tip">
                  <h3>Signs of Dehydration</h3>
                  <p>Thirst, dark urine, fatigue, dizziness, and dry mouth are common indicators that you need more fluids.</p>
                </div>
                
                <div className="tip">
                  <h3>Hydration Tips</h3>
                  <ul>
                    <li>Carry a reusable water bottle</li>
                    <li>Set reminders to drink water throughout the day</li>
                    <li>Eat water-rich foods like fruits and vegetables</li>
                    <li>Increase intake during exercise and hot weather</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Education;
