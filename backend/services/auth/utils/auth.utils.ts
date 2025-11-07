import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> =>{
    return bcrypt.hash(password, 12);
};

export { hashPassword };