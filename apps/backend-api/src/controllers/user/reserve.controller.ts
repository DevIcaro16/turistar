import { NextFunction, Request, Response } from "express";
import { ReserveService } from "../../services/user/reserve.service";
import { ValidationError } from "../../../../../packages/error-handle";

export const ReserveRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            tourPackageId,
            vacancies_reserved,
            amount
        } = req.body;

        const userId = req.user?.id;

        if (!userId || !tourPackageId || !vacancies_reserved || !amount) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        await ReserveService.register({ userId, tourPackageId, vacancies_reserved, amount });

        res.status(201).json({
            success: true,
            message: 'Reserva realizada com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

export const ReserveConfirmation = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            ReserveId
        } = req.body;

        const userId = req.user?.id;

        if (!userId || !ReserveId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        await ReserveService.confirm({ userId, ReserveId });

        res.status(200).json({
            success: true,
            message: 'Reserva confirmada com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

export const ReserveCancellation = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const {
            ReserveId
        } = req.body;

        const userId = req.user?.id;

        if (!userId || !ReserveId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        await ReserveService.cancel({ userId, ReserveId });

        res.status(200).json({
            success: true,
            message: 'Reserva cancelada com Sucesso. os valores foram estornados!'
        });

    } catch (error) {
        return next(error);
    }
};