import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../db/prisma.ts';


import { 
    normalizeEmail, 
    isEmailInUse, 
    createToken
} from '../../utils/helpers.ts';

// @desc create user - Register
// @route POST /api/auth/register
// @access PUBLIC
const register = asyncHandler(async (req, res) =>{
    const { email, name, password} = req.body;

    // Check for user
    const emailNormalize = normalizeEmail(email);
    if(await isEmailInUse(emailNormalize)){
        res.status(400).json({ msg:"error", error:'Email is already in use'});
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Add user to DB
    const user = await prisma.user.create({
        data:{
            email: emailNormalize,
            name,
            password_hash: hashedPassword,
            tenant_id: uuidv4(),
        },
    });
    

    // Check if user.id and user.tenant_id == update tenant_id if so
    if(user.id == user.tenant_id){
        await prisma.user.update({
            where:{ tenant_id: uuidv4()},
            data:{ is_verified: true}
        }); 
    }

    // TODO Create Blank Profile
    // Create Blank Profile for User

    // Login user 
    const token = createToken(user.id, user.roles, user.tenant_id);

    // data to send
    const data = {
        user:{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'tenant_id': user.tenant_id,
            'roles': user.roles,
        },
        token,
    }

    // Send res back 
    res.status(200).json({msg: 'success', data,})
});

// @desc Auth user - Login
// @route POST /api/auth/login
// @access PUBLIC
const login = asyncHandler(async (req, res) =>{
    const { email, password } = req.body;

    // Get User
    const emailNormalize = normalizeEmail(email);
    const user = await prisma.user.findUnique({ where: {email:emailNormalize}});
    if(!user){
        res.status(401).json({ msg:"error", error: 'Invalid Email or Password.'});
        return;
    }

    // Check if Password is a Match
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if(!isPasswordMatch){
        res.status(401).json({msg:"error", error: 'Invalid Email or Password.' });
        return;
    }

    // Assign JWToken
    const token = createToken(user.id, user.roles, user.tenant_id);
    
    // data to send back to front end
    const data = {
        user:{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'tenant_id': user.tenant_id,
            'roles': user.roles,
        },
        token
    }


    // Send res back
    res.status(200).json({msg: 'success', data });
});

// @desc get user - User Info
// @route GET /api/auth/user
// @access PRIVATE - login must be user

// @desc Confirm user Registration -Confirm Registration
// @route POST /api/auth/confirmRegistration/:key
// @access PRIVATE - Login

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

export { register, login }