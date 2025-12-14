// server/controllers/priceController.js
import { predictMarketPrice, getCurrentMarketPrices } from '../utils/priceService.js';

export const getPricePrediction = async (req, res) => {
  try {
    const { cropType, harvestDate, region } = req.query;
    
    if (!cropType || !harvestDate) {
      return res.status(400).json({
        success: false,
        message: 'Crop type and harvest date are required'
      });
    }
    
    const prediction = await predictMarketPrice(cropType, harvestDate, region);
    
    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentPrices = async (req, res) => {
  try {
    const { cropType, region } = req.query;
    
    const prices = await getCurrentMarketPrices(cropType, region);
    
    res.status(200).json({
      success: true,
      prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
