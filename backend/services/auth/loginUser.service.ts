import { publicLoggedInUser } from './publicLoggedInUser.service.ts';

type LoginInput = {
    email : string,
    password : string,
}

const loginUser = async({email, password} : LoginInput) => {
    const publicUser = await publicLoggedInUser(email, password);

    const data = {
        user : publicUser,
    }
    return data;
};

export { loginUser }