import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyAYiJucyocACKAmyo2IxcHYUaWy9wK4r0E";
const SPOONACULAR_API_KEY = "5950424121ce4fa4858fb4fdbebf6694";

export const detectFood = async (imageData) => {
  try {
    // Convert base64 to blob
    const base64Response = await fetch(imageData);
    const blob = await base64Response.blob();

    const formData = new FormData();
    formData.append('image', blob, 'food-image.jpg');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Identify all the food items present in this image. Provide only the names of the food items separated by commas. Do not include descriptions or extra words."
          }, {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(',')[1] // Remove the data:image/jpeg;base64, prefix
            }
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      const detectedFood = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
      return detectedFood.split(',').map(food => food.trim());
    }
    return null;
  } catch (error) {
    console.error('Error detecting food:', error);
    return null;
  }
};

// Function to get nutrition information using Spoonacular API
export const getNutritionInfo = async (foodItem) => {
  try {
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/guessNutrition',
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          title: foodItem
        }
      }
    );

    const nutritionInfo = response.data;
    return {
      name: foodItem,
      calories: nutritionInfo.calories?.value || 0,
      caloriesUnit: nutritionInfo.calories?.unit || 'kcal',
      carbs: nutritionInfo.carbs?.value || 0,
      carbsUnit: nutritionInfo.carbs?.unit || 'g',
      fat: nutritionInfo.fat?.value || 0,
      fatUnit: nutritionInfo.fat?.unit || 'g',
      protein: nutritionInfo.protein?.value || 0,
      proteinUnit: nutritionInfo.protein?.unit || 'g'
    };
  } catch (error) {
    console.error('Error getting nutrition info:', error);
    return null;
  }
};

// Main function to process image and get nutrition info
export const processFoodImage = async (imageData) => {
  try {
    const detectedFoods = await detectFood(imageData);
    
    if (!detectedFoods || detectedFoods.length === 0) {
      return [];
    }

    const results = [];
    for (const food of detectedFoods) {
      const nutritionInfo = await getNutritionInfo(food);
      if (nutritionInfo) {
        results.push({
          name: nutritionInfo.name,
          confidence: 0.95, // Gemini doesn't provide confidence scores
          calories: nutritionInfo.calories,
          protein: nutritionInfo.protein,
          carbs: nutritionInfo.carbs,
          fat: nutritionInfo.fat,
          weight: 100 // Default weight in grams
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error processing food image:', error);
    return [];
  }
};

// Function to get food suggestions using Gemini API
export const getFoodSuggestions = async (course, diet) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Suggest 5 ${diet} ${course} Indian dishes. For each dish, provide:
            1. Name of the dish
            2. Brief description (1-2 sentences)
            3. Key ingredients
            Format the response as a JSON array with objects containing name, description, and ingredients fields.`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      const suggestionsText = response.data.candidates[0].content.parts[0].text;
      // Extract JSON from the response text
      const jsonMatch = suggestionsText.match(/\[.*\]/s);
      if (jsonMatch) {
        try {
          const suggestions = JSON.parse(jsonMatch[0]);
          return suggestions.map(suggestion => ({
            name: suggestion.name,
            description: suggestion.description,
            ingredients: suggestion.ingredients
          }));
        } catch (e) {
          console.error('Error parsing suggestions JSON:', e);
          return [];
        }
      }
    }
    return [];
  } catch (error) {
    console.error('Error getting food suggestions:', error);
    return [];
  }
}; 