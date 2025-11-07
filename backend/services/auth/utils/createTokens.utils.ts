import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../../config/auth.ts';

// Create Email Confirmation Token & Asigned to DB
const createEmailConfirmation =(id: string, email: string, tenant_id: string) =>{
    const payload = {
        purpose: 'email_confirm',
        user_id: id,
        email,
        tenant_id
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
    const payload ={
        purpose: 'login_token',
        user_id: id,
        user_roles: roles,
        tenant_id
    }

    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: '7d'},
    );
    return token;
};

export { createEmailConfirmation, createLoginToken }