import { Router } from 'express';

import { customError } from '../utils/customError.ts';
import { requireAuth } from '../middleware/auth_middleware/auth.middleware.ts';
import { authorizationRoleCheck } from "../middleware/auth_middleware/roles.middleware.ts";
import { 
    register, 
    login, 
    getUser, 
    changePassword,
    confirmEmailRegistrationVerifiedToken,
    SendNewEmailToken,
    requestPasswordReset,
    resetPasswordByToken,
    resetPasswordVerifiedToken,
} from '../controllers/auth/auth_controller.ts';

const router = Router();

// POST 
router.post('/register', register);
router.post('/login', login);
router.post('/new-email-token', SendNewEmailToken);
router.post('/request-password-reset', requestPasswordReset);

// GET
router.get('/confirm-email', confirmEmailRegistrationVerifiedToken);
router.get('/resetPassword', resetPasswordVerifiedToken);

// PUT
router.put('/resetPassword', resetPasswordByToken);
router.put('/changePassword', requireAuth, changePassword);

// Dev use
router.get('/', requireAuth, authorizationRoleCheck('user'), getUser); // DEV use to make sure middleware is working
router.get('/fail', (req, res) =>{
    throw new customError('Manual failure test', 418);
})

export default router;