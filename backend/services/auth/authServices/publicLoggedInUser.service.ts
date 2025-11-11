import { customError } from '../../../utils/customError.ts';
import { comparePassword, getUserAuth } from '../utils/auth.utils.ts'
import { createLoginToken } from '../utils/createTokens.utils.ts';

const publicLoggedInUser = async(email : string, password : string) =>{
    const user = await getUserAuth(email);
    await comparePassword(password, user.password_hash);

    // is User Active
    if(!user.is_active){
        throw new customError('Access Denied: User is not Active', 403);
    }
    // is Email Confirmed
    if(!user.email_confirmed){
        throw new customError('Access Denied: Please Confirm Email Address', 403);
    }

    // Token Should be created after Verify User can Log in 
    const token = createLoginToken(user.id, user.roles, user.tenant_id);

    const data = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'tenant_id': user.tenant_id,
        'login_token': token,
    }
    return data;
};

export { publicLoggedInUser };