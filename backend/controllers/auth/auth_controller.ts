import { catchAsync } from '../../utils/catchAsync.ts';
import { customError } from '../../utils/customError.ts';
import { registerUser } from '../../services/auth/registerUser.service.ts';
import { loginUser } from '../../services/auth/loginUser.service.ts';
import { confirmEmailTokenRegistration, confirmEmailTokenReset } from '../../services/auth/emailConfirmation.service.ts';
import { createAndSendNewEmailToken, requestPasswordResetService } from '../../services/auth/sendTokenRequest.service.ts';
import { resetPasswordWithToken, changePasswordService } from '../../services/auth/resetPassword.serivce.ts';

import { prisma } from '../../config/db/prisma.ts';

// @desc create user - Register
// @route POST /api/auth/register
// @access PUBLIC
const register = catchAsync(async (req, res, next) =>{
    const data = await registerUser(req.body);
    res.status(200).json({msg: 'success', data,})
});

// @desc Auth user - Login
// @route POST /api/auth/login
// @access PUBLIC
const login = catchAsync(async (req, res, next) =>{
    const data = await loginUser(req.body);
    res.status(200).json({msg:'success', data});
});

// This Route is Dev only to check authentication and authorizations
// @desc get user - User Info
// @route GET /api/auth/user
// @access PRIVATE - login must be user
const getUser = catchAsync(async (req, res, next) =>{
    const user = await prisma.user.findUnique({
        where: { id: req.user?.user_id },
        select:{
            id: true,
            name: true,
            email: true,
            roles: true,
            tenant_id: true,
            is_active: true,
            email_confirmed: true,
            created_at: true,
            updated_at: true,
        }
    });
    if(!user){
        throw new customError('user not found.', 404);
    }

    res.status(200).json({ msg:"success", user})
});

// @desc Confirm user Registration -Confirm Registration
// @route GET /api/auth/confirmRegistration/:token
// @access PUBLIC 
const confirmEmailRegistrationVerifiedToken = catchAsync(async (req, res, next) =>{
    const rawToken = req.query.token
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    if(!token || typeof(token) != 'string'){
        throw new customError('Missing or Invalid Token', 400);
    }

    const data = await confirmEmailTokenRegistration(token);

    res.status(200).json({ msg:'success', data })
});

// @desc Send new Email Confirmation Token - by email
// @route POST /api/auth/newEmailToken
// @access PUBLIC 
const SendNewEmailToken = catchAsync(async (req, res, next) =>{
    const { email } = req.body
    const data = await createAndSendNewEmailToken(email)

    res.status(200).json({msg:'success', data});
});

// @desc forgot password request 
// @route POST /api/auth/passwordRequest
// @access PUBLIC 
const requestPasswordReset = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const data = await requestPasswordResetService(email);

    res.status(200).json({ msg: 'success', data });

});

// @desc reset password via token
// @route GET /api/auth/request-password-reset/token
// @access PUBLIC --> redirect to Login
const resetPasswordVerifiedToken = catchAsync(async (req, res, next) => {
    const rawToken = req.query.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    if (!token || typeof token !== 'string') {
        throw new customError('Missing or Invalid Token', 400);
    }

    const data = await confirmEmailTokenReset(token);
    res.status(200).json({ msg: 'success', data });
});

// @desc update Password by Token Reset
// @route PUT /api/auth/resetPassword
// @access PRIVATE - By Verified Token
const resetPasswordByToken = catchAsync(async (req, res, next) => {
    const { token, newPassword } = req.body;

    const data = await resetPasswordWithToken(token, newPassword);
    res.status(200).json({ msg: 'success', data });
});

// @desc update User password - Change Password
// @route PUT /api/auth/password
// @access PRIVATE - Login
const changePassword = catchAsync(async (req, res, next) => {
    
    const data = await changePasswordService(req.body.password, req.user);

    res.status(200).json({ msg: 'success', data });
});

// Oauth Setup

// Oauth integration 

export { 
    register, 
    login, 
    getUser, 
    confirmEmailRegistrationVerifiedToken, 
    SendNewEmailToken, 
    requestPasswordReset, 
    resetPasswordByToken,
    resetPasswordVerifiedToken, 
    changePassword
}