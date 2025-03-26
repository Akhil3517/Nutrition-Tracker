
// Detect nutrient deficiencies based on the meal log and user profile
export const detectDeficiencies = (meals, userProfile) => {
  // Default daily goals if no user profile is provided
  const nutritionGoals = userProfile?.nutritionGoals || {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 65,
  };
  
  // Get meals from the last 3 days
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const recentMeals = meals.filter(meal => {
    if (!meal.date) return false;
    const mealDate = new Date(meal.date);
    return mealDate >= threeDaysAgo;
  });
  
  // Calculate average daily nutrition
  const dayCount = 3; // Looking at 3 days of data
  const totals = recentMeals.reduce((acc, meal) => {
    return {
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const avgNutrition = {
    calories: totals.calories / dayCount,
    protein: totals.protein / dayCount,
    carbs: totals.carbs / dayCount,
    fat: totals.fat / dayCount,
  };
  
  // Define thresholds for deficiency (e.g., below 75% of goal)
  const deficiencyThreshold = 0.75;
  
  const deficiencies = [];
  
  if (avgNutrition.protein < nutritionGoals.protein * deficiencyThreshold) {
    deficiencies.push({
      nutrient: 'Protein',
      foodSuggestions: ['chicken', 'fish', 'eggs', 'tofu', 'legumes', 'Greek yogurt']
    });
  }
  
  if (avgNutrition.carbs < nutritionGoals.carbs * deficiencyThreshold) {
    deficiencies.push({
      nutrient: 'Carbohydrates',
      foodSuggestions: ['whole grains', 'fruits', 'starchy vegetables', 'oats', 'rice', 'quinoa']
    });
  }
  
  if (avgNutrition.fat < nutritionGoals.fat * deficiencyThreshold) {
    deficiencies.push({
      nutrient: 'Healthy Fats',
      foodSuggestions: ['avocados', 'nuts', 'olive oil', 'fatty fish', 'seeds', 'nut butters']
    });
  }
  
  // You can add more specific nutrient checks here
  
  return deficiencies;
};

// Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
export const calculateBMR = (gender, weight, height, age) => {
  // Weight in kg, height in cm, age in years
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

// Calculate daily calorie needs based on activity level
export const calculateDailyCalories = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Active exercise 6-7 days/week
    veryActive: 1.9 // Very active, hard exercise 6-7 days/week
  };
  
  return bmr * (activityMultipliers[activityLevel] || activityMultipliers.moderate);
};

// Calculate macronutrient distribution based on goals
export const calculateMacros = (calories, goal) => {
  const macros = {
    general: {
      protein: 0.25, // 25% of calories
      carbs: 0.5,    // 50% of calories
      fat: 0.25      // 25% of calories
    },
    weightLoss: {
      protein: 0.3,  // 30% of calories
      carbs: 0.4,    // 40% of calories
      fat: 0.3       // 30% of calories
    },
    muscleGain: {
      protein: 0.35, // 35% of calories
      carbs: 0.45,   // 45% of calories
      fat: 0.2       // 20% of calories
    }
  };
  
  const selectedDistribution = macros[goal] || macros.general;
  
  // Protein & carbs = 4 calories per gram, Fat = 9 calories per gram
  return {
    protein: Math.round((calories * selectedDistribution.protein) / 4),
    carbs: Math.round((calories * selectedDistribution.carbs) / 4),
    fat: Math.round((calories * selectedDistribution.fat) / 9)
  };
};
