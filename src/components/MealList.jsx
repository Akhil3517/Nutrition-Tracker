
import React from 'react';
import './MealList.css';

const MealList = ({ foods, onRemoveFood }) => {
  if (foods.length === 0) {
    return (
      <div className="meal-list-empty">
        <p>No foods logged yet. Use the food recognition tool to add foods.</p>
      </div>
    );
  }

  return (
    <div className="meal-list">
      <h2>Today's Meal Log</h2>
      
      <div className="meal-table">
        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th>Weight (g)</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => (
              <tr key={index}>
                <td className="food-name">
                  {food.imageUrl && (
                    <div className="food-image-small">
                      <img src={food.imageUrl} alt={food.name} />
                    </div>
                  )}
                  <span>{food.name}</span>
                </td>
                <td>{food.weight || 100}g</td>
                <td>{food.calories} kcal</td>
                <td>{food.protein}g</td>
                <td>{food.carbs}g</td>
                <td>{food.fat}g</td>
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => onRemoveFood(index)}
                    aria-label="Remove food"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealList;
