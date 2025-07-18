import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { AuthService } from "../../services/driver/auth.service";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Registro de um novo Motorista
export const driverRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, transportType, password } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!name || !email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
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
        await AuthService.register({ name, email, phone, transportType, password, image });
        res.status(201).json({
            success: true,
            message: 'Motorista cadastrado com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
}

//Login de um Motorista
export const driverLogin = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }

        const result = await AuthService.login(email, password, res);

        res.status(200).json({
            success: true,
            message: 'Login realizado com Sucesso!',
            user: result.driver,
            access_token: result.access_token,
            refresh_token: result.refresh_token
        });

    } catch (error) {
        return next(error);
    }
};

//Atualizar dados do motorista
export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;
        const { name, email, phone, transportType, password } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!name && !email && !phone && !transportType && !password && !file) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
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
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (transportType) updateData.transportType = transportType;
        if (password) updateData.password = password;
        if (image) updateData.image = image;
        const updatedDriver = await AuthService.updateDriver(driverId, updateData);
        res.status(200).json({
            success: true,
            message: 'Motorista atualizado com Sucesso!',
            driver: updatedDriver
        });
    } catch (error) {
        return next(error);
    }
};

//Deletar motorista
export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motorista inválido!"));
        }

        await AuthService.deleteDriver(driverId);

        res.status(200).json({
            success: true,
            message: 'Motorista deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar motorista por ID
export const getDriverById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // Validar formato do ID
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            return next(new ValidationError("ID do motoristaaaaaaaaaaa inválido!"));
        }

        const driver = await AuthService.getDriverById(driverId);

        res.status(200).json({
            success: true,
            driver: driver
        });

    } catch (error) {
        return next(error);
    }
};

// Retorna dados do motorista autenticado
export const meuDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.user?.id;
        if (!driverId) {
            return res.status(401).json({ message: 'Não autenticado!' });
        }
        const driver = await AuthService.getDriverById(driverId);
        console.log(driver);
        res.status(200).json({ success: true, driver });
    } catch (error) {
        return next(error);
    }
};

export const refreshDriverToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) throw new ValidationError("Refresh token é obrigatório!");

        const tokens = await AuthService.refreshToken(refresh_token);
        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};