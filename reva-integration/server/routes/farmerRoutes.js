import express from 'express';
import { protect } from '../middleware/auth.js';
import Farmer from '../models/Farmer.js';
import { analyzeCrop } from '../controllers/cropController.js';
import { getProfile } from '../controllers/farmerController.js';  // ← ADD THIS

const router = express.Router();
import { autoGeoLocation } from '../middleware/geoMiddleware.js';

router.get('/profile', protect(['farmer']), getProfile);  // ← FIXED
router.post('/crops/analyze', autoGeoLocation, protect(['farmer']), analyzeCrop);
// 🔥 TEMP BYPASS - FOR TESTING (REMOVE LATER)
router.post('/crops/analyze-test', async (req, res) => {
  console.log('🧪 TEST MODE - No auth required');
  req.user = { id: 'test-farmer-123' };  // Fake user
  await analyzeCrop(req, res);
});

router.get('/profile-test', async (req, res) => {
  req.user = { id: 'test-farmer-123' };
  await getProfile(req, res);
});
export default router;
