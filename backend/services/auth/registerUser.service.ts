import { checkIfEmailInUse, normalizeEmail } from './utils/email.utils.ts';
import { hashPassword } from './utils/auth.utils.ts';
import { createUser } from './authServices/createUser.service.ts';
import { EmailConfirmation } from './authServices/EmailConfirmation.service.ts';
import { createLoginToken } from './utils/createTokens.utils.ts';

type RegisterInput = {
    email: string,
    name: string,
    password: string,
};

const registerUser = async ({email,name,password} : RegisterInput ) =>{
    let data;

    // Check if user and normalize email
    const emailNormalized = normalizeEmail(email);
    await checkIfEmailInUse(emailNormalized);

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create User
    const user = await createUser(emailNormalized, name, hashedPassword);

    // Generate Email Confirmation Token and Send Email
    await EmailConfirmation(user.id, emailNormalized, user.tenant_id, name);

    // TODO Create Blank Profile

    // Log in User
    const tokenLogin = createLoginToken(user.id, user.roles, user.tenant_id);

    data = {
        user,
        token: tokenLogin,
    }
    return data;
};

export { registerUser }