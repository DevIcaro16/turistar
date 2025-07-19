import { NextFunction, Request, Response } from "express";
import { TourPackageService } from "../../services/TourPackage/tourPackage.service";
import { ValidationError } from "../../../../../packages/error-handle";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const TourPackageRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            origin_local,
            destiny_local,
            date_tour,
            price,
            seatsAvailable,
            type,
            carId,
            touristPointId
        } = req.body;
        const driverId = req.user?.id; // ID do motorista autenticado
        const file = req.files?.['file'] as UploadedFile | undefined;

        if (!origin_local || !destiny_local || !date_tour || !price || !seatsAvailable || !type || !carId || !touristPointId) {
            throw new ValidationError("Todos os campos obrigatórios devem ser preenchidos!");
        }
        if (!driverId) {
            throw new ValidationError("Usuário não autenticado!");
        }
        if (file && Array.isArray(file)) {
            throw new Error("Apenas um arquivo é permitido para upload.");
        }
        // Validar formato dos IDs
        if (typeof carId !== 'string' || carId.length !== 24) {
            throw new ValidationError("ID do carro inválido!");
        }
        if (typeof touristPointId !== 'string' || touristPointId.length !== 24) {
            throw new ValidationError("ID do ponto turístico inválido!");
        }


        // Validar data do tour
        if (date_tour) {
            const dateTourObj = new Date(date_tour);
            if (isNaN(dateTourObj.getTime())) {
                throw new ValidationError("Data do tour inválida!");
            }
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
        await TourPackageService.register({
            title,
            origin_local,
            destiny_local,
            // date_tour: new Date(date_tour),
            date_tour: date_tour,
            price,
            seatsAvailable,
            type,
            carId,
            touristPointId,
            driverId,
            image
        });
        res.status(201).json({
            success: true,
            message: 'Pacote turístico cadastrado com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
};

export const updateTourPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tourPackageId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado
        const { origin_local, destiny_local, date_tour, price, seatsAvailable, type } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!origin_local && !destiny_local && !date_tour && !price && !seatsAvailable && !type && !file) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }
        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            return next(new ValidationError("ID do pacote turístico inválido!"));
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
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Falha no upload da imagem'));
                    resolve(result);
                }).end(file.data);
            });
            image = resultFile.url !== null ? resultFile.url : '';
        }
        const updateData: any = {};
        if (origin_local) updateData.origin_local = origin_local;
        if (destiny_local) updateData.destiny_local = destiny_local;
        if (date_tour) {
            const dateTourObj = new Date(date_tour);
            if (isNaN(dateTourObj.getTime())) {
                return next(new ValidationError("Data do tour inválida!"));
            }
            updateData.date_tour = dateTourObj;
        }
        if (price) updateData.price = price;
        if (seatsAvailable) updateData.seatsAvailable = seatsAvailable;
        if (type) updateData.type = type;
        if (image) updateData.image = image;
        const updatedTourPackage = await TourPackageService.updateTourPackage(tourPackageId, driverId, updateData);
        res.status(200).json({
            success: true,
            message: 'Pacote turístico atualizado com Sucesso!',
            tourPackage: updatedTourPackage
        });
    } catch (error) {
        return next(error);
    }
};

//Deletar pacote turístico (apenas o motorista proprietário)
export const deleteTourPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tourPackageId } = req.params;
        const driverId = req.user?.id; // ID do motorista autenticado

        // Validar formato do ID do pacote turístico
        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            return next(new ValidationError("ID do pacote turístico inválido!"));
        }

        if (!driverId) {
            return next(new ValidationError("Usuário não autenticado!"));
        }

        await TourPackageService.deleteTourPackage(tourPackageId, driverId);

        res.status(200).json({
            success: true,
            message: 'Pacote turístico deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar pacote turístico por ID (público)
export const getTourPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tourPackageId } = req.params;

        // Validar formato do ID do pacote turístico
        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            return next(new ValidationError("ID do pacote turístico inválido!"));
        }

        const tourPackage = await TourPackageService.getTourPackageById(tourPackageId);

        res.status(200).json({
            success: true,
            tourPackage: tourPackage
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar todos os pacotes turísticos de um motorista
export const getTourPackagesByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const tourPackages = await TourPackageService.getTourPackagesByDriver(driverId);

        res.status(200).json({
            success: true,
            tourPackages: tourPackages
        });

    } catch (error) {
        return next(error);
    }
};


//Buscar todos os pacotes turísticos (público)
export const getAllTourPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tourPackages = await TourPackageService.getAllTourPackages();

        res.status(200).json({
            success: true,
            tourPackages: tourPackages
        });

    } catch (error) {
        return next(error);
    }
};

export const getTourPackagesByDriverAndDate = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { driverId } = req.params;

        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        const { date } = req.body;

        const tourPackages = await TourPackageService.getTourPackagesByDriverAndDate(driverId, date);

        res.status(200).json({
            success: true,
            tourPackages: tourPackages
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar pacotes turísticos com filtros (público)
export const searchTourPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { origin, destiny, transportType } = req.query;

        const filters: any = {};
        if (origin) filters.origin = origin as string;
        if (destiny) filters.destiny = destiny as string;
        if (transportType) filters.transportType = transportType as string;

        const tourPackages = await TourPackageService.searchTourPackages(filters);

        res.status(200).json({
            success: true,
            tourPackages: tourPackages
        });

    } catch (error) {
        return next(error);
    }
};