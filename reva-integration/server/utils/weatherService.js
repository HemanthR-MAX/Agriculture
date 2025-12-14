// server/utils/weatherService.js
import axios from 'axios';

export const getWeatherImpact = async (location) => {
  try {
    if (!location || !location.lat || !location.lng) {
      console.log('No location data, using default weather factor');
      return 1.0; // Neutral impact
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.log('No weather API key, using default factor');
      return 1.0;
    }

    // Get current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${apiKey}&units=metric`;
    const currentResponse = await axios.get(currentWeatherUrl);
    
    // Get 7-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${apiKey}&units=metric`;
    const forecastResponse = await axios.get(forecastUrl);
    
    const currentWeather = currentResponse.data;
    const forecast = forecastResponse.data;
    
    // Calculate weather impact factor
    let weatherFactor = 1.0;
    
    // Temperature impact (optimal 20-30°C)
    const avgTemp = currentWeather.main.temp;
    if (avgTemp < 15 || avgTemp > 35) {
      weatherFactor *= 0.85; // 15% reduction for extreme temps
    } else if (avgTemp >= 20 && avgTemp <= 30) {
      weatherFactor *= 1.1; // 10% bonus for optimal temps
    }
    
    // Rainfall impact
    const rainfall = currentWeather.rain?.['1h'] || 0;
    if (rainfall > 50) {
      weatherFactor *= 0.8; // Heavy rain reduces yield
    } else if (rainfall > 10 && rainfall <= 50) {
      weatherFactor *= 1.05; // Moderate rain is good
    }
    
    // Check for adverse conditions
    const weatherMain = currentWeather.weather[0].main.toLowerCase();
    if (weatherMain.includes('storm') || weatherMain.includes('extreme')) {
      weatherFactor *= 0.7;
    }
    
    // Analyze forecast for next 7 days
    let rainyDays = 0;
    let extremeTempDays = 0;
    
    forecast.list.slice(0, 14).forEach(item => { // Next ~2 days
      if (item.rain?.['3h'] > 10) rainyDays++;
      if (item.main.temp > 38 || item.main.temp < 10) extremeTempDays++;
    });
    
    if (rainyDays > 4) weatherFactor *= 0.9;
    if (extremeTempDays > 3) weatherFactor *= 0.85;
    
    console.log('Weather Impact Analysis:', {
      location: `${location.lat}, ${location.lng}`,
      temperature: avgTemp,
      rainfall,
      condition: weatherMain,
      weatherFactor: weatherFactor.toFixed(2)
    });
    
    return Math.max(0.6, Math.min(1.2, weatherFactor)); // Cap between 0.6 and 1.2
    
  } catch (error) {
    console.error('Weather API error:', error.message);
    return 1.0; // Default to neutral on error
  }
};

export const getWeatherForecast = async (location) => {
  try {
    if (!location || !location.lat || !location.lng) {
      return null;
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return null;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    
    return {
      location: response.data.city.name,
      forecast: response.data.list.slice(0, 8).map(item => ({
        date: new Date(item.dt * 1000),
        temp: item.main.temp,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        rainfall: item.rain?.['3h'] || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    return null;
  }
};
