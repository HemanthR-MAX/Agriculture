// server/routes/cropRoutes.js
import express from 'express';
import { addCrop, getFarmerCrops, getCropDetails, updateCropProgress } from '../controllers/cropController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect(['farmer']), addCrop);
router.get('/farmer', protect(['farmer']), getFarmerCrops);
router.get('/:id', protect(['farmer', 'company']), getCropDetails);
router.put('/:id/progress', protect(['farmer']), updateCropProgress);

export default router;
