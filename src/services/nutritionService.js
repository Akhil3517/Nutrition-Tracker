import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveNutritionData = async (userId, nutritionData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Saving nutrition data for user:', userId);
    console.log('Data to save:', nutritionData);

    const nutritionRef = doc(db, 'nutrition', userId);
    const dataToSave = {
      ...nutritionData,
      userId,
      updatedAt: new Date().toISOString()
    };

    console.log('Attempting to save data to Firestore...');
    await setDoc(nutritionRef, dataToSave, { merge: true });
    console.log('Data saved successfully');
    
    return true;
  } catch (error) {
    console.error('Error saving nutrition data:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getNutritionData = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Getting nutrition data for user:', userId);

    const nutritionRef = doc(db, 'nutrition', userId);
    console.log('Attempting to fetch data from Firestore...');
    const nutritionDoc = await getDoc(nutritionRef);
    
    if (nutritionDoc.exists()) {
      console.log('Found existing nutrition data');
      return nutritionDoc.data();
    }
    
    console.log('No existing data found, creating initial document');
    // If no data exists, create an empty document
    const initialData = {
      foods: [],
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(nutritionRef, initialData);
    console.log('Initial document created successfully');
    return initialData;
  } catch (error) {
    console.error('Error getting nutrition data:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const updateNutritionData = async (userId, nutritionData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Updating nutrition data for user:', userId);
    console.log('Update data:', nutritionData);

    const nutritionRef = doc(db, 'nutrition', userId);
    const dataToUpdate = {
      ...nutritionData,
      updatedAt: new Date().toISOString()
    };

    console.log('Attempting to update data in Firestore...');
    await updateDoc(nutritionRef, dataToUpdate);
    console.log('Data updated successfully');
    
    return true;
  } catch (error) {
    console.error('Error updating nutrition data:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getMonthlyNutritionSummary = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Getting monthly nutrition summary for user:', userId);

    // Calculate start and end dates for current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get the user's nutrition document
    const nutritionRef = doc(db, 'nutrition', userId);
    const nutritionDoc = await getDoc(nutritionRef);
    
    if (!nutritionDoc.exists()) {
      console.log('No nutrition data found for user');
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        daysWithData: 0
      };
    }

    const nutritionData = nutritionDoc.data();
    console.log('Nutrition data:', nutritionData);

    // Calculate totals and averages
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    let dayCount = 0;

    // Check if foods array exists and has items
    if (nutritionData.foods && Array.isArray(nutritionData.foods)) {
      // Filter foods for current month
      const monthlyFoods = nutritionData.foods.filter(food => {
        const foodDate = new Date(food.date || food.addedAt);
        return foodDate >= startDate && foodDate <= endDate;
      });

      if (monthlyFoods.length > 0) {
        dayCount = 1; // At least one day has data
        monthlyFoods.forEach(food => {
          totalNutrition.calories += parseFloat(food.calories) || 0;
          totalNutrition.protein += parseFloat(food.protein) || 0;
          totalNutrition.carbs += parseFloat(food.carbs) || 0;
          totalNutrition.fat += parseFloat(food.fat) || 0;
        });
      }
    }

    // Calculate averages
    const monthlySummary = {
      calories: dayCount > 0 ? totalNutrition.calories / dayCount : 0,
      protein: dayCount > 0 ? totalNutrition.protein / dayCount : 0,
      carbs: dayCount > 0 ? totalNutrition.carbs / dayCount : 0,
      fat: dayCount > 0 ? totalNutrition.fat / dayCount : 0,
      daysWithData: dayCount
    };

    console.log('Monthly nutrition summary:', monthlySummary);
    return monthlySummary;
  } catch (error) {
    console.error('Error getting monthly nutrition summary:', error);
    throw error;
  }
}; 