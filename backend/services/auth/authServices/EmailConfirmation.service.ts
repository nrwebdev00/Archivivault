import { prisma } from '../../../config/db/prisma.ts';

import { createEmailConfirmation, createForgotPasswordToken } from '../utils/createTokens.utils.ts';
import { transporter } from '../utils/mailer.utils.ts'

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
    const confirmUrl=`${process.env.API_DOMAIN}auth/confirm-email?token=${emailToken}`;
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

const ForgotPasswordReset = async(id :string, email : string, tenant_id : string, name : string) =>{
    const forgotPasswordToken = createForgotPasswordToken(id, email, tenant_id);
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 30);

    await prisma.user.update({
        where: { id },
        data: {
            password_reset_token: forgotPasswordToken,
            password_reset_expires: tokenExpiresAt
        }
    });

    const resetPasswordUrl = `${process.env.API_DOMAIN}auth/resetPassword?token=${forgotPasswordToken}`;
    await transporter.sendMail({
        from: '"Archivivault" archivivault@gmail.com',
        to: email,
        subject: `Sent Password Reset for Archivivault.`,
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below To Reset Your Password</p>
            <a href="${resetPasswordUrl}">Confirm Email</a>
        `,
    });
};

export { EmailConfirmation, ForgotPasswordReset }