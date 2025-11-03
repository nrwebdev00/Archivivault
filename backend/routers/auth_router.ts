import { Router } from 'express';

import { register, login } from '../controllers/auth/auth_controller.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;