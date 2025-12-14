import express from 'express';
import { 
  registerFarmer,      // Updated: Unified registration
  farmerSendOTP,       // Updated: Login Step 1
  farmerVerifyOTP,     // Updated: Login Step 2
  registerCompany, 
  companyLogin 
} from '../controllers/authController.js';

const router = express.Router();

// Farmer Routes
router.post('/farmer/register', registerFarmer);   // New Unified Registration Route
router.post('/farmer/send-otp', farmerSendOTP);    // Login Step 1 (Check phone)
router.post('/farmer/verify-otp', farmerVerifyOTP); // Login Step 2 (Verify PIN)

// Remove the old 'complete-registration' and 'set-pin' routes if they exist
// router.post('/farmer/set-pin', ...); // REMOVED
// router.put('/farmer/complete-registration/:farmerId', ...); // REMOVED

// Company Routes
router.post('/company/register', registerCompany);
router.post('/company/login', companyLogin);

export default router;
