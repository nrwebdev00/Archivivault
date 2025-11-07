import bcrypt from 'bcryptjs';
 
import { prisma } from '../../config/db/prisma.ts';
import { catchAsync } from '../../utils/catchAsync.ts';
import { customError } from '../../utils/customError.ts';
import { registerUser } from '../../services/auth/registerUser.service.ts';
import { loginUser } from '../../services/auth/loginUser.service.ts';

import { 
    normalizeEmail, 
    createLoginToken,
} from '../../utils/helpers.ts';

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
// @access PUBLIC - Login
const confirmEmailRegistration = catchAsync(async (req, res, next) =>{
    const rawToken = req.query.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

    if(!token || typeof(token) != 'string'){
        throw new customError('Missing or Invalid Token', 400);
    }

    // Find user by token given
    const user = await prisma.user.findFirst({
        where: {
            email_confirmation_token : token,
        }
    });

    // return if now user by token and send error
    if(!user){
        throw new customError('Token is invalid or expired', 400);
    }

    // Update Database
    await prisma.user.update({
        where: { id: user.id},
        data:{
            email_confirmed: true,
            email_confirmation_token: null,
            email_confirmation_expires: null,
        },
    });

    res.status(200).json({ msg:'success',});
    return;
});

// @desc update User password - Change Password
// @route PUT /api/auth/password
// @access PRIVATE - Login

// @desc forgot password request 
// @route POST /api/auth/passwordRequest
// @access PUBLIC 

// @desc forgot password Change
// @route POST /api/auth/passwordForgot/:key
// @access PUBLIC --> redirect to Login 

// Oauth Setup

// Oauth integration 

export { register, login, getUser, confirmEmailRegistration }