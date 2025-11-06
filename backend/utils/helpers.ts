<<<<<<< HEAD
import { prisma } from '../db/prisma.ts';
=======
import asyncHandler from 'express-async-handler';
import { prisma } from '../config/db/prisma.ts';
>>>>>>> e411a5444a52b3100fe2190af1904c65f9e86bc3
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/auth.ts';


const normalizeEmail = (email: string ) =>{
    return email.trim().toLowerCase();
};

const isEmailInUse = async (email: string): Promise<boolean> =>{
    const isEmail = await prisma.user.findUnique({
        where: { email }
    });

    return !!isEmail;
}

const createLoginToken = (id: string, roles: string[], tenant_id: string)=>{
    const payload = {
    purpose: 'login_token',
    user_id: id,
    user_role: roles,
    tenant_id,
   }
    
    const token = jwt.sign(
        payload, 
        JWT_SECRET, {expiresIn: '7d'});
    return token;
};

const createEmailConfirmToken = (id: string, email: string, tenant_id: string)=>{
    const payload = {
        purpose: 'email_confirm',
        user_id: id,
        email,
        tenant_id
    }

    const token = jwt.sign(
        payload, 
        JWT_SECRET, {expiresIn: '1d'});
    return token;
}


export {  normalizeEmail, isEmailInUse, createLoginToken, createEmailConfirmToken }