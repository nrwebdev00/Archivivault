import { Router } from 'express';

import { requireAuth } from '../middleware/auth_middleware/auth.middleware.ts';
import { authorizationRoleCheck } from "../middleware/auth_middleware/roles.middleware.ts";
import { 
    register, 
    login, 
    getUser, 
    confirmEmailRegistration 
} from '../controllers/auth/auth_controller.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/confirm-email', confirmEmailRegistration);
router.get('/', requireAuth, authorizationRoleCheck('user'), getUser); // DEV use to make sure middleware is working

export default router;