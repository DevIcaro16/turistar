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

//Atualizar dados do motorista
export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;
        const { name, email, phone, transportType, password } = req.body;

        // Validar se pelo menos um campo foi fornecido
        if (!name && !email && !phone && !transportType && !password) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (transportType) updateData.transportType = transportType;
        if (password) updateData.password = password;

        const updatedDriver = await AuthService.updateDriver(driverId, updateData);

        res.status(200).json({
            success: true,
            message: 'Motorista atualizado com Sucesso!',
            driver: updatedDriver
        });

    } catch (error) {
        return next(error);
    }
};

//Deletar motorista
export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        await AuthService.deleteDriver(driverId);

        res.status(200).json({
            success: true,
            message: 'Motorista deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar motorista por ID
export const getDriverById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const driver = await AuthService.getDriverById(driverId);

        res.status(200).json({
            success: true,
            driver: driver
        });

    } catch (error) {
        return next(error);
    }
};