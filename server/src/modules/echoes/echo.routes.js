import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { getEchoes, createEcho, deleteEcho } from './echo.controller.js';

const router = Router();
router.use(protect);
router.get('/', getEchoes);
router.post('/', createEcho);
router.delete('/:id', deleteEcho);

export default router;