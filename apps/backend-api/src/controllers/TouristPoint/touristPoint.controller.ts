import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { TouristPointService } from "../../services/TouristPoint/touristPoint.service";

export const TouristPointRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { name, city, uf, latitude, longitude } = req.body;
        const driverId = req.user?.id; // ID do motorista autenticado

        if (!name || !city || !uf) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        if (!driverId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        await TouristPointService.register({ name, city, uf, latitude, longitude, driverId });

        res.status(201).json({
            success: true,
            message: 'Ponto turístico cadastrado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Atualizar dados do ponto turístico (apenas o motorista proprietário)
export const updateTouristPoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { touristPointId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado
        const { name, city, uf, latitude, longitude } = req.body;

        // Validar se pelo menos um campo foi fornecido
        if (!name && !city && !uf && latitude === undefined && longitude === undefined) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }

        // Validar formato do ID do ponto turístico
        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            return next(new ValidationError("ID do ponto turístico inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (city) updateData.city = city;
        if (uf) updateData.uf = uf;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;

        const updatedTouristPoint = await TouristPointService.updateTouristPoint(touristPointId, driverId, updateData);

        res.status(200).json({
            success: true,
            message: 'Ponto turístico atualizado com Sucesso!',
            touristPoint: updatedTouristPoint
        });

    } catch (error) {
        return next(error);
    }
};

//Deletar ponto turístico (apenas o motorista proprietário)
export const deleteTouristPoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { touristPointId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado

        // Validar formato do ID do ponto turístico
        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            return next(new ValidationError("ID do ponto turístico inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        await TouristPointService.deleteTouristPoint(touristPointId, driverId);

        res.status(200).json({
            success: true,
            message: 'Ponto turístico deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar ponto turístico por ID (apenas o motorista proprietário)
export const getTouristPointById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { touristPointId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado

        // Validar formato do ID do ponto turístico
        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            return next(new ValidationError("ID do ponto turístico inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        const touristPoint = await TouristPointService.getTouristPointById(touristPointId, driverId);

        res.status(200).json({
            success: true,
            touristPoint: touristPoint
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar todos os pontos turísticos de um motorista
export const getTouristPointsByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const touristPoints = await TouristPointService.getTouristPointsByDriver(driverId);

        res.status(200).json({
            success: true,
            touristPoints: touristPoints
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar todos os pontos turísticos (para administradores)
export const getAllTouristPoints = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const touristPoints = await TouristPointService.getAllTouristPoints();

        res.status(200).json({
            success: true,
            touristPoints: touristPoints
        });

    } catch (error) {
        return next(error);
    }
};