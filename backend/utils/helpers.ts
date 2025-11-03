import asyncHandler from 'express-async-handler';
import { prisma } from '../db/prisma.ts';
import jwt from 'jsonwebtoken';

const normalizeEmail = (email: string ) =>{
    return email.trim().toLowerCase();
};

const isEmailInUse = async (email: string): Promise<boolean> =>{
    const isEmail = await prisma.user.findUnique({
        where: { email }
    });

    return !!isEmail;
}

const createToken = (id: string, roles: string[], tenant_id: string)=>{
    const token = jwt.sign(
        {user_id: id, user_role: roles, tenant_id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY}
    );
    return token;
};


export {  normalizeEmail, isEmailInUse, createToken }