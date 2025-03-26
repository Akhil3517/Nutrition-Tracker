
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchMeals = async () => {
  try {
    const response = await axios.get(`${API_URL}/meals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const addMeal = async (meal) => {
  try {
    const response = await axios.post(`${API_URL}/meals`, meal);
    return response.data;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};

export const deleteMeal = async (mealId) => {
  try {
    await axios.delete(`${API_URL}/meals/${mealId}`);
    return true;
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};
