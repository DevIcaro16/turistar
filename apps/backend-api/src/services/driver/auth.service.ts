import { ValidationError, AuthError, NotFoundError } from '../../../../../packages/error-handle';
import { NextFunction, Request, Response } from 'express';
import prisma from "../../../../../packages/libs/prisma";
import { TransportType } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../../utils/cookies/setCookie";

interface DriverRegistrationProps {
    name: string;
    email: string;
    phone: string;
    transportType: TransportType;
    password: string;
};

interface DriverUpdateProps {
    name?: string;
    email?: string;
    phone?: string;
    transportType?: TransportType;
    password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {

    static async register(data: DriverRegistrationProps) {

        const { name, email, phone, transportType, password } = data;

        if (!name || !email || !password) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        if (!emailRegex.test(email)) {
            throw new ValidationError("Formato inválido de Email!");
        }

        // Validando o objid do mongo
        if (!Object.values(TransportType).includes(transportType as TransportType)) {
            throw new ValidationError("Tipo de transporte inválido!");
        }

        await this.checkEmail(email);

        const hashedPassword = await bcrypt.hash(password, 10);

        const driver = await prisma.driver.create({
            data: {
                name,
                email,
                phone: phone,
                transport_type: transportType.toUpperCase() as TransportType,
                password: hashedPassword,
                wallet: 0.0
            }
        });

        return driver;
    }

    static async checkEmail(email: string) {
        const existing = await prisma.driver.findUnique({ where: { email } });

        if (existing) {
            throw new ValidationError("Usuário já existente!");
        }

        return true;
    }

    static async login(email: string, password: string, res: Response) {

        const driver = await prisma.driver.findUnique({ where: { email } });

        if (!driver) {
            throw new AuthError("Motorista não encontrado!");
        }

        //Verificando o hash da senha criptografada
        const isMatch = await bcrypt.compare(password, driver.password!);

        if (!isMatch) {
            throw new AuthError("Senha inválida!");
        }

        //Gerando access token e refresh token
        const accessToken = jwt.sign(
            {
                id: driver.id,
                role: "driver"
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: driver.id,
                role: "driver"
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
            driver: {
                id: driver.id,
                email: driver.email,
                name: driver.name,
            }
        };
    }

    static async updateDriver(driverId: string, data: DriverUpdateProps) {
        // Verificar se o motorista existe
        const existingDriver = await prisma.driver.findUnique({
            where: { id: driverId }
        });

        if (!existingDriver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        // Se email está sendo atualizado, verificar se já existe
        if (data.email && data.email !== existingDriver.email) {
            const emailExists = await prisma.driver.findUnique({
                where: { email: data.email }
            });

            if (emailExists) {
                throw new ValidationError("Email já está em uso!");
            }

            if (!emailRegex.test(data.email)) {
                throw new ValidationError("Formato inválido de Email!");
            }
        }

        // Validar tipo de transporte se fornecido
        if (data.transportType && !Object.values(TransportType).includes(data.transportType)) {
            throw new ValidationError("Tipo de transporte inválido!");
        }

        // Preparar dados para atualização
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;
        if (data.transportType) updateData.transport_type = data.transportType.toUpperCase();

        // Se senha está sendo atualizada, fazer hash
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const updatedDriver = await prisma.driver.update({
            where: { id: driverId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                transport_type: true,
                wallet: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updatedDriver;
    }

    static async deleteDriver(driverId: string) {
        // Verificar se o motorista existe
        const existingDriver = await prisma.driver.findUnique({
            where: { id: driverId }
        });

        if (!existingDriver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        // Deletar o motorista
        await prisma.driver.delete({
            where: { id: driverId }
        });

        return { message: "Motorista deletado com sucesso!" };
    }

    static async getDriverById(driverId: string) {
        const driver = await prisma.driver.findUnique({
            where: { id: driverId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                transport_type: true,
                wallet: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!driver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        return driver;
    }
}