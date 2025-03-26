
import React, { useState, useRef } from 'react';
import { recognizeFood, FoodNutrition, calculateNutritionByWeight } from '../services/api';
import { toast } from "../hooks/use-toast";
import './FoodRecognition.css';

interface FoodRecognitionProps {
  onFoodRecognized: (foods: FoodNutrition[]) => void;
}

const FoodRecognition: React.FC<FoodRecognitionProps> = ({ onFoodRecognized }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [defaultWeight, setDefaultWeight] = useState<number>(100);
  const [recognizedFoodsInternal, setRecognizedFoodsInternal] = useState<FoodNutrition[]>([]);
  const [originalFoods, setOriginalFoods] = useState<FoodNutrition[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
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

  const handleDefaultWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDefaultWeight(value);
    }
  };

  const handleFoodWeightChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value) || value <= 0) {
      return;
    }
    
    const updatedFood = {
      ...originalFoods[index],
      weight: value
    };
    
    const calculatedFood = calculateNutritionByWeight(updatedFood);
    
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

  const processImage = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast({
        title: "Processing",
        description: "Analyzing your food image...",
      });
      
      const results = await recognizeFood(imageData);
      
      if (results.length === 0 || (results.length === 1 && results[0].name === 'Unknown Food')) {
        setError("Could not recognize food in image. Please try another image.");
        toast({
          title: "Recognition Failed",
          description: "Could not identify the food. Please try another image.",
          variant: "destructive",
        });
        setRecognizedFoodsInternal([]);
        setOriginalFoods([]);
        // Reset photo since recognition failed
        resetPhotoAndInputs();
      } else {
        const originalNutritions = results.map(food => ({
          ...food,
          weight: 100
        }));
        setOriginalFoods(originalNutritions);
        
        const foodsWithWeight = originalNutritions.map(food => ({
          ...food,
          weight: defaultWeight
        }));
        
        const adjustedResults = foodsWithWeight.map(food => calculateNutritionByWeight(food));
        
        setRecognizedFoodsInternal(adjustedResults);
        onFoodRecognized(adjustedResults);
        
        toast({
          title: "Food Recognized",
          description: `Detected ${results.length} food item(s)`,
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
      // Reset photo since there was an error
      resetPhotoAndInputs();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAllWeights = () => {
    if (recognizedFoodsInternal.length === 0) return;
    
    const updatedFoods = originalFoods.map(food => {
      const updatedFood = {
        ...food,
        weight: defaultWeight
      };
      return calculateNutritionByWeight(updatedFood);
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
                    <h4>{food.name}</h4>
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
