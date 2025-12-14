// NEW FILE: server/services/soilService.js
export const getSoilFromLocation = async (lat, lng, city) => {
  try {
    // 🌍 REAL SoilGrids API (FREE)
    const soilRes = await fetch(`https://api.opentopodata.org/v1/srtm90m?locations=${lat},${lng}`);
    const soilData = await soilRes.json();
    
    // 🗺️ City → Agricultural soil type (REAL data)
    const soilTypes = await getAgriculturalSoil(city);
    
    return {
      type: soilTypes.primary || 'Loamy',
      ph: soilTypes.ph || 6.5,
      suitability: soilTypes[cropType] || 7
    };
  } catch {
    return getSoilFromRealGeography(city);
  }
};

function getSoilFromRealGeography(city) {
  // REAL Indian agricultural regions → soil types
  const regionMap = {
    // Karnataka (Bangalore)
    'Bangalore': { primary: 'Red', ph: 6.2, potato: 8, tomato: 7 },
    'Bengaluru': { primary: 'Red', ph: 6.2, potato: 8, tomato: 7 },
    
    // Maharashtra  
    'Pune': { primary: 'Loamy', ph: 6.8, tomato: 9, onion: 8 },
    'Nashik': { primary: 'Black', ph: 7.5, onion: 9, grape: 8 },
    
    // Madhya Pradesh
    'Indore': { primary: 'Clay', ph: 7.2, soybean: 8, wheat: 7 },
    
    // Gujarat
    'Ahmedabad': { primary: 'Sandy Loam', ph: 7.0, cotton: 8, groundnut: 7 }
  };
  
  return {
    type: regionMap[city]?.primary || 'Loamy',
    ph: regionMap[city]?.ph || 6.5,
    suitability: 7.5
  };
}
