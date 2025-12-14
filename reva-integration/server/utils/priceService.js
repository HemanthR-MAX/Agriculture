// server/utils/priceService.js
import axios from 'axios';

// AgMarkNet API configuration
const AGMARKNET_BASE_URL = 'https://api.data.gov.in/resource';
const AGMARKNET_API_KEY = process.env.AGMARKNET_API_KEY; // Get from data.gov.in

// Historical price data (backup/baseline)
const historicalPrices = {
  'Tomato': { min: 12, max: 35, avg: 20, volatility: 0.4, commodity_id: '24' },
  'Onion': { min: 15, max: 50, avg: 28, volatility: 0.5, commodity_id: '23' },
  'Potato': { min: 10, max: 25, avg: 16, volatility: 0.3, commodity_id: '26' },
  'Cabbage': { min: 8, max: 20, avg: 12, volatility: 0.35, commodity_id: '14' },
  'Carrot': { min: 15, max: 30, avg: 22, volatility: 0.25, commodity_id: '15' }
};

// State to market mapping
const stateMarkets = {
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Nagpur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati']
};

/**
 * Fetch real-time prices from AgMarkNet
 */
export const fetchAgMarkNetPrices = async (cropType, state = 'Karnataka') => {
  try {
    const cropData = historicalPrices[cropType];
    if (!cropData) {
      console.log(`No commodity mapping for ${cropType}`);
      return null;
    }

    const markets = stateMarkets[state] || stateMarkets['Karnataka'];
    
    // Try AgMarkNet API first
    if (AGMARKNET_API_KEY) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      // AgMarkNet API endpoint
      const url = `${AGMARKNET_BASE_URL}/9ef84268-d588-465a-a308-a864a43d0070`;
      
      try {
        const response = await axios.get(url, {
          params: {
            'api-key': AGMARKNET_API_KEY,
            format: 'json',
            limit: 10,
            'filters[commodity]': cropType,
            'filters[state]': state
          },
          timeout: 5000
        });

        if (response.data && response.data.records && response.data.records.length > 0) {
          const records = response.data.records;
          const prices = records.map(r => parseFloat(r.modal_price)).filter(p => !isNaN(p));
          
          if (prices.length > 0) {
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            
            return {
              source: 'AgMarkNet',
              avgPrice: Math.round(avgPrice * 100) / 100,
              minPrice: Math.round(minPrice * 100) / 100,
              maxPrice: Math.round(maxPrice * 100) / 100,
              markets: records.map(r => r.market),
              date: today,
              dataPoints: prices.length
            };
          }
        }
      } catch (apiError) {
        console.log('AgMarkNet API error:', apiError.message);
      }
    }

    // Fallback to scraping or alternative APIs
    return await fetchAlternativePrices(cropType, state);
    
  } catch (error) {
    console.error('Error fetching AgMarkNet prices:', error.message);
    return null;
  }
};

/**
 * Alternative price sources (eNAM, state portals)
 */
export const fetchAlternativePrices = async (cropType, state) => {
  try {
    // Try eNAM (National Agriculture Market) API
    const enamUrl = 'https://enam.gov.in/web/ajax/priceservice';
    
    try {
      const response = await axios.post(enamUrl, {
        statecode: getStateCode(state),
        commodity: cropType
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.prices) {
        const prices = response.data.prices.map(p => parseFloat(p.modalPrice)).filter(p => !isNaN(p));
        
        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          
          return {
            source: 'eNAM',
            avgPrice: Math.round(avgPrice * 100) / 100,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            date: new Date(),
            dataPoints: prices.length
          };
        }
      }
    } catch (enamError) {
      console.log('eNAM API error:', enamError.message);
    }

    // If all APIs fail, use enhanced simulation with real market patterns
    return generateRealisticPrice(cropType, state);
    
  } catch (error) {
    console.error('Alternative price fetch error:', error.message);
    return generateRealisticPrice(cropType, state);
  }
};

/**
 * Generate realistic prices based on market patterns
 */
const generateRealisticPrice = (cropType, state) => {
  const baseData = historicalPrices[cropType] || { min: 10, max: 30, avg: 18, volatility: 0.3 };
  
  const now = new Date();
  const month = now.getMonth();
  const dayOfWeek = now.getDay();
  
  // Seasonal variation
  let seasonalFactor = 1.0;
  if (month >= 10 || month <= 1) seasonalFactor = 1.15; // Winter - high demand
  else if (month >= 6 && month <= 9) seasonalFactor = 0.9; // Monsoon - oversupply
  
  // Weekly variation (prices higher on weekends)
  const weekdayFactor = dayOfWeek >= 5 ? 1.05 : 1.0;
  
  // Add realistic random variation
  const randomVariation = 1 + (Math.random() * 0.15 - 0.075); // ±7.5%
  
  const currentPrice = baseData.avg * seasonalFactor * weekdayFactor * randomVariation;
  
  return {
    source: 'Estimated',
    avgPrice: Math.round(currentPrice * 100) / 100,
    minPrice: Math.round((currentPrice * 0.9) * 100) / 100,
    maxPrice: Math.round((currentPrice * 1.1) * 100) / 100,
    date: now,
    dataPoints: 1,
    note: 'Price estimated based on market patterns'
  };
};

/**
 * Get real-time market prices
 */
export const getCurrentMarketPrices = async (cropType, state = 'Karnataka') => {
  try {
    // Try to get real prices
    const realPrices = await fetchAgMarkNetPrices(cropType, state);
    
    if (realPrices) {
      return {
        cropType,
        region: state,
        currentPrice: realPrices.avgPrice,
        priceRange: {
          min: realPrices.minPrice,
          max: realPrices.maxPrice
        },
        date: realPrices.date,
        markets: realPrices.markets || stateMarkets[state],
        source: realPrices.source,
        priceUnit: '₹/kg',
        dataPoints: realPrices.dataPoints
      };
    }

    // Fallback
    const fallbackPrice = generateRealisticPrice(cropType, state);
    return {
      cropType,
      region: state,
      currentPrice: fallbackPrice.avgPrice,
      priceRange: {
        min: fallbackPrice.minPrice,
        max: fallbackPrice.maxPrice
      },
      date: new Date(),
      marketName: stateMarkets[state]?.[0] || 'Local Market',
      source: 'Estimated',
      priceUnit: '₹/kg'
    };
    
  } catch (error) {
    console.error('Error fetching market prices:', error);
    
    // Final fallback
    const basePrice = historicalPrices[cropType]?.avg || 18;
    return {
      cropType,
      region: state,
      currentPrice: basePrice,
      date: new Date(),
      marketName: 'Baseline',
      source: 'Historical Average',
      priceUnit: '₹/kg'
    };
  }
};

/**
 * Advanced price prediction with real market data
 */
export const predictMarketPrice = async (cropType, harvestDate, state = 'Karnataka') => {
  try {
    // Get current real market price
    const currentMarket = await getCurrentMarketPrices(cropType, state);
    const currentPrice = currentMarket.currentPrice;
    
    // Calculate days until harvest
    const now = new Date();
    const harvest = new Date(harvestDate);
    const daysUntilHarvest = Math.ceil((harvest - now) / (1000 * 60 * 60 * 24));
    
    // Use current price as baseline instead of historical
    let predictedPrice = currentPrice;
    
    // Historical volatility
    const historicalData = historicalPrices[cropType] || { volatility: 0.3 };
    
    // Seasonal adjustment
    const harvestMonth = harvest.getMonth();
    const seasonalFactors = {
      'Tomato': { winter: 1.2, summer: 0.85, monsoon: 1.1, spring: 1.0 },
      'Onion': { winter: 1.15, summer: 1.3, monsoon: 0.9, spring: 1.05 },
      'Potato': { winter: 0.95, summer: 1.1, monsoon: 1.05, spring: 1.0 },
      'Cabbage': { winter: 1.1, summer: 0.9, monsoon: 1.0, spring: 1.0 },
      'Carrot': { winter: 1.15, summer: 0.95, monsoon: 1.0, spring: 1.05 }
    };
    
    let season = 'winter';
    if (harvestMonth >= 3 && harvestMonth <= 5) season = 'spring';
    else if (harvestMonth >= 6 && harvestMonth <= 8) season = 'monsoon';
    else if (harvestMonth >= 9 && harvestMonth <= 11) season = 'autumn';
    
    const seasonalFactor = seasonalFactors[cropType]?.[season] || 1.0;
    
    // Apply seasonal adjustment
    predictedPrice *= seasonalFactor;
    
    // Market trend analysis (based on time horizon)
    const trendFactor = calculateMarketTrend(cropType, daysUntilHarvest);
    predictedPrice *= trendFactor;
    
    // Supply-demand forecast
    const supplyDemandFactor = forecastSupplyDemand(cropType, harvest, state);
    predictedPrice *= supplyDemandFactor;
    
    // Calculate uncertainty based on time
    const timeUncertainty = Math.min(0.5, daysUntilHarvest / 120); // Max 50% uncertainty
    const volatility = historicalData.volatility * timeUncertainty;
    
    // Calculate price range
    const minPrice = Math.max(historicalData.min || 5, predictedPrice * (1 - volatility));
    const maxPrice = Math.min(historicalData.max || 100, predictedPrice * (1 + volatility));
    
    // Confidence decreases with time
    const confidence = Math.max(0.6, Math.min(0.95, 1 - (timeUncertainty * 0.6)));
    
    const prediction = {
      cropType,
      currentMarketPrice: currentPrice,
      currentPriceSource: currentMarket.source,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      priceRange: {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100
      },
      confidence: Math.round(confidence * 100) / 100,
      harvestDate,
      daysUntilHarvest,
      season,
      state,
      seasonalFactor: Math.round(seasonalFactor * 100) / 100,
      trendFactor: Math.round(trendFactor * 100) / 100,
      supplyDemandFactor: Math.round(supplyDemandFactor * 100) / 100,
      analysis: {
        trend: trendFactor > 1.05 ? 'Upward' : trendFactor < 0.95 ? 'Downward' : 'Stable',
        volatility: historicalData.volatility > 0.4 ? 'High' : historicalData.volatility > 0.25 ? 'Moderate' : 'Low',
        recommendation: generateRecommendation(predictedPrice, currentPrice, seasonalFactor, daysUntilHarvest)
      },
      marketInsights: {
        currentAvgPrice: currentPrice,
        priceChange: Math.round(((predictedPrice - currentPrice) / currentPrice) * 100),
        seasonalImpact: seasonalFactor > 1.1 ? 'Favorable' : seasonalFactor < 0.9 ? 'Unfavorable' : 'Neutral',
        timeToMarket: daysUntilHarvest > 60 ? 'Long term' : daysUntilHarvest > 30 ? 'Medium term' : 'Short term'
      }
    };
    
    console.log('✅ Price Prediction Complete:', {
      crop: cropType,
      current: currentPrice,
      predicted: prediction.predictedPrice,
      change: `${prediction.marketInsights.priceChange}%`
    });
    
    return prediction;
    
  } catch (error) {
    console.error('Price prediction error:', error);
    
    // Fallback to basic prediction
    const basePrice = historicalPrices[cropType]?.avg || 18;
    return {
      cropType,
      predictedPrice: basePrice,
      confidence: 0.5,
      error: 'Using baseline prediction due to data unavailability'
    };
  }
};

/**
 * Calculate market trend based on crop and time horizon
 */
const calculateMarketTrend = (cropType, daysUntilHarvest) => {
  // Long-term trends (based on crop cycles)
  const cropCycles = {
    'Tomato': 75,
    'Onion': 120,
    'Potato': 90,
    'Cabbage': 80,
    'Carrot': 70
  };
  
  const typicalCycle = cropCycles[cropType] || 90;
  const cycleFactor = daysUntilHarvest / typicalCycle;
  
  // Prices tend to rise as supply tightens (closer to end of season)
  if (cycleFactor > 0.8) return 1.08; // Late in cycle - prices rising
  if (cycleFactor < 0.3) return 0.95; // Early in cycle - oversupply
  
  return 1.0 + (Math.random() * 0.06 - 0.03); // ±3% random variation
};

/**
 * Forecast supply-demand based on season and region
 */
const forecastSupplyDemand = (cropType, harvestDate, state) => {
  const month = new Date(harvestDate).getMonth();
  
  // Festival seasons increase demand
  const festivalMonths = [9, 10, 11]; // Oct, Nov, Dec - Diwali, Christmas
  const isFestivalSeason = festivalMonths.includes(month);
  
  // Summer months have lower supply for most crops
  const isSummerHarvest = month >= 3 && month <= 5;
  
  let factor = 1.0;
  
  if (isFestivalSeason) factor *= 1.15; // 15% demand boost
  if (isSummerHarvest) factor *= 1.1; // 10% supply constraint
  
  // State-specific factors (Karnataka has good infrastructure)
  const stateFactors = {
    'Karnataka': 1.05,
    'Maharashtra': 1.08,
    'Tamil Nadu': 1.03,
    'Andhra Pradesh': 1.02
  };
  
  factor *= (stateFactors[state] || 1.0);
  
  return factor;
};

/**
 * Generate actionable recommendation
 */
const generateRecommendation = (predicted, current, seasonal, daysUntil) => {
  const priceChange = ((predicted - current) / current) * 100;
  
  if (priceChange > 15 && daysUntil > 30) {
    return '🌟 Excellent opportunity! Price expected to rise significantly. Plan for harvest at predicted time.';
  }
  
  if (priceChange < -15 && daysUntil > 30) {
    return '⚠️ Warning: Price decline expected. Consider early harvest if possible or storage options.';
  }
  
  if (seasonal > 1.15) {
    return '✅ Favorable season. Market conditions are good for this crop.';
  }
  
  if (seasonal < 0.9) {
    return '⏳ Off-season harvest. Consider value-addition or direct marketing to improve margins.';
  }
  
  return '📊 Normal market conditions. Proceed with standard harvest and marketing plan.';
};

/**
 * Get state code for eNAM API
 */
const getStateCode = (state) => {
  const codes = {
    'Karnataka': 'KA',
    'Maharashtra': 'MH',
    'Tamil Nadu': 'TN',
    'Andhra Pradesh': 'AP',
    'Telangana': 'TS',
    'Kerala': 'KL'
  };
  return codes[state] || 'KA';
};

/**
 * Fetch historical price trends (for charts/analysis)
 */
export const getHistoricalPriceTrends = async (cropType, days = 30, state = 'Karnataka') => {
  try {
    // In production, fetch from AgMarkNet historical data
    // For now, generate realistic historical data
    
    const trends = [];
    const basePrice = historicalPrices[cropType]?.avg || 18;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayVariation = 1 + (Math.random() * 0.1 - 0.05); // ±5% daily
      const trendVariation = 1 + ((days - i) / days) * 0.1; // Gradual trend
      
      const price = basePrice * dayVariation * trendVariation;
      
      trends.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        market: stateMarkets[state]?.[0] || 'Local Market'
      });
    }
    
    return {
      cropType,
      state,
      period: `${days} days`,
      trends
    };
    
  } catch (error) {
    console.error('Error fetching historical trends:', error);
    return null;
  }
};
