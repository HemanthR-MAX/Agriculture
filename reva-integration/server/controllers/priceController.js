// // server/controllers/priceController.js
// import { predictMarketPrice, getCurrentMarketPrices } from '../utils/priceService.js';

// export const getPricePrediction = async (req, res) => {
//   try {
//     const { cropType, harvestDate, region } = req.query;
    
//     if (!cropType || !harvestDate) {
//       return res.status(400).json({
//         success: false,
//         message: 'Crop type and harvest date are required'
//       });
//     }
    
//     const prediction = await predictMarketPrice(cropType, harvestDate, region);
    
//     res.status(200).json({
//       success: true,
//       prediction
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const getCurrentPrices = async (req, res) => {
//   try {
//     const { cropType, region } = req.query;
    
//     const prices = await getCurrentMarketPrices(cropType, region);
    
//     res.status(200).json({
//       success: true,
//       prices
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
// // server/controllers/priceController.js - Add test endpoint
// export const testPriceAPIs = async (req, res) => {
//   try {
//     const results = {
//       timestamp: new Date(),
//       tests: []
//     };
    
//     // Test current prices
//     const tomatoPrice = await getCurrentMarketPrices('Tomato', 'Karnataka');
//     results.tests.push({
//       name: 'Current Market Price',
//       crop: 'Tomato',
//       state: 'Karnataka',
//       result: tomatoPrice,
//       status: 'success'
//     });
    
//     // Test price prediction
//     const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
//     const prediction = await predictMarketPrice('Tomato', futureDate, 'Karnataka');
//     results.tests.push({
//       name: 'Price Prediction',
//       crop: 'Tomato',
//       harvestDate: futureDate,
//       result: prediction,
//       status: 'success'
//     });
    
//     // Test historical trends
//     const trends = await getHistoricalPriceTrends('Tomato', 7, 'Karnataka');
//     results.tests.push({
//       name: 'Historical Trends',
//       crop: 'Tomato',
//       days: 7,
//       result: trends,
//       status: 'success'
//     });
    
//     res.status(200).json({
//       success: true,
//       message: 'All price API tests completed',
//       results
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Test failed',
//       error: error.message
//     });
//   }
// };
// server/controllers/priceController.js
import { predictMarketPrice, getCurrentMarketPrices, getHistoricalPriceTrends } from '../utils/priceService.js';

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

export const testPriceAPIs = async (req, res) => {
  try {
    const results = {
      timestamp: new Date(),
      tests: []
    };
    
    console.log('🧪 Running Price API Tests...');
    
    // Test 1: Current prices for multiple crops
    console.log('Test 1: Current Market Prices');
    const crops = ['Tomato', 'Onion', 'Potato'];
    
    for (const crop of crops) {
      try {
        const price = await getCurrentMarketPrices(crop, 'Karnataka');
        results.tests.push({
          name: 'Current Market Price',
          crop: crop,
          state: 'Karnataka',
          result: price,
          status: 'success'
        });
        console.log(`✅ ${crop}: ₹${price.currentPrice}/kg (${price.source})`);
      } catch (error) {
        results.tests.push({
          name: 'Current Market Price',
          crop: crop,
          status: 'failed',
          error: error.message
        });
        console.log(`❌ ${crop} failed: ${error.message}`);
      }
    }
    
    // Test 2: Price prediction
    console.log('\nTest 2: Price Prediction');
    const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    try {
      const prediction = await predictMarketPrice('Tomato', futureDate, 'Karnataka');
      results.tests.push({
        name: 'Price Prediction',
        crop: 'Tomato',
        harvestDate: futureDate,
        result: prediction,
        status: 'success'
      });
      console.log(`✅ Prediction: ₹${prediction.predictedPrice}/kg (Confidence: ${prediction.confidence * 100}%)`);
    } catch (error) {
      results.tests.push({
        name: 'Price Prediction',
        status: 'failed',
        error: error.message
      });
      console.log(`❌ Prediction failed: ${error.message}`);
    }
    
    // Test 3: Historical trends
    console.log('\nTest 3: Historical Trends');
    try {
      const trends = await getHistoricalPriceTrends('Tomato', 7, 'Karnataka');
      results.tests.push({
        name: 'Historical Trends',
        crop: 'Tomato',
        days: 7,
        result: {
          dataPoints: trends.trends.length,
          firstPrice: trends.trends[0].price,
          lastPrice: trends.trends[trends.trends.length - 1].price
        },
        status: 'success'
      });
      console.log(`✅ Historical data: ${trends.trends.length} data points`);
    } catch (error) {
      results.tests.push({
        name: 'Historical Trends',
        status: 'failed',
        error: error.message
      });
      console.log(`❌ Trends failed: ${error.message}`);
    }
    
    const successCount = results.tests.filter(t => t.status === 'success').length;
    const totalCount = results.tests.length;
    
    console.log(`\n✅ Tests Complete: ${successCount}/${totalCount} passed\n`);
    
    res.status(200).json({
      success: true,
      message: `All price API tests completed: ${successCount}/${totalCount} passed`,
      summary: {
        total: totalCount,
        passed: successCount,
        failed: totalCount - successCount
      },
      results
    });
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test suite failed',
      error: error.message
    });
  }
};
