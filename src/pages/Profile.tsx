
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 70
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userJson);
      // In a real app, you would fetch the full profile from a backend
      setProfile({
        ...profile,
        name: user.name || 'User',
        email: user.email || 'user@example.com'
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setProfile({
      ...profile,
      [name]: name === 'name' || name === 'email' ? value : Number(value)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to a backend
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="profile-content">
          <div className="profile-card">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="calorieGoal">Daily Calorie Goal (kcal)</label>
                  <input
                    type="number"
                    id="calorieGoal"
                    name="calorieGoal"
                    value={profile.calorieGoal}
                    onChange={handleInputChange}
                    min="1000"
                    max="5000"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="proteinGoal">Daily Protein Goal (g)</label>
                  <input
                    type="number"
                    id="proteinGoal"
                    name="proteinGoal"
                    value={profile.proteinGoal}
                    onChange={handleInputChange}
                    min="20"
                    max="300"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="carbsGoal">Daily Carbs Goal (g)</label>
                  <input
                    type="number"
                    id="carbsGoal"
                    name="carbsGoal"
                    value={profile.carbsGoal}
                    onChange={handleInputChange}
                    min="50"
                    max="500"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fatGoal">Daily Fat Goal (g)</label>
                  <input
                    type="number"
                    id="fatGoal"
                    name="fatGoal"
                    value={profile.fatGoal}
                    onChange={handleInputChange}
                    min="20"
                    max="200"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-info">
                  <h2>{profile.name}</h2>
                  <p className="profile-email">{profile.email}</p>
                </div>
                
                <div className="profile-divider"></div>
                
                <div className="nutrition-goals">
                  <h3>Nutrition Goals</h3>
                  
                  <div className="goal-item">
                    <div className="goal-label">Daily Calories</div>
                    <div className="goal-value">{profile.calorieGoal} kcal</div>
                  </div>
                  
                  <div className="goal-item">
                    <div className="goal-label">Daily Protein</div>
                    <div className="goal-value">{profile.proteinGoal} g</div>
                  </div>
                  
                  <div className="goal-item">
                    <div className="goal-label">Daily Carbohydrates</div>
                    <div className="goal-value">{profile.carbsGoal} g</div>
                  </div>
                  
                  <div className="goal-item">
                    <div className="goal-label">Daily Fat</div>
                    <div className="goal-value">{profile.fatGoal} g</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
