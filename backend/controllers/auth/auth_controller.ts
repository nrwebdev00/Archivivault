import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../db/prisma.ts';


import { transporter } from '../../utils/mailer.ts';
import { 
    normalizeEmail, 
    isEmailInUse, 
    createLoginToken,
    createEmailConfirmToken
} from '../../utils/helpers.ts';
import { raw } from '@prisma/client/runtime/library';

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

    // Error Check Make sure user is created
    if(!user){
        res.status(400).json({ msg:'error', error:"Unable to create a user."});
        return;
    }

    // Check if user.id and user.tenant_id == update tenant_id if so
    if(user.id == user.tenant_id){
        await prisma.user.update({
            where:{ id: user.id},
            data:{ tenant_id: uuidv4()}
        }); 
    }

    // Create Email Confirmation Token and Send Email
    const emailToken = createEmailConfirmToken(user.id, user.email, user.tenant_id);
    const tokenExpiresAt = new Date(Date.now() + 24 *60 *60 *1000);
    await prisma.user.update({
        where:{ id: user.id},
        data: { email_confirmation_token: emailToken, email_confirmation_expires: tokenExpiresAt }
    });

    // Send Email
    // /api/auth/confirmRegistration/:key
    const confirmUrl=`http://localhost:5500/api/auth/confirm-email?token=${emailToken}`
    await transporter.sendMail({
        from: '"Archivivault" archivivault@gmail.com',
        to: user.email,
        subject: `Welcome ${user.name}, to Archivivault Please Confirm Email.`,
        html: `
            <h2>Welcome to Archivivault!</h2>
            <p>Click the link below to confirm your email:</p>
            <a href="${confirmUrl}">Confirm Email</a>
        `,


    })
    // TODO Create Blank Profile
    // Create Blank Profile for User

    // Login user 
    const token = createLoginToken(user.id, user.roles, user.tenant_id);

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

    // Check if user is Active or not
    if(!user.is_active){
        res.status(403).json({msg:'error', error:'Access Denied: Account in In Active'});
        return;
    }

    if(!user.email_confirmed){
        res.status(403).json({msg:'error', error:'Email Address is not Confirmed, please Confirm before logging in.'});
        return;
    }

    // Assign JWToken
    const token = createLoginToken(user.id, user.roles, user.tenant_id);
    if(token == "NO_TOKEN"){
        res.status(401).json({ msg:"error", error:'Invalid Token'});
        return;
    }

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
const getUser = asyncHandler(async (req, res) =>{
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
        res.status(404).json({ msg:'error', error:'user not found.'});
        return;
    }
    console.log(`User: ${user}`);

    res.status(200).json({ msg:"success", user})
});

// @desc Confirm user Registration -Confirm Registration
// @route GET /api/auth/confirmRegistration/:token
// @access PUBLIC - Login
const confirmEmailRegistration = asyncHandler(async (req, res) =>{
    const rawToken = req.query.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

    if(!token || typeof(token) != 'string'){
        res.status(400).json({ msg:'error', error:'Missing or Invalid token.'});
        return;
    }

    // Find user by token given
    const user = await prisma.user.findFirst({
        where: {
            email_confirmation_token : token,
        }
    });

    // return if now user by token and send error
    if(!user){
        res.status(400).json({ msg:'error', error:'Token is invalid or expired'});
        return;
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