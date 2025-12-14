// server/routes/contractRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getFarmerContracts,
  getCompanyContracts,
  getRequirementContracts,
  getContractDetails,
  confirmContract,
  completeContract
} from '../controllers/contractController.js';

const router = express.Router();

router.get('/farmer', protect(['farmer']), getFarmerContracts);
router.get('/company', protect(['company']), getCompanyContracts);
router.get('/requirement/:requirementId', protect(['company']), getRequirementContracts);
router.get('/:id', protect(['farmer', 'company']), getContractDetails);
router.post('/:id/confirm', protect(['farmer']), confirmContract);
router.post('/:id/complete', protect(['company']), completeContract);

export default router;
