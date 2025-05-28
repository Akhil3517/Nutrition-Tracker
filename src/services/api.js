import axios from 'axios';
import { processFoodImage, getFoodSuggestions } from './geminiService';
import { calculateNutritionByWeight as calculateNutrition } from '../utils/nutrientUtils';

// Use environment variable for API URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://nutrition-tracker-backend.onrender.com/api');

console.log('API Base URL:', API_BASE_URL); // Debug log
console.log('Current hostname:', window.location.hostname); // Debug log

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    params: request.params,
    fullUrl: `${request.baseURL}${request.url}`,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error:', {
        message: error.message,
        response: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
    } else if (error.request) {
      console.error('No response received:', {
        request: error.request,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Calculate nutrition based on weight (100g is the standard reference)
export const calculateNutritionByWeight = async (foodName, weightInGrams) => {
  try {
    const response = await api.get('/nutrition', {
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
    const response = await api.get('/nutrition', {
      params: { food: foodName }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    throw error;
  }
};

// Function to fetch user profile
export const fetchUserProfile = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    console.log('Fetching profile for email:', email);
    const response = await api.get('/users/profile', {
      params: { email }
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    // Return a default user object if the request fails
    return {
      email,
      name: email.split('@')[0],
      nutritionGoals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 70
      }
    };
  }
};

// Function to update user profile
export const updateUserProfile = async (email, profileData) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    console.log('Updating profile for email:', email, 'with data:', profileData);
    const response = await api.post('/users/profile', {
      email,
      ...profileData
    });

    if (!response.data) {
      throw new Error('No response data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

// Function to fetch educational content
export const fetchEducationalContent = async (topic) => {
  try {
    const response = await api.get('/education', {
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
