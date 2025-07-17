import { NextFunction, Request, Response } from "express";
import { ReserveService } from "../../services/user/reserve.service";
import { AuthError, ValidationError } from "../../../../../packages/error-handle";
import { TourRegistrationService } from "../../services/driver/tour_registration.service";

import { Driver } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            driver?: Driver;
        }
    }
}

export const TourRegistrationStart = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            tourPackageId
        } = req.body;

        // console.log(req);

        const driverId = req.user?.id;

        if (!driverId) {
            throw new AuthError("Motorista não autenticado!");
        }

        if (!tourPackageId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        await TourRegistrationService.start({ driverId, tourPackageId });

        res.status(200).json({
            success: true,
            message: 'Passeio iniciado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

export const TourRegistrationEnd = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            tourPackageId
        } = req.body;

        const driverId = req.user?.id;

        if (!driverId) {
            throw new AuthError("Motorista não autenticado!");
        }

        if (!tourPackageId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        await TourRegistrationService.end({ driverId, tourPackageId });

        res.status(200).json({
            success: true,
            message: 'Passeio finalizado com Sucesso. os valores foram creditados!'
        });

    } catch (error) {
        return next(error);
    }
};
