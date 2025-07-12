import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { AuthService } from "../../services/driver/auth.service";

//Registro de um novo Motorista
export const driverRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { name, email, phone, transportType, password } = req.body;

        if (!name || !email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }

        await AuthService.register({ name, email, phone, transportType, password });

        res.status(201).json({
            success: true,
            message: 'Motorista cadastrado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
}

//Login de um Motorista
export const driverLogin = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }

        const result = await AuthService.login(email, password, res);

        res.status(200).json({
            success: true,
            message: 'Login realizado com Sucesso!',
            user: result.driver
        });

    } catch (error) {
        return next(error);
    }
};