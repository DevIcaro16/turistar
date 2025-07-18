import { ValidationError, AuthError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";
import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../../utils/cookies/setCookie";

interface UserRegistrationProps {
    name: string;
    email: string;
    phone: string;
    password: string;
};

interface UserUpdateProps {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
    static async registerUser(data: UserRegistrationProps) {
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
                role: 'user'
            },
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    static async updateUser(userId: string, data: UserUpdateProps) {
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundError("Usuário não encontrado!");
        }

        // Se email está sendo atualizado, verificar se já existe
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (emailExists) {
                throw new ValidationError("Email já está em uso!");
            }

            if (!emailRegex.test(data.email)) {
                throw new ValidationError("Formato inválido de Email!");
            }
        }

        // Preparar dados para atualização
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;

        // Se senha está sendo atualizada, fazer hash
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                wallet: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updatedUser;
    }

    static async deleteUser(userId: string) {
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundError("Usuário não encontrado!");
        }

        // Deletar o usuário
        await prisma.user.delete({
            where: { id: userId }
        });

        return { message: "Usuário deletado com sucesso!" };
    }

    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                wallet: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new NotFoundError("Usuário não encontrado!");
        }

        return user;
    }

    static async resetPassword(email: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AuthError("Usuário não existente!");
        }

        //Verificando se a nova senha não é igual a antiga
        const isSamePassword = await bcrypt.compare(newPassword, user.password!);

        if (isSamePassword) {
            throw new AuthError("Nova senha não pode ser igual a antiga!");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        });

        return true;
    }

    static async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new ValidationError("Usuário não encontrado!");
        }

        // Aqui você implementaria a lógica de envio de email
        // Por exemplo: await EmailService.sendPasswordResetEmail(email);

        return true;
    }


    static async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
            if (payload.role !== 'user') throw new AuthError("Token inválido!");

            // Gere um novo access token
            const accessToken = jwt.sign(
                { id: payload.id, role: 'user' },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" }
            );

            // Gere um novo refresh token (opcional, mas recomendado)
            const newRefreshToken = jwt.sign(
                { id: payload.id, role: 'user' },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: "7d" }
            );

            return { access_token: accessToken, refresh_token: newRefreshToken };
        } catch (err) {
            throw new AuthError("Refresh token inválido ou expirado!");
        }
    }
}
