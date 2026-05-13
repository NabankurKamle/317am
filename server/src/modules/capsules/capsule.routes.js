import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createCapsuleSchema, updateCapsuleSchema } from './capsule.validation.js';
import {
    getCapsules, createCapsule, getCapsule,
    updateCapsule, deleteCapsule, getUpcoming,
} from './capsule.controller.js';

const router = Router();
router.use(protect);

router.get('/', getCapsules);
router.get('/upcoming', getUpcoming);
router.get('/:id', getCapsule);
router.post('/', validate(createCapsuleSchema), createCapsule);
router.put('/:id', validate(updateCapsuleSchema), updateCapsule);
router.delete('/:id', deleteCapsule);

export default router;