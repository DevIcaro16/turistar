import { NextFunction, Request, Response } from "express";
import { MetricsAdminService } from "../../services/admin/metrics.service";
import { ValidationError } from "../../../../../packages/error-handle";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const users = await MetricsAdminService.getAllUsers();
        const count = users.length;

        res.status(200).json({
            success: true,
            users,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getAllDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const drivers = await MetricsAdminService.getAllDrivers();
        const count = drivers.length;

        res.status(200).json({
            success: true,
            drivers,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getAllTourPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const tourPackages = await MetricsAdminService.getAllTourPackages();
        const count = tourPackages.length;

        res.status(200).json({
            success: true,
            tourPackages,
            count
        });

    } catch (error) {
        return next(error);
    }
};

export const getAllReserves = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const reserves = await MetricsAdminService.getAllReserves();
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

export const getAllTouristPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const touristPoints = await MetricsAdminService.getAllTouristPoints();
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

export const getPlatformRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const revenue = await MetricsAdminService.getPlatformRevenue();

        res.status(200).json({
            success: true,
            platformRevenue: revenue
        });

    } catch (error) {
        return next(error);
    }
};

export const getTaxPlatform = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const revenue = await MetricsAdminService.getTaxPlatform();

        res.status(200).json({
            success: true,
            platformRevenue: revenue
        });

    } catch (error) {
        return next(error);
    }
};

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const transactions = await MetricsAdminService.getAllTransactions();
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

export const getAllMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const metrics = await MetricsAdminService.getAllMetrics();

        res.status(200).json({
            success: true,
            metrics
        });

    } catch (error) {
        return next(error);
    }
};

export const updateConfig = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const adminId = req.user?.id;

        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }

        const { tax } = req.body;

        await MetricsAdminService.updateTaxPlatform(tax);

        res.status(200).json({
            success: true,
            message: 'Configuração atualiza com Suceso!'
        });

    } catch (error) {
        return next(error);
    }
};