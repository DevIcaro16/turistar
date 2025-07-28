import { NextFunction, Request, Response } from "express";
import { TransactionService } from "../../services/Transaction/transaction.service";
import { AuthError, ValidationError } from "../../../../../packages/error-handle";
import { TransactionType } from "@prisma/client";

// types/express/index.d.ts
import { Driver } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            driver?: Driver;
        }
    }
}


export const getTransactionsByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        const userId = req.user?.id;
        const driverId = req.user?.id;

        if (!type) {
            throw new ValidationError("Tipo de transação é obrigatório!");
        }

        if (!Object.values(TransactionType).includes(type as TransactionType)) {
            throw new ValidationError("Tipo de transação inválido!");
        }

        const result = await TransactionService.getByType({
            type: type as TransactionType,
            userId,
            driverId
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return next(error);
    }
};


export const getUserTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { type } = req.query;

        if (!userId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        const result = await TransactionService.getByUser({
            userId,
            type: type as TransactionType
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return next(error);
    }
};


export const getDriverTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;
        if (req.user?.role !== 'driver') {
            throw new AuthError("Acesso negado! Apenas motoristas podem acessar este recurso.");
        }
        const { type } = req.query;

        if (!driverId) {
            throw new ValidationError("Motorista não autenticado!");
        }

        const result = await TransactionService.getByDriver({
            driverId,
            type: type as TransactionType
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return next(error);
    }
};


export const getDriverAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;
        if (req.user?.role !== 'driver') {
            throw new AuthError("Acesso negado! Apenas motoristas podem acessar este recurso.");
        }

        if (!driverId) {
            throw new ValidationError("Motorista não autenticado!");
        }

        const transactions = await TransactionService.getAllByDriver({
            driverId
        });

        const totals = await TransactionService.getTotals({ driverId });

        res.status(200).json({
            success: true,
            transactions: transactions,
            totals: totals
        });

    } catch (error) {
        return next(error);
    }
};


export const getUserTransactionTotals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        const totals = await TransactionService.getTotals({ userId });

        res.status(200).json({
            success: true,
            data: totals
        });

    } catch (error) {
        return next(error);
    }
};


export const getDriverTransactionTotals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            throw new ValidationError("Motorista não autenticado!");
        }

        const totals = await TransactionService.getTotals({ driverId });

        res.status(200).json({
            success: true,
            totals: totals
        });

    } catch (error) {
        return next(error);
    }
};


export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TransactionService.getAllTransactions();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return next(error);
    }
};


export const getGeneralTransactionTotals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totals = await TransactionService.getTotals({});

        res.status(200).json({
            success: true,
            data: totals
        });

    } catch (error) {
        return next(error);
    }
};
