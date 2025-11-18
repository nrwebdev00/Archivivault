import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../config/auth.ts';
import { catchAsync } from '../../utils/catchAsync.ts';
import { prisma } from '../../config/db/prisma.ts';
import { customError } from '../../utils/customError.ts';
import { hashPassword } from './utils/auth.utils.ts';

const resetPasswordWithToken = (async (token: string, newPassword: string) => {

    const user = await prisma.user.findFirst({ 
        where: { password_reset_token: token }
    });

    const decoded = await jwt.verify(token, JWT_SECRET);
    
    if(!user || !decoded){
        throw new customError('Invalid or expired token', 400);
    }

    if(!newPassword || typeof newPassword !== 'string' || newPassword.length < 8){
        throw new customError('Password must be at least 8 characters', 400);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password_hash : await hashPassword(newPassword),
            password_reset_token: null,
            password_reset_expires: null,
            updated_at: new Date(),
        },
    });

    const data = { msg: 'Password updated successfully --> Forward top Login' };

    return data;
});

const changePasswordService = (async(password: string, user : any ) => {
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            password_hash : await hashPassword(password),
            updated_at: new Date(),
        },
    });

    if(!updatedUser){
        throw new customError('Error updating password', 500);
    }
    
    const data = { updatedUser}

    return data;
})

export { resetPasswordWithToken, changePasswordService };