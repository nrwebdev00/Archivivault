import { prisma } from "../../config/db/prisma.ts";
import { customError } from "../../utils/customError.ts";

const confirmEmail = async(token : string) =>{
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
            email_confirmation_expires: null
        },
    });

    const data = {
        note: 'Email Address has been confirmed.'
    }
   
    return data;
}

export { confirmEmail }