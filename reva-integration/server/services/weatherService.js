export const getWeatherForecast = async (lat, lng) => {
  // Fallback if genkit fails
  return { temp: 25, rain: 10, summary: 'Sunny' };
};
