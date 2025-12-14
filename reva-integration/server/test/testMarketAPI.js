// server/test/testMarketAPI.js
import { 
  getCurrentMarketPrices, 
  predictMarketPrice, 
  getHistoricalPriceTrends,
  fetchAgMarkNetPrices 
} from '../utils/priceService.js';

const testMarketAPI = async () => {
  console.log('\n🧪 Testing Market Data API...\n');
  
  // Test 1: Get Current Prices
  console.log('📊 Test 1: Current Market Prices');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const crops = ['Tomato', 'Onion', 'Potato', 'Cabbage'];
  const states = ['Karnataka', 'Maharashtra'];
  
  for (const crop of crops) {
    for (const state of states) {
      try {
        const currentPrice = await getCurrentMarketPrices(crop, state);
        console.log(`\n✅ ${crop} in ${state}:`);
        console.log(`   Price: ₹${currentPrice.currentPrice}/kg`);
        console.log(`   Range: ₹${currentPrice.priceRange?.min} - ₹${currentPrice.priceRange?.max}`);
        console.log(`   Source: ${currentPrice.source}`);
        console.log(`   Market: ${currentPrice.marketName || currentPrice.markets?.[0]}`);
      } catch (error) {
        console.log(`❌ Error for ${crop} in ${state}:`, error.message);
      }
    }
  }
  
  // Test 2: Price Predictions
  console.log('\n\n📈 Test 2: Price Predictions');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const harvestDates = [
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)  // 90 days
  ];
  
  for (const crop of ['Tomato', 'Onion']) {
    for (const harvestDate of harvestDates) {
      try {
        const prediction = await predictMarketPrice(crop, harvestDate, 'Karnataka');
        console.log(`\n✅ ${crop} - Harvest in ${prediction.daysUntilHarvest} days:`);
        console.log(`   Current Price: ₹${prediction.currentMarketPrice}/kg`);
        console.log(`   Predicted Price: ₹${prediction.predictedPrice}/kg`);
        console.log(`   Price Change: ${prediction.marketInsights?.priceChange}%`);
        console.log(`   Range: ₹${prediction.priceRange.min} - ₹${prediction.priceRange.max}`);
        console.log(`   Confidence: ${prediction.confidence * 100}%`);
        console.log(`   Season: ${prediction.season}`);
        console.log(`   Trend: ${prediction.analysis.trend}`);
        console.log(`   Recommendation: ${prediction.analysis.recommendation}`);
      } catch (error) {
        console.log(`❌ Error predicting ${crop}:`, error.message);
      }
    }
  }
  
  // Test 3: Historical Trends
  console.log('\n\n📉 Test 3: Historical Price Trends');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const trends = await getHistoricalPriceTrends('Tomato', 7, 'Karnataka');
    console.log(`\n✅ Tomato - Last 7 days in Karnataka:`);
    trends.trends.forEach(trend => {
      console.log(`   ${trend.date}: ₹${trend.price}/kg at ${trend.market}`);
    });
  } catch (error) {
    console.log('❌ Error fetching trends:', error.message);
  }
  
  // Test 4: Direct AgMarkNet Test
  console.log('\n\n🌐 Test 4: AgMarkNet API Direct Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const agmarknetData = await fetchAgMarkNetPrices('Tomato', 'Karnataka');
    if (agmarknetData) {
      console.log('\n✅ AgMarkNet Data Retrieved:');
      console.log(`   Source: ${agmarknetData.source}`);
      console.log(`   Avg Price: ₹${agmarknetData.avgPrice}/kg`);
      console.log(`   Min Price: ₹${agmarknetData.minPrice}/kg`);
      console.log(`   Max Price: ₹${agmarknetData.maxPrice}/kg`);
      console.log(`   Data Points: ${agmarknetData.dataPoints}`);
      console.log(`   Markets: ${agmarknetData.markets?.join(', ') || 'N/A'}`);
    } else {
      console.log('\n⚠️  AgMarkNet API not available - using fallback');
    }
  } catch (error) {
    console.log('❌ AgMarkNet test error:', error.message);
  }
  
  console.log('\n\n✅ Testing Complete!\n');
};

// Run tests
testMarketAPI().catch(console.error);
