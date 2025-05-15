import React, { useState, useRef } from 'react';
import { recognizeFood } from '../services/api';
import { calculateNutritionByWeight } from '../utils/nutrientUtils';
import { toast } from "../hooks/use-toast";
import './FoodRecognition.css';

const FoodRecognition = ({ onFoodRecognized }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [defaultWeight, setDefaultWeight] = useState(100);
  const [recognizedFoodsInternal, setRecognizedFoodsInternal] = useState([]);
  const [originalFoods, setOriginalFoods] = useState([]);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result;
        setPreviewUrl(base64);
        await processImage(base64);
      } catch (error) {
        console.error("Error reading file:", error);
        setError("Could not read the selected file.");
        toast({
          title: "Error",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      const canvasElement = document.createElement('canvas');
      
      videoElement.srcObject = stream;
      await videoElement.play();
      
      // Set canvas dimensions to match video
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      // Draw video frame to canvas
      const context = canvasElement.getContext('2d');
      context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      // Get image data from canvas
      const imageDataUrl = canvasElement.toDataURL('image/jpeg');
      
      // Stop all video streams
      stream.getTracks().forEach(track => track.stop());
      
      setPreviewUrl(imageDataUrl);
      await processImage(imageDataUrl);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Could not access camera. Please check permissions.");
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleDefaultWeightChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDefaultWeight(value);
    }
  };

  const handleFoodWeightChange = (index, e) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value) || value <= 0) {
      return;
    }
    
    const updatedFood = {
      ...originalFoods[index],
      weight: value
    };
    
    const calculatedNutrition = calculateNutritionByWeight(originalFoods[index], value);
    const calculatedFood = {
      ...updatedFood,
      ...calculatedNutrition
    };
    
    const updatedFoods = [...recognizedFoodsInternal];
    updatedFoods[index] = calculatedFood;
    
    setRecognizedFoodsInternal(updatedFoods);
    onFoodRecognized(updatedFoods);
  };

  const resetPhotoAndInputs = () => {
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clear the preview image
    setPreviewUrl(null);
  };

  const processImage = async (imageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast({
        title: "Processing",
        description: "Analyzing your food image...",
      });
      
      const results = await recognizeFood(imageData);
      
      if (!results.foods || results.foods.length === 0) {
        setError("Could not recognize food in image. Please try another image.");
        toast({
          title: "Recognition Failed",
          description: "Could not identify the food. Please try another image.",
          variant: "destructive",
        });
        setRecognizedFoodsInternal([]);
        setOriginalFoods([]);
        resetPhotoAndInputs();
      } else {
        const originalNutritions = results.foods.map(food => ({
          ...food,
          weight: 100
        }));
        setOriginalFoods(originalNutritions);
        
        const foodsWithWeight = originalNutritions.map(food => ({
          ...food,
          weight: defaultWeight
        }));
        
        setRecognizedFoodsInternal(foodsWithWeight);
        onFoodRecognized(foodsWithWeight);
        
        toast({
          title: "Food Recognized",
          description: `Detected ${results.foods.length} food item(s)`,
        });
      }
    } catch (error) {
      console.error("Error recognizing food:", error);
      setError("Could not recognize food in image. Please try another image.");
      toast({
        title: "Recognition Error",
        description: "Could not analyze the food image. Please try again.",
        variant: "destructive",
      });
      setRecognizedFoodsInternal([]);
      setOriginalFoods([]);
      resetPhotoAndInputs();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAllWeights = () => {
    if (recognizedFoodsInternal.length === 0) return;
    
    const updatedFoods = originalFoods.map(food => {
      const calculatedNutrition = calculateNutritionByWeight(food, defaultWeight);
      return {
        ...food,
        weight: defaultWeight,
        ...calculatedNutrition
      };
    });
    
    setRecognizedFoodsInternal(updatedFoods);
    onFoodRecognized(updatedFoods);
    
    toast({
      title: "Weights Updated",
      description: `All foods updated to ${defaultWeight}g`,
    });
  };

  const handleUpdateNutrition = () => {
    onFoodRecognized(recognizedFoodsInternal);
    setRecognizedFoodsInternal([]);
    setOriginalFoods([]);
    // Reset the photo after nutrition data is updated
    resetPhotoAndInputs();
    toast({
      title: "Nutrition Updated",
      description: "Nutrition data has been updated",
    });
  };

  const handleRemoveFood = (index) => {
    const updatedFoods = [...recognizedFoodsInternal];
    updatedFoods.splice(index, 1);
    setRecognizedFoodsInternal(updatedFoods);
    
    const updatedOriginalFoods = [...originalFoods];
    updatedOriginalFoods.splice(index, 1);
    setOriginalFoods(updatedOriginalFoods);
    
    onFoodRecognized(updatedFoods);
    
    toast({
      title: "Food Removed",
      description: "Food item has been removed from the list",
    });
  };

  return (
    <div className="food-recognition">
      <div className="food-recognition-input">
        <div className="camera-preview">
          {previewUrl && (
            <img src={previewUrl} alt="Food preview" className="preview-image" />
          )}
          {!previewUrl && (
            <div className="camera-placeholder">
              <span>📷</span>
              <p>Take a photo or upload an image</p>
            </div>
          )}
        </div>
        
        <div className="weight-input-container">
          <label htmlFor="food-weight">Default Weight (g):</label>
          <input
            id="food-weight"
            type="number"
            min="1"
            value={defaultWeight}
            onChange={handleDefaultWeightChange}
            className="weight-input"
          />
          {recognizedFoodsInternal.length > 0 && (
            <button 
              onClick={handleUpdateAllWeights}
              className="btn btn-sm"
            >
              Apply to All
            </button>
          )}
        </div>
        
        <div className="camera-controls">
          <div className="upload-btn-wrapper">
            <button className="btn">
              <span className="camera-icon">📁</span> Upload
            </button>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={fileInputRef}
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={takePhoto}
            disabled={isLoading}
          >
            <span className="camera-icon">📷</span> Take Photo
          </button>
        </div>
        
        {isLoading && <div className="loading">Analyzing food...</div>}
        {error && <div className="error">{error}</div>}
        
        {recognizedFoodsInternal.length > 0 && (
          <div className="recognized-foods-container mt-4">
            <h3>Recognized Foods</h3>
            <div className="recognized-foods-list">
              {recognizedFoodsInternal.map((food, index) => (
                <div key={index} className="recognized-food-card">
                  <div className="recognized-food-info">
                    <div className="food-header">
                      <h4>{food.name}</h4>
                      <button
                        onClick={() => handleRemoveFood(index)}
                        className="btn-remove"
                        aria-label="Remove food"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="food-weight-control">
                      <label htmlFor={`food-weight-${index}`}>Weight (g):</label>
                      <input
                        id={`food-weight-${index}`}
                        type="number"
                        min="1"
                        value={food.weight || 100}
                        onChange={(e) => handleFoodWeightChange(index, e)}
                        className="weight-input"
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value) || value <= 0) {
                            const updatedFoods = [...recognizedFoodsInternal];
                            updatedFoods[index] = {
                              ...updatedFoods[index],
                              weight: 100
                            };
                            updatedFoods[index] = calculateNutritionByWeight(updatedFoods[index]);
                            setRecognizedFoodsInternal(updatedFoods);
                            onFoodRecognized(updatedFoods);
                          }
                        }}
                      />
                    </div>
                    <div className="nutrition-facts">
                      <div className="nutrition-fact">
                        <span className="label">Calories:</span>
                        <span className="value">{food.calories} kcal</span>
                      </div>
                      <div className="nutrition-fact">
                        <span className="label">Protein:</span>
                        <span className="value">{food.protein}g</span>
                      </div>
                      <div className="nutrition-fact">
                        <span className="label">Carbs:</span>
                        <span className="value">{food.carbs}g</span>
                      </div>
                      <div className="nutrition-fact">
                        <span className="label">Fat:</span>
                        <span className="value">{food.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-primary mt-4" onClick={handleUpdateNutrition}>
              Update Nutrition Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecognition;
