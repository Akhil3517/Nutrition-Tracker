const API_KEY = "AIzaSyAcixhJxZOFnRD_YcLTr7ygurnYzQ8eixU";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface FoodNutrition {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight?: number;
  imageUrl?: string;
  date?: string;
}

export interface FoodSuggestion {
  name: string;
  imageUrl: string;
  description: string;
}

// Calculate nutrition based on weight (100g is the standard reference)
export const calculateNutritionByWeight = (food: FoodNutrition): FoodNutrition => {
  // If no weight is provided or it's already at the standard 100g, return as is
  if (!food.weight || food.weight === 100) return food;

  // Calculate new values based on the weight using the formula:
  // Nutrient per given weight = (Nutrient per 100g × New weight (g)) / 100
  const weightFactor = food.weight / 100;
  
  return {
    ...food,
    calories: Math.round(food.calories * weightFactor),
    protein: parseFloat((food.protein * weightFactor).toFixed(1)),
    carbs: parseFloat((food.carbs * weightFactor).toFixed(1)),
    fat: parseFloat((food.fat * weightFactor).toFixed(1))
  };
};

export const recognizeFood = async (imageBase64: string): Promise<FoodNutrition[]> => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Identify all food items in this image and provide nutritional information for each in JSON format. Return an array of objects with these fields only: name, calories, protein (g), carbs (g), fat (g)" },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(',')[1]
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    
    // Extract JSON from the response text
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        // Ensure we're working with an array
        const foodItems = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        return foodItems.map(item => ({
          name: item.name || 'Unknown Food',
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          weight: 100, // Default weight
          imageUrl: imageBase64
        }));
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Could not parse food data');
      }
    } else {
      // If array not found, try to find a single JSON object
      const singleJsonMatch = text.match(/\{[\s\S]*\}/);
      if (singleJsonMatch) {
        try {
          const singleItem = JSON.parse(singleJsonMatch[0]);
          return [{
            name: singleItem.name || 'Unknown Food',
            calories: singleItem.calories || 0,
            protein: singleItem.protein || 0,
            carbs: singleItem.carbs || 0,
            fat: singleItem.fat || 0,
            weight: 100, // Default weight
            imageUrl: imageBase64
          }];
        } catch (parseError) {
          console.error('Error parsing single JSON:', parseError);
          throw new Error('Could not parse food data');
        }
      }
    }
    
    throw new Error('Could not parse food data');
  } catch (error) {
    console.error('Error recognizing food:', error);
    return [{
      name: 'Unknown Food',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      weight: 100 // Default weight
    }];
  }
};

export const fetchFoodSuggestions = async (course: string, diet: string): Promise<FoodSuggestion[]> => {
  try {
    const response = await fetch(`/api/foods?course=${encodeURIComponent(course)}&diet=${encodeURIComponent(diet)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch food suggestions');
    }
    
    return data.foods || [];
  } catch (error) {
    console.error('Error fetching food suggestions:', error);
    return [];
  }
};
