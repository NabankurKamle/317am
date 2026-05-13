import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { logMood, getMoodHistory, getMoodStats } from './atmosphere.controller.js';

const router = Router();
router.use(protect);

router.get('/', getMoodHistory);
router.get('/stats', getMoodStats);    // ← new
router.post('/', logMood);

export default router;