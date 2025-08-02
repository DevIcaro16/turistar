import { NextFunction, Request, Response } from "express";
import { CarService } from "../../services/car/car.service";
import { ValidationError } from "../../../../../packages/error-handle";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

export const CarRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.body);
        const { type, model, capacity } = req.body;
        const driverId = req.user?.id;

        const file = req.files?.['file'] as UploadedFile | undefined;

        if (!type || !model || !capacity) {
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

        await CarService.register({ image, type, model, capacity, driverId });

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
        const driverId = req.user?.id;
        const { type, model, capacity } = req.body;

        if (!type && !model && !capacity) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }

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
        const driverId = req.user?.id;


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
        const driverId = req.user?.id;

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

        const driverId = req.user?.id;

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

//Buscar todos os carros do motorista autenticado
export const getCarsByAuthenticatedDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
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