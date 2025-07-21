import { NextFunction, Request, Response } from "express";
import { MetricsDriverService } from "../../services/driver/metrics.service";
import { ValidationError } from "../../../../../packages/error-handle";

export const getDriverTourPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const tourPackages = await MetricsDriverService.getDriverTourPackages(driverId);
        const count = tourPackages.length;
        const completed = tourPackages.filter(tp => tp.isFinalised).length;
        const active = tourPackages.filter(tp => tp.isRunning && !tp.isFinalised).length;

        res.status(200).json({
            success: true,
            tourPackages,
            count,
            completed,
            active
        });

    } catch (error) {
        return next(error);
    }
};

export const getDriverReserves = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const reserves = await MetricsDriverService.getDriverReserves(driverId);
        const count = reserves.length;

        res.status(200).json({
            success: true,
            reserves,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getDriverTouristPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const touristPoints = await MetricsDriverService.getDriverTouristPoints(driverId);
        const count = touristPoints.length;

        res.status(200).json({
            success: true,
            touristPoints,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getDriverWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const wallet = await MetricsDriverService.getDriverWallet(driverId);
        const transactions = await MetricsDriverService.getDriverTransactions(driverId);
        const totalEarnings = transactions
            .filter(t => t.type === 'CREDIT')
            .reduce((sum, t) => sum + t.amount, 0);

        res.status(200).json({
            success: true,
            wallet: {
                balance: wallet,
                totalEarnings: totalEarnings
            }
        });

    } catch (error) {
        return next(error);
    }
};

export const getDriverTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const transactions = await MetricsDriverService.getDriverTransactions(driverId);
        const count = transactions.length;

        res.status(200).json({
            success: true,
            transactions,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getDriverMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("ID do motorista não fornecido!"));
        }

        const metrics = await MetricsDriverService.getDriverMetrics(driverId);

        res.status(200).json({
            success: true,
            metrics
        });

    } catch (error) {
        return next(error);
    }
}; 