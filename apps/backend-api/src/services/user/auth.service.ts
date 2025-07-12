import { ValidationError, AuthError } from '../../../../../packages/error-handle';
import { NextFunction, Request, Response } from 'express';
import prisma from "../../../../../packages/libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../../utils/cookies/setCookie";

interface UserRegistrationProps {
    name: string;
    email: string;
    phone: string;
    password: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {

    static async register(data: UserRegistrationProps) {

        const { name, email, phone, password } = data;

        if (!name || !email || !password) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        if (!emailRegex.test(email)) {
            throw new ValidationError("Formato inválido de Email!");
        }

        await this.checkEmail(email);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone,
                password: hashedPassword,
                wallet: 0.0
            }
        });

        return user;
    }

    static async checkEmail(email: string) {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            throw new ValidationError("Usuário já existente!");
        }

        return true;
    }

    static async loginUser(email: string, password: string, res: Response) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AuthError("Usuário não encontrado!");
        }

        //Verificando o hash da senha criptografada
        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            throw new AuthError("Senha inválida!");
        }

        //Gerando access token e refresh token
        const accessToken = jwt.sign(
            {
                id: user.id,
                role: "user"
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                role: "user"
            },
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        //Gravando o refresh token e o access token em cookies (httpOnly secure)
        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        };
    }

}