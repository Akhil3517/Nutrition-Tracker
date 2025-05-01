import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "../hooks/use-toast";
import Sidebar from '../components/Sidebar';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const savedGoals = localStorage.getItem('nutritionGoals');
    return savedGoals ? JSON.parse(savedGoals) : {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    };
  });

  useEffect(() => {
    // Save nutrition goals whenever they change
    localStorage.setItem('nutritionGoals', JSON.stringify(nutritionGoals));
  }, [nutritionGoals]);

  const handleNutritionChange = (field, value) => {
    setNutritionGoals(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Goals Updated",
      description: "Your nutrition goals have been saved successfully.",
    });
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
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
                  <div className="font-medium">{user.name || 'User'}</div>
                </div>
                <div className="user-info-item">
                  <Label>Email</Label>
                  <div className="font-medium">{user.email || '23211a0505@bvrit.ac.in'}</div>
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
                      value={nutritionGoals.calories}
                      onChange={(e) => handleNutritionChange('calories', e.target.value)}
                      className="max-w-[150px]"
                    />
                  ) : (
                    <div className="goal-value">{nutritionGoals.calories} kcal</div>
                  )}
                </div>

                <div className="goal-item">
                  <Label htmlFor="protein">Daily Protein</Label>
                  {isEditing ? (
                    <Input
                      id="protein"
                      type="number"
                      value={nutritionGoals.protein}
                      onChange={(e) => handleNutritionChange('protein', e.target.value)}
                      className="max-w-[150px]"
                    />
                  ) : (
                    <div className="goal-value">{nutritionGoals.protein} g</div>
                  )}
                </div>

                <div className="goal-item">
                  <Label htmlFor="carbs">Daily Carbohydrates</Label>
                  {isEditing ? (
                    <Input
                      id="carbs"
                      type="number"
                      value={nutritionGoals.carbs}
                      onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                      className="max-w-[150px]"
                    />
                  ) : (
                    <div className="goal-value">{nutritionGoals.carbs} g</div>
                  )}
                </div>

                <div className="goal-item">
                  <Label htmlFor="fat">Daily Fat</Label>
                  {isEditing ? (
                    <Input
                      id="fat"
                      type="number"
                      value={nutritionGoals.fat}
                      onChange={(e) => handleNutritionChange('fat', e.target.value)}
                      className="max-w-[150px]"
                    />
                  ) : (
                    <div className="goal-value">{nutritionGoals.fat} g</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <Button 
                  className="mt-6" 
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 