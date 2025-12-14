// server/utils/matchingService.js
import Crop from '../models/Crop.js';
import Requirement from '../models/Requirement.js';
import Contract from '../models/Contract.js';
import Farmer from '../models/Farmer.js';

const calculateDistance = (loc1, loc2) => {
  if (!loc1 || !loc2 || !loc1.lat || !loc1.lng || !loc2.lat || !loc2.lng) {
    return 0; // If no location data, assume nearby
  }
  
  const R = 6371; // Earth radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const runMatchingAlgorithm = async (cropId = null, requirementId = null) => {
  try {
    console.log('🔄 Running matching algorithm...');
    console.log('CropId:', cropId, 'RequirementId:', requirementId);
    
    // Get all active crops and requirements
    const crops = cropId 
      ? [await Crop.findById(cropId).populate('farmerId')]
      : await Crop.find({ status: 'Growing' }).populate('farmerId');
    
    const requirements = requirementId
      ? [await Requirement.findById(requirementId).populate('companyId')]
      : await Requirement.find({ status: 'Active' }).populate('companyId');
    
    console.log(`Found ${crops.length} crops and ${requirements.length} requirements`);
    
    const matches = [];
    
    for (const crop of crops) {
      if (!crop.farmerId) {
        console.log('⚠️  Crop has no farmer, skipping');
        continue;
      }
      
      for (const requirement of requirements) {
        if (!requirement.companyId) {
          console.log('⚠️  Requirement has no company, skipping');
          continue;
        }
        
        console.log(`\n🔍 Checking match: ${crop.cropDetails.cropType} vs ${requirement.demandDetails.cropType}`);
        
        // Check basic compatibility
        if (crop.cropDetails.cropType !== requirement.demandDetails.cropType) {
          console.log('❌ Crop type mismatch');
          continue;
        }
        
        // Check timing overlap
        const harvestStart = crop.prediction?.maturityWindow?.start ? new Date(crop.prediction.maturityWindow.start) : new Date();
        const harvestEnd = crop.prediction?.maturityWindow?.end ? new Date(crop.prediction.maturityWindow.end) : new Date();
        const demandStart = new Date(requirement.demandDetails.timeline.startDate);
        const demandEnd = new Date(requirement.demandDetails.timeline.endDate);
        
        if (harvestEnd < demandStart || harvestStart > demandEnd) {
          console.log('❌ Timeline mismatch');
          continue;
        }
        
        // Check quality match
        const qualityGrade = requirement.demandDetails.qualityGrade;
        let qualityMatch = 1;
        
        if (qualityGrade !== 'Any' && crop.prediction?.qualityDistribution) {
          const gradeKey = `grade${qualityGrade}`;
          qualityMatch = crop.prediction.qualityDistribution[gradeKey] || 0;
          
          if (qualityMatch < 0.2) {
            console.log('❌ Quality match too low:', qualityMatch);
            continue;
          }
        }
        
        // Calculate quantity to allocate
        const availableQuantity = (crop.prediction?.expectedYield || 0) - (crop.allocatedQuantity || 0);
        const neededQuantity = requirement.fulfillment.totalRequired - requirement.fulfillment.matched;
        
        console.log(`📊 Available: ${availableQuantity}kg, Needed: ${neededQuantity}kg`);
        
        if (availableQuantity < 50) {
          console.log('❌ Available quantity too low');
          continue;
        }
        
        const allocatedQuantity = Math.min(availableQuantity, neededQuantity, requirement.preferences?.minQuantityPerFarmer || 1000);
        
        console.log(`✅ MATCH FOUND! Allocating ${allocatedQuantity}kg`);
        
        // Create contract
        const contract = new Contract({
          farmerId: crop.farmerId._id,
          companyId: requirement.companyId._id,
          cropId: crop._id,
          requirementId: requirement._id,
          details: {
            cropType: crop.cropDetails.cropType,
            qualityGrade: requirement.demandDetails.qualityGrade,
            quantity: allocatedQuantity,
            pricePerKg: requirement.demandDetails.pricing.offerPrice,
            harvestDates: [crop.prediction?.maturityWindow?.start || new Date()],
            deliveryLocation: requirement.demandDetails.logistics.deliveryLocation,
            pickupTime: requirement.demandDetails.logistics.preferredDeliveryTime || '6:00 AM - 10:00 AM'
          }
        });
        
        await contract.save();
        console.log('💾 Contract saved:', contract._id);
        
        // Update crop allocation
        crop.allocatedQuantity = (crop.allocatedQuantity || 0) + allocatedQuantity;
        await crop.save();
        console.log('📝 Crop updated with allocation');
        
        // Update requirement fulfillment
        requirement.fulfillment.matched += allocatedQuantity;
        requirement.fulfillment.percentage = (requirement.fulfillment.matched / requirement.fulfillment.totalRequired) * 100;
        
        if (requirement.fulfillment.percentage >= 90) {
          requirement.fulfillment.status = 'Complete';
        } else if (requirement.fulfillment.percentage > 0) {
          requirement.fulfillment.status = 'Partial';
        }
        
        await requirement.save();
        console.log('📝 Requirement updated:', requirement.fulfillment.percentage + '% fulfilled');
        
        matches.push(contract);
      }
    }
    
    console.log(`\n✨ Matching complete! Created ${matches.length} contracts`);
    return matches;
  } catch (error) {
    console.error('❌ Matching algorithm error:', error);
    throw error;
  }
};
