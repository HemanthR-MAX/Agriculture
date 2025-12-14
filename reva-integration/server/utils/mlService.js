// server/utils/mlService.js
import { getWeatherImpact } from './weatherService.js';
import { predictMarketPrice } from './priceService.js';

export const predictYield = async (crop) => {
  // Populate farmer if not already populated
  if (!crop.farmerId?.farmInfo) {
    await crop.populate('farmerId');
  }
  
  const baseYield = crop.cropDetails.area * 1200; // 1200 kg/acre average
  
  // Soil factor
  const soilMultiplier = {
    'Black': 1.2,
    'Loamy': 1.1,
    'Clay': 1.0,
    'Sandy': 0.9
  };
  const soilFactor = soilMultiplier[crop.farmerId?.farmInfo?.soilType] || 1.0;
  
  // Irrigation factor
  const irrigationMultiplier = {
    'Drip': 1.2,
    'Sprinkler': 1.1,
    'Flood': 1.0,
    'Rainfed': 0.8
  };
  const irrigationFactor = irrigationMultiplier[crop.farmerId?.farmInfo?.irrigationType] || 1.0;
  
  // NEW: Weather impact factor
  const location = crop.cropDetails.fieldLocation || crop.farmerId?.farmInfo?.gpsLocation;
  const weatherFactor = await getWeatherImpact(location);
  
  console.log('Yield Prediction Factors:', {
    base: baseYield,
    soil: soilFactor,
    irrigation: irrigationFactor,
    weather: weatherFactor
  });
  
  // Calculate predicted yield with weather
  const expectedYield = Math.round(baseYield * soilFactor * irrigationFactor * weatherFactor);
  
  // Calculate maturity window
  const plantingDate = new Date(crop.cropDetails.plantingDate);
  const maturityStart = new Date(plantingDate);
  maturityStart.setDate(maturityStart.getDate() + 72);
  const maturityEnd = new Date(plantingDate);
  maturityEnd.setDate(maturityEnd.getDate() + 78);
  
  // NEW: Get price prediction
  const pricePrediction = await predictMarketPrice(
    crop.cropDetails.cropType, 
    maturityStart,
    crop.farmerId?.personalInfo?.state
  );
  
  // Adjust confidence based on weather certainty
  let confidence = 0.85;
  if (weatherFactor < 0.8 || weatherFactor > 1.15) {
    confidence = 0.75; // Lower confidence in extreme weather
  }
  
  return {
    expectedYield,
    confidence,
    qualityDistribution: {
      gradeA: 0.35,
      gradeB: 0.50,
      gradeC: 0.15
    },
    maturityWindow: {
      start: maturityStart,
      end: maturityEnd
    },
    weatherImpact: {
      factor: weatherFactor,
      description: weatherFactor > 1.05 ? 'Favorable' : 
                   weatherFactor < 0.9 ? 'Challenging' : 'Normal'
    },
    pricePrediction: pricePrediction || null
  };
};
