import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../../config/auth.ts';
import { customError } from '../../../utils/customError.ts';

// Create Email Confirmation Token & Asigned to DB
const createEmailConfirmation =(id: string, email: string, tenant_id: string) =>{
    if(!JWT_SECRET) throw new customError('JWT_SECRET is not defined', 401);
    
    const payload = {
        purpose: 'email_confirm',
        user_id: id,
        email,
        tenant_id,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID()
    };

    const token = jwt.sign(
        payload,
        JWT_SECRET, 
        {expiresIn: '1d'},
    );
    return token;
}

// Create Log in Token for auth
const createLoginToken = (id : string, roles : string[], tenant_id : string) => {
    if(!JWT_SECRET) throw new customError('JWT_SECRET is not defined', 401);
    
    const payload ={
        purpose: 'login_token',
        user_id: id,
        user_roles: roles,
        tenant_id,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID()
    }

    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: '7d'},
    );
    return token;
};

const createForgotPasswordToken = (id: string, email: string, tenant_id : string) =>{
    const payload = {
        purpose : 'forgot_password',
        user_id : id,
        email,
        tenant_id,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID()
    }

    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: '30m' },
    );
    return token
};

export { createEmailConfirmation, createLoginToken, createForgotPasswordToken }