import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { getProfile, updateProfile, updateMood, deleteAccount } from './user.controller.js';

const router = Router();
router.use(protect);   // All user routes require auth

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/mood', updateMood);
router.delete('/account', deleteAccount);

export default router;