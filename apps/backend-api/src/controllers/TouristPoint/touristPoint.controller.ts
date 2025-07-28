import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { TouristPointService } from "../../services/TouristPoint/touristPoint.service";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const TouristPointRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, city, uf, latitude, longitude } = req.body;
        const driverId = req.user?.id;

        const file = req.files?.['file'] as UploadedFile | undefined;

        if (!name || !city || !uf) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }
        if (file && Array.isArray(file)) {
            throw new Error("Apenas um arquivo é permitido para upload.");
        }
        if (!driverId) {
            throw new ValidationError("Usuário não autenticado!");
        }

        let image = '';
        if (file) {
            const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, function (error, result) {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Falha no upload da imagem'));
                    resolve(result);
                }).end(file.data);
            });
            image = resultFile.url !== null ? resultFile.url : '';
        }

        await TouristPointService.register({ name, city, uf, latitude, longitude, driverId, image });

        res.status(201).json({
            success: true,
            message: 'Ponto turístico cadastrado com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
};

export const updateTouristPoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { touristPointId } = req.params;
        const driverId = req.user?.id;
        const { name, city, uf, latitude, longitude } = req.body;

        const file = req.files?.['file'] as UploadedFile | undefined;

        if (!name && !city && !uf && latitude === undefined && longitude === undefined && !file) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }
        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            return next(new ValidationError("ID do ponto turístico inválido!"));
        }
        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }
        if (file && Array.isArray(file)) {
            return next(new Error("Apenas um arquivo é permitido para upload."));
        }

        let image = '';
        if (file) {
            const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, function (error, result) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (!result) {
                        reject(new Error('Falha no upload da imagem'));
                        return;
                    }
                    resolve(result);
                }).end(file.data);
            });
            image = resultFile.url !== null ? resultFile.url : '';
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (city) updateData.city = city;
        if (uf) updateData.uf = uf;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;
        if (image) updateData.image = image;

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
        const driverId = req.user?.id;

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