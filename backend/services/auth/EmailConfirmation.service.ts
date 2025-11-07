import { prisma } from '../../config/db/prisma.ts';

import { createEmailConfirmation } from './utils/createTokens.utils.ts';
import { transporter } from './utils/mailer.utils.ts'

const EmailConfirmation = async(id : string, email : string, tenant_id : string, name : string) =>{
    // Create Token(email) and update DB
    const emailToken = createEmailConfirmation(id, email, tenant_id);
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 *60 *1000);

    await prisma.user.update({
        where: { id },
        data: {
            email_confirmation_token: emailToken,
            email_confirmation_expires: tokenExpiresAt
        }
    });

    // Config and Send Email out User
    const confirmUrl=`${process.env.API_DOMAIN}auth/confirm-email?token${emailToken}`;
    await transporter.sendMail({
        from: '"Archivivault" archivivault@gmail.com',
        to: email,
        subject: `Welcome ${name}, to Archivivault Please Confirm Email.`,
        html: `
            <h2>Welcome to Archivivault!</h2>
            <p>Click the link below to confirm your email:</p>
            <a href="${confirmUrl}">Confirm Email</a>
        `,
    });
};

export { EmailConfirmation }