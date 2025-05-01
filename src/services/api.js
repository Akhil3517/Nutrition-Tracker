import axios from 'axios';
import { processFoodImage, getFoodSuggestions } from './geminiService';
import { calculateNutritionByWeight as calculateNutrition } from '../utils/nutrientUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const API_URL_LOCAL = 'http://localhost:5000/api';

// Calculate nutrition based on weight (100g is the standard reference)
export const calculateNutritionByWeight = async (foodName, weightInGrams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nutrition`, {
      params: {
        food: foodName,
        weight: weightInGrams,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating nutrition:', error);
    throw new Error('Failed to calculate nutrition information');
  }
};

// Function to fetch food suggestions
export const fetchFoodSuggestions = async (course, diet) => {
  try {
    const suggestions = await getFoodSuggestions(course, diet);
    return suggestions;
  } catch (error) {
    console.error('Error fetching food suggestions:', error);
    return [];
  }
};

// Function to recognize food from an image
export const recognizeFood = async (imageData) => {
  try {
    const results = await processFoodImage(imageData);
    
    if (!results || results.length === 0) {
      throw new Error('No food items detected in the image');
    }

    return {
      foods: results
    };
  } catch (error) {
    console.error('Error recognizing food:', error);
    throw new Error('Failed to recognize food from image');
  }
};

// Function to get nutrition information for a food
export const getNutritionInfo = async (foodName) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/nutrition`, {
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
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to fetch educational content
export const fetchEducationalContent = async (topic) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/education`, {
      params: { topic }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching educational content:', error);
    throw error;
  }
};

// Mock data for development/testing
export const mockRecognizeFood = async (imageData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        foods: [
          {
            name: 'apple',
            confidence: 0.95,
            calories: 52,
            protein: 0.3,
            carbs: 14,
            fat: 0.2,
            fiber: 2.4
          }
        ]
      });
    }, 1000);
  });
};

export const mockCalculateNutritionByWeight = async (foodName, weightInGrams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nutritionPer100g = {
        calories: 52,
        protein: 0.3,
        carbohydrates: 14,
        fat: 0.2,
        fiber: 2.4,
      };
      
      const calculatedNutrition = calculateNutrition(nutritionPer100g, weightInGrams);
      resolve(calculatedNutrition);
    }, 1000);
  });
};
