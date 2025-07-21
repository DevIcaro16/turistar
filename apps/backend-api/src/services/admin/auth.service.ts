import { ValidationError, AuthError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";
import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../../utils/cookies/setCookie";

interface AdminRegistrationProps {
    name: string;
    email: string;
    phone: string;
    password: string;
    image?: string;
};

interface AdminUpdateProps {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    image?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
    static async registerAdmin(data: AdminRegistrationProps) {
        const { name, email, phone, password, image } = data;
        if (!name || !email || !password) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }
        if (!emailRegex.test(email)) {
            throw new ValidationError("Formato inválido de Email!");
        }
        await this.checkEmail(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                phone: phone,
                password: hashedPassword,
                ...(image && { image })
            }
        });
        return admin;
    }

    static async checkEmail(email: string) {
        const existing = await prisma.admin.findUnique({ where: { email } });
        if (existing) {
            throw new ValidationError("Administrador já existente!");
        }
        return true;
    }

    static async loginAdmin(email: string, password: string, res: Response) {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            throw new AuthError("Usuário não encontrado!");
        }
        const isMatch = await bcrypt.compare(password, admin.password!);
        if (!isMatch) {
            throw new AuthError("Senha inválida!");
        }
        const accessToken = jwt.sign(
            {
                id: admin.id,
                role: "admin"
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "30m",
            }
        );
        const refreshToken = jwt.sign(
            {
                id: admin.id,
                role: "admin"
            },
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: "7d",
            }
        );
        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);
        return {
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                image: admin.image,
                phone: admin.phone,
                role: 'admin'
            },
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    static async updateAdmin(adminId: string, data: AdminUpdateProps) {
        const existingAdmin = await prisma.admin.findUnique({
            where: { id: adminId }
        });
        if (!existingAdmin) {
            throw new NotFoundError("Administrador não encontrado!");
        }
        if (data.email && data.email !== existingAdmin.email) {
            const emailExists = await prisma.admin.findUnique({
                where: { email: data.email }
            });
            if (emailExists) {
                throw new ValidationError("Email já está em uso!");
            }
            if (!emailRegex.test(data.email)) {
                throw new ValidationError("Formato inválido de Email!");
            }
        }
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;
        if (data.image) updateData.image = data.image;
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updatedAdmin = await prisma.admin.update({
            where: { id: adminId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return updatedAdmin;
    }

    static async deleteAdmin(adminId: string) {
        const existingAdmin = await prisma.admin.findUnique({
            where: { id: adminId }
        });
        if (!existingAdmin) {
            throw new NotFoundError("Administrador não encontrado!");
        }
        await prisma.admin.delete({
            where: { id: adminId }
        });
        return { message: "Administrador deletado com sucesso!" };
    }

    static async getAdminById(adminId: string) {
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!admin) {
            throw new NotFoundError("Administrador não encontrado!");
        }
        return admin;
    }

    static async resetPassword(email: string, newPassword: string) {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            throw new AuthError("Administrador não existente!");
        }
        const isSamePassword = await bcrypt.compare(newPassword, admin.password!);
        if (isSamePassword) {
            throw new AuthError("Nova senha não pode ser igual a antiga!");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.admin.update({
            where: { email: email },
            data: { password: hashedPassword }
        });
        return true;
    }

    static async forgotPassword(email: string) {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            throw new ValidationError("Administrador não encontrado!");
        }
        // Aqui você implementaria a lógica de envio de email
        return true;
    }

    static async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
            if (payload.role !== 'admin') throw new AuthError("Token inválido!");
            const accessToken = jwt.sign(
                { id: payload.id, role: 'admin' },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "30m" }
            );
            const newRefreshToken = jwt.sign(
                { id: payload.id, role: 'admin' },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: "7d" }
            );
            return { access_token: accessToken, refresh_token: newRefreshToken };
        } catch (err) {
            throw new AuthError("Refresh token inválido ou expirado!");
        }
    }

    static async logoutAdmin(res: Response) {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        return { message: 'Logout realizado com sucesso!' };
    }
}
