import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "../hooks/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, fetchUserProfile } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    nutritionGoals: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        if (!currentUser?.email) {
          console.log('No current user email available');
          return;
        }

        console.log('Loading profile for:', currentUser.email);
        
        // First set data from Firebase Auth
        setProfileData(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          email: currentUser.email || ''
        }));

        // Then fetch additional data from our backend
        const userData = await fetchUserProfile(currentUser.email);
        console.log('Received user data:', userData);
        
        if (userData) {
          setProfileData(prev => ({
            ...prev,
            name: userData.name || prev.name,
            nutritionGoals: userData.nutritionGoals || prev.nutritionGoals
          }));
          // Update localStorage with nutrition goals
          localStorage.setItem('nutritionGoals', JSON.stringify(userData.nutritionGoals));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const handleNutritionChange = (field, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    setProfileData(prev => ({
      ...prev,
      nutritionGoals: {
        ...prev.nutritionGoals,
        [field]: numValue
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate nutrition goals
      const { calories, protein, carbs, fat } = profileData.nutritionGoals;
      if ([calories, protein, carbs, fat].some(val => !val || val < 0)) {
        toast({
          title: "Error",
          description: "All nutrition goals must be positive numbers",
          variant: "destructive",
        });
        return;
      }

      // Convert values to numbers
      const nutritionGoals = {
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat)
      };

      // Update backend
      const result = await updateUserProfile(currentUser.email, {
        name: profileData.name,
        nutritionGoals
      });

      console.log('Profile update result:', result);

      if (result.user) {
        // Update local state with the server response
        setProfileData(prev => ({
          ...prev,
          name: result.user.name,
          nutritionGoals: result.user.nutritionGoals
        }));

        // Update localStorage with nutrition goals
        localStorage.setItem('nutritionGoals', JSON.stringify(result.user.nutritionGoals));

        // Dispatch custom event for same-window updates
        const goalsUpdateEvent = new CustomEvent('nutritionGoalsUpdate', {
          detail: { goals: result.user.nutritionGoals }
        });
        window.dispatchEvent(goalsUpdateEvent);

        setIsEditing(false);
        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        {isLoading ? (
          <div className="loading-state">
            <p>Loading profile data...</p>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <h1>Your Profile</h1>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
              >
                {isEditing ? (isSaving ? "Saving..." : "Save Changes") : "Edit Profile"}
              </Button>
            </div>

            <div className="profile-sections">
              <Card className="profile-info-card">
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="user-info-item">
                      <Label>Name</Label>
                      <div className="font-medium">{profileData.name || 'Not set'}</div>
                    </div>
                    <div className="user-info-item">
                      <Label>Email</Label>
                      <div className="font-medium">{profileData.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="nutrition-goals-card">
                <CardHeader>
                  <CardTitle>Nutrition Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="nutrition-goals-grid">
                    <div className="goal-item">
                      <Label htmlFor="calories">Daily Calories</Label>
                      {isEditing ? (
                        <Input
                          id="calories"
                          type="number"
                          value={profileData.nutritionGoals.calories}
                          onChange={(e) => handleNutritionChange('calories', e.target.value)}
                          className="max-w-[150px]"
                        />
                      ) : (
                        <div className="goal-value">{profileData.nutritionGoals.calories} kcal</div>
                      )}
                    </div>

                    <div className="goal-item">
                      <Label htmlFor="protein">Daily Protein</Label>
                      {isEditing ? (
                        <Input
                          id="protein"
                          type="number"
                          value={profileData.nutritionGoals.protein}
                          onChange={(e) => handleNutritionChange('protein', e.target.value)}
                          className="max-w-[150px]"
                        />
                      ) : (
                        <div className="goal-value">{profileData.nutritionGoals.protein} g</div>
                      )}
                    </div>

                    <div className="goal-item">
                      <Label htmlFor="carbs">Daily Carbohydrates</Label>
                      {isEditing ? (
                        <Input
                          id="carbs"
                          type="number"
                          value={profileData.nutritionGoals.carbs}
                          onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                          className="max-w-[150px]"
                        />
                      ) : (
                        <div className="goal-value">{profileData.nutritionGoals.carbs} g</div>
                      )}
                    </div>

                    <div className="goal-item">
                      <Label htmlFor="fat">Daily Fat</Label>
                      {isEditing ? (
                        <Input
                          id="fat"
                          type="number"
                          value={profileData.nutritionGoals.fat}
                          onChange={(e) => handleNutritionChange('fat', e.target.value)}
                          className="max-w-[150px]"
                        />
                      ) : (
                        <div className="goal-value">{profileData.nutritionGoals.fat} g</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile; 