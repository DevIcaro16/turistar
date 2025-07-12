import { ValidationError, AuthError } from '../../../../../packages/error-handle';
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {

    static async register(data: DriverRegistrationProps) {

        const { name, email, phone, transportType, password } = data;

        if (!name || !email || !phone || !transportType || !password) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        if (!emailRegex.test(email)) {
            throw new ValidationError("Formato inválido de Email!");
        }

        let transportTypeUpper = transportType.toUpperCase() as TransportType;

        if (!Object.values(TransportType).includes(transportTypeUpper)) {
            throw new ValidationError("Tipo de transporte inválido!");
        }

        await this.checkEmail(email);

        const hashedPassword = await bcrypt.hash(password, 10);

        const driver = await prisma.driver.create({
            data: {
                name,
                email,
                phone: phone,
                transport_type: transportTypeUpper,
                password: hashedPassword,
                wallet: 0.0
            }
        });

        return driver;
    }

    static async checkEmail(email: string) {

        const existing = await prisma.driver.findUnique({ where: { email } });

        if (existing) {
            throw new ValidationError("Motorista já existente!");
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

}