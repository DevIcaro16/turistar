import { NextFunction, Request, Response } from "express";
import { CarService } from "../../services/car/car.service";
import { ValidationError } from "../../../../../packages/error-handle";

export const CarRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { type, model, capacity } = req.body;
        const driverId = req.user?.id; // ID do motorista autenticado

        if (!type || !model || !capacity) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        if (!driverId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        await CarService.register({ type, model, capacity, driverId });

        res.status(201).json({
            success: true,
            message: 'Automóvel cadastrado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Atualizar dados do carro (apenas o motorista proprietário)
export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { carId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado
        const { type, model, capacity } = req.body;

        // Validar se pelo menos um campo foi fornecido
        if (!type && !model && !capacity) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }

        // Validar formato do ID do carro
        if (typeof carId !== 'string' || carId.length !== 24) {
            return next(new ValidationError("ID do carro inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        const updateData: any = {};
        if (type) updateData.type = type;
        if (model) updateData.model = model;
        if (capacity) updateData.capacity = capacity;

        const updatedCar = await CarService.updateCar(carId, driverId, updateData);

        res.status(200).json({
            success: true,
            message: 'Carro atualizado com Sucesso!',
            car: updatedCar
        });

    } catch (error) {
        return next(error);
    }
};

//Deletar carro (apenas o motorista proprietário)
export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { carId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado

        // Validar formato do ID do carro
        if (typeof carId !== 'string' || carId.length !== 24) {
            return next(new ValidationError("ID do carro inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        await CarService.deleteCar(carId, driverId);

        res.status(200).json({
            success: true,
            message: 'Carro deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar carro por ID (apenas o motorista proprietário)
export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { carId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado

        // Validar formato do ID do carro
        if (typeof carId !== 'string' || carId.length !== 24) {
            return next(new ValidationError("ID do carro inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        const car = await CarService.getCarById(carId, driverId);

        res.status(200).json({
            success: true,
            car: car
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar todos os carros de um motorista
export const getCarsByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const cars = await CarService.getCarsByDriver(driverId);

        res.status(200).json({
            success: true,
            cars: cars
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar todos os carros (para administradores)
export const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cars = await CarService.getAllCars();

        res.status(200).json({
            success: true,
            cars: cars
        });

    } catch (error) {
        return next(error);
    }
};