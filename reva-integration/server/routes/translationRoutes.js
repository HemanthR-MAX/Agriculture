// server/routes/translationRoutes.js
import express from 'express';
import { translate, batchTranslate } from '../controllers/translationController.js';

const router = express.Router();

router.post('/', translate);
router.post('/batch', batchTranslate);

export default router;
