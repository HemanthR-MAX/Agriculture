// // server/controllers/requirementController.js
// import Requirement from '../models/Requirement.js';
// import { runMatchingAlgorithm } from '../utils/matchingService.js';

// // Post new requirement
// export const postRequirement = async (req, res) => {
//   try {
//     const requirement = new Requirement({
//       ...req.body,
//       companyId: req.user.id
//     });
    
//     requirement.fulfillment.totalRequired = req.body.demandDetails.quantity.totalAmount;
    
//     await requirement.save();
    
//     // Run matching algorithm
//     const matches = await runMatchingAlgorithm(null, requirement._id);
    
//     res.status(201).json({
//       success: true,
//       requirement,
//       matches
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get company requirements
// export const getCompanyRequirements = async (req, res) => {
//   try {
//     const requirements = await Requirement.find({ companyId: req.user.id }).sort('-createdAt');
//     res.status(200).json({ success: true, requirements });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get requirement details
// export const getRequirementDetails = async (req, res) => {
//   try {
//     const requirement = await Requirement.findById(req.params.id)
//       .populate('companyId', 'companyInfo contactPerson');
//     res.status(200).json({ success: true, requirement });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// server/controllers/requirementController.js
import Requirement from '../models/Requirement.js';
import { runMatchingAlgorithm } from '../utils/matchingService.js';

// Post new requirement
export const postRequirement = async (req, res) => {
  try {
    const requirement = new Requirement({
      ...req.body,
      companyId: req.user.id
    });
    
    requirement.fulfillment.totalRequired = req.body.demandDetails.quantity.totalAmount;
    
    await requirement.save();
    console.log('✅ Requirement saved:', requirement._id);
    
    // Run matching algorithm
    try {
      const matches = await runMatchingAlgorithm(null, requirement._id);
      console.log(`🎯 Found ${matches.length} matches for this requirement`);
      
      res.status(201).json({
        success: true,
        requirement,
        matches: matches.length,
        message: matches.length > 0 
          ? `Great! Matched with ${matches.length} farmer(s)!` 
          : 'Requirement posted successfully. We\'ll notify you when farmers are found.'
      });
    } catch (matchError) {
      console.error('Matching error:', matchError);
      res.status(201).json({
        success: true,
        requirement,
        matches: 0,
        message: 'Requirement posted successfully'
      });
    }
  } catch (error) {
    console.error('Error posting requirement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get company requirements
export const getCompanyRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({ companyId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get requirement details
export const getRequirementDetails = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id)
      .populate('companyId', 'companyInfo contactPerson');
    res.status(200).json({ success: true, requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
