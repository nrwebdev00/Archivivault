import { prisma } from "../../../config/db/prisma.ts";
import { customError } from "../../../utils/customError.ts";

const normalizeEmail = (email : string ) =>{
    return email.trim().toLowerCase();
};

// for Reg
const checkIfEmailInUse = async(email: string ): Promise<boolean> =>{
    const isEmail = await prisma.user.findUnique({
        where: { email }
    })
    if(!!isEmail){
        throw new customError('Email is already in use', 400);
    }
    return !!isEmail;
}

const verifyIfInputIsAnEmailAddress = (email : string) : boolean =>{
    // Only Checking User Input --> Not Validating with DB
    let validEmail = false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email == null || email == ''){
        throw new customError('Please Enter and Email', 400);
    }

    if(emailRegex.test(email)){
        validEmail = true;
    } else {
        throw new customError('Please Enter a valid Email Address: as name@example.com',400);
    }

    return validEmail;
}


export { normalizeEmail, checkIfEmailInUse, verifyIfInputIsAnEmailAddress }