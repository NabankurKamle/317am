import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createFragmentSchema, updateFragmentSchema } from './fragment.validation.js';
import { getFragments, createFragment, deleteFragment, updateFragment } from './fragment.controller.js';

const router = Router();
router.use(protect);

router.get('/', getFragments);
router.post('/', validate(createFragmentSchema), createFragment);
router.put('/:id', validate(updateFragmentSchema), updateFragment);
router.delete('/:id', deleteFragment);

export default router;