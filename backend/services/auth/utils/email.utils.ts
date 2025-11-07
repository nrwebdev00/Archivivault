import { prisma } from "../../../config/db/prisma.ts";
import { customError } from "../../../utils/customError.ts";

const normalizeEmail = (email : string ) =>{
    return email.trim().toLowerCase();
};

const checkIfEmailInUse = async(email: string ): Promise<boolean> =>{
    const isEmail = await prisma.user.findUnique({
        where: { email }
    })
    if(!!isEmail){
        throw new customError('Email is already in use', 400);
    }
    return !!isEmail;
}


export { normalizeEmail, checkIfEmailInUse }