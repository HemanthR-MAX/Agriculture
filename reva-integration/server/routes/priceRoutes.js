// server/routes/priceRoutes.js
import express from 'express';
import { getPricePrediction, getCurrentPrices, testPriceAPIs } from '../controllers/priceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Test endpoint (no auth required)
router.get('/test', testPriceAPIs);

// Protected routes
router.get('/predict', protect(['farmer', 'company']), getPricePrediction);
router.get('/current', protect(['farmer', 'company']), getCurrentPrices);

export default router;
