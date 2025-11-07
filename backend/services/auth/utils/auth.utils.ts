import bcrypt from 'bcryptjs';

import { prisma } from '../../../config/db/prisma.ts';
import { customError } from '../../../utils/customError.ts';

// hash password
const hashPassword = async (password: string): Promise<string> =>{
    return bcrypt.hash(password, 12);
};

// Get User for Auth
const getUserAuth = async(email: string) =>{
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if(!user){
        throw new customError('Invalid user or password combination', 403);
    }

    return user;
}

// Compare Password
const comparePassword = async(password : string, hashedPassword : string) : Promise<Boolean> =>{
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if(!isMatch){
        throw new customError('Invalid user or password combination', 403);
    }
    return isMatch;
}

export { hashPassword, getUserAuth, comparePassword };