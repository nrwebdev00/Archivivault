import { Router } from 'express';

import { customError } from '../utils/customError.ts';
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

// Dev use
router.get('/', requireAuth, authorizationRoleCheck('user'), getUser); // DEV use to make sure middleware is working
router.get('/fail', (req, res) =>{
    throw new customError('Manual failure test', 418);
})

export default router;