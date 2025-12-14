// server/routes/requirementRoutes.js
import express from 'express';
import { postRequirement, getCompanyRequirements, getRequirementDetails } from '../controllers/requirementController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect(['company']), postRequirement);
router.get('/company', protect(['company']), getCompanyRequirements);
router.get('/:id', protect(['company', 'farmer']), getRequirementDetails);

export default router;
