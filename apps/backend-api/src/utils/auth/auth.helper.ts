import crypto from 'crypto';
import redis from '../../../../../packages/libs/redis';
import { sendEmail } from '../sendEmail';
import { NextFunction, Request, Response } from 'express';
import prisma from "../../../../../packages/libs/prisma";
import { ValidationError } from '../../../../../packages/error-handle';


export const checkOtpRestrictions = async (email: string) => {

    const emailLock = await redis.get(`otp_lock:${email}`);
    const emailSpamLock = await redis.get(`otp_spam_lock:${email}`);
    const emailCoolDown = await redis.get(`otp_cooldown:${email}`);

    if (emailLock) {
        throw new ValidationError("Conta bloqueada por tentativas inválidas. Tente novamente mais tarde.");
    }

    if (emailSpamLock) {
        throw new ValidationError("Múltiplas requisições efetuadas!");
    }

    if (emailCoolDown) {
        throw new ValidationError("Aguarde um tempo antes de solicitar um novo código OTP.");
    }

}

export const trackOtpRequests = async (email: string) => {

    const otpRequestKey = await redis.get(`otp_request_count:${email}`) || "0";
    const otpRequests = parseInt(otpRequestKey);

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
        throw new ValidationError("Múltiplas requisições efetuadas!");
    }

    await redis.set(`otp_request_count:${email}`, otpRequests + 1, "EX", 3600);

};

export const sendOtp = async (
    name: string,
    email: string,
    template: string,
) => {

    const smtpEmail = process.env.SMTP_USER || 'icaroip15@gmail.com';

    const otp = crypto.randomInt(1000, 9999).toString();
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
    await sendEmail(email, "Verifique seu E-mail!", template, { name, otp, smtpEmail });
};

export const verifyOtp = async (
    email: string,
    otp: string
) => {

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw new ValidationError("Código OTP inválido ou expirado!");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const otpAttempts = await redis.get(failedAttemptsKey);
    const failedAttempts = parseInt(otpAttempts || "0");

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError("Conta bloqueada por tentativas inválidas. Tente novamente mais tarde.");
        }

        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        throw new ValidationError(
            "Código OTP inválido. " + `${2 - failedAttempts} tentativas restantes!`
        );
    }

    await redis.del(`otp:${email}`, failedAttemptsKey);

};

export const handleForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
    userType: "user" | "driver"
) => {
    try {
        const { email } = req.body;

        if (!email) throw new ValidationError("Email é Obrigatório!");

        let user: any = null;

        if (userType === "driver") {
            user = await prisma.driver.findFirst({ where: { email } });
        }

        if (userType === "user") {
            user = await prisma.user.findFirst({ where: { email } });
        }

        if (!user) {
            throw new ValidationError(`${userType === "driver" ? "Motorista" : "Usuário"} não encontrado com este Email!`);
        }

        //restrições OTP
        await checkOtpRestrictions(email);
        await trackOtpRequests(email);

        //Gerando OTP e envio de Email
        await sendOtp(user.name, email, "forgot-password-user-email");

        res.status(200).json({
            success: true,
            message: "Código OTP enviado ao Email informado!"
        });

    } catch (error) {
        return next(error);
    }
}



export const verifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(new ValidationError("Email e OTP são obrigatórios!"));
        }

        await verifyOtp(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP verificado. Agora você pode alterar sua senha!'
        });

    } catch (error) {
        return next(error);
    }
}