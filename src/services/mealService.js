import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const fetchMeals = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const mealsRef = collection(db, 'meals');
    const q = query(
      mealsRef,
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const addMeal = async (meal) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const mealsRef = collection(db, 'meals');
    const newMealRef = doc(mealsRef);
    
    const mealData = {
      ...meal,
      id: newMealRef.id,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newMealRef, mealData);
    return mealData;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};

export const deleteMeal = async (mealId) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const mealRef = doc(db, 'meals', mealId);
    const mealDoc = await getDoc(mealRef);
    
    if (!mealDoc.exists()) {
      throw new Error('Meal not found');
    }
    
    const mealData = mealDoc.data();
    if (mealData.userId !== auth.currentUser.uid) {
      throw new Error('Not authorized to delete this meal');
    }
    
    await deleteDoc(mealRef);
    return true;
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};
