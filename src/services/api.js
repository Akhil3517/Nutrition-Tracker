
import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api';

// Function to fetch food suggestions
export const fetchFoodSuggestions = async (course, diet) => {
  try {
    const response = await axios.get(`${API_URL}/food-suggestions`, {
      params: { course, diet }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching food suggestions:', error);
    throw error;
  }
};

// Function to recognize food from an image
export const recognizeFood = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${API_URL}/recognize-food`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error recognizing food:', error);
    throw error;
  }
};

// Function to get nutrition information for a food
export const getNutritionInfo = async (foodName) => {
  try {
    const response = await axios.get(`${API_URL}/nutrition`, {
      params: { food: foodName }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    throw error;
  }
};

// Function to fetch user profile
export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to fetch educational content
export const fetchEducationalContent = async (topic) => {
  try {
    const response = await axios.get(`${API_URL}/education`, {
      params: { topic }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching educational content:', error);
    throw error;
  }
};
