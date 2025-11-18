import { prisma } from "../../config/db/prisma.ts";
import { customError } from "../../utils/customError.ts";

const confirmEmailTokenRegistration = async(token : string) =>{
    // Get User by Token
    const user = await prisma.user.findFirst({
        where:{
            email_confirmation_token : token
        }
    })
    if(!user){
        throw new customError('Invalid or Expired Token', 400);
    }

    // Update DB
    await prisma.user.update({
        where: {id: user.id},
        data:{
            email_confirmed: true,
            email_confirmation_token: null,
            email_confirmation_expires: null,
            email_confirmed_at: new Date(),
        },
    });

    const data = {
        note: 'Email Address has been confirmed.'
    }
   
    return data;
}

const confirmEmailTokenReset = async(token : string) =>{
    // Get User By token
    const user = await prisma.user.findFirst({
        where:{
            password_reset_token : token
        }
    });
    if(!user || user.password_reset_expires!.getTime() < Date.now()){
        throw new customError('Invalid or Expired Token', 400);
    }

    const data = {
        note : 'Token Verified - Proceed to reset password.'
    }

    return data;
};



export { confirmEmailTokenRegistration, confirmEmailTokenReset }