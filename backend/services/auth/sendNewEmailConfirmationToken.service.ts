import { verifyIfInputIsAnEmailAddress } from './utils/email.utils.ts';
import { EmailConfirmation } from './authServices/EmailConfirmation.service.ts';
import { prisma } from '../../config/db/prisma.ts';


const createAndSendNewEmailToken = async(email : string) =>{
    // Will throw Error if Email not Valid
    const isEmail = verifyIfInputIsAnEmailAddress(email);
    const user = await prisma.user.findUnique({
        where : {email}
    })

    // Not throw Error if not found --> return same message if user or !user
    if(user && isEmail){
        // Creates Token and Send out email with URL
        console.log("Dev Message: Email to be sent at this point.")
        //await EmailConfirmation(user.id, user.email, user.tenant_id, user.name);
    }

    const data = {
        note:'If Email address is in system an email Will be sent to email provided.'
    }

    return data;
}

export { createAndSendNewEmailToken }