import { NextFunction, Request, Response } from "express";
import { TourPackageService } from "../../services/TourPackage/tourPackage.service";
import { ValidationError } from "../../../../../packages/error-handle";

export const TourPackageRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            origin_local,
            destiny_local,
            startDate,
            endDate,
            price,
            seatsAvailable,
            type,
            carId,
            touristPointId
        } = req.body;

        const driverId = req.user?.id; // ID do motorista autenticado

        if (!origin_local || !destiny_local || !price || !seatsAvailable || !type || !carId || !touristPointId) {
            throw new ValidationError("Todos os campos obrigatórios devem ser preenchidos!");
        }

        if (!driverId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        // Validar formato dos IDs
        if (typeof carId !== 'string' || carId.length !== 24) {
            throw new ValidationError("ID do carro inválido!");
        }

        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            throw new ValidationError("ID do ponto turístico inválido!");
        }

        await TourPackageService.register({
            origin_local,
            destiny_local,
            startDate,
            endDate,
            price,
            seatsAvailable,
            type,
            carId,
            touristPointId,
            driverId
        });

        res.status(201).json({
            success: true,
            message: 'Pacote turístico cadastrado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};