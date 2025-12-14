export const predictQualityDistribution = (cropData) => {
  const { cropType, soilType, weather, area, historical } = cropData;
  
  // PRD Algorithm Logic
  const baseDist = {
    Tomato: { A: 0.35, B: 0.42, C: 0.23 },
    Onion:  { A: 0.40, B: 0.35, C: 0.25 },
    Potato: { A: 0.30, B: 0.50, C: 0.20 }
  };
  
  let distribution = baseDist[cropType] || { A: 0.35, B: 0.42, C: 0.23 };
  
  // Weather adjustments
  if (weather.rainProbability > 0.3) distribution.C += 0.15;
  if (soilType === 'Sandy') distribution.A -= 0.10;
  
  // Normalize
  const total = distribution.A + distribution.B + distribution.C;
  return {
    gradeA: (distribution.A / total * 100).toFixed(0),
    gradeB: (distribution.B / total * 100).toFixed(0),
    gradeC: (distribution.C / total * 100).toFixed(0)
  };
};

// BEST GRADE RECOMMENDATION
export const recommendQualityTarget = (crop, companyRequirements) => {
  const contractGrade = companyRequirements?.qualityGrade || 'B';
  const farmerSuccess = { A: 0.50, B: 0.85, C: 0.95 };
  
  return {
    recommendedGrade: contractGrade,
    successRate: farmerSuccess[contractGrade],
    reasoning: `Contract needs ${contractGrade}-grade. ${farmerSuccess[contractGrade]*100}% success with your conditions.`
  };
};
