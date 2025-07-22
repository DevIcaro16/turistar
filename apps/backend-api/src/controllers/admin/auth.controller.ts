import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import { AuthService } from "../../services/admin/auth.service";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, password } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!name || !email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }
        if (file && Array.isArray(file)) {
            return next(new Error("Apenas um arquivo é permitido para upload."));
        }
        let image: string | undefined = undefined;
        if (file) {
            const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, function (error, result) {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Falha no upload da imagem'));
                    resolve(result);
                }).end(file.data);
            });
            image = resultFile.url !== null ? resultFile.url : undefined;
        }
        await AuthService.registerAdmin({ name, email, phone, password, ...(image && { image }) });
        res.status(201).json({
            success: true,
            message: 'Administrador cadastrado com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }
        const result = await AuthService.loginAdmin(email, password, res);
        res.status(200).json({
            success: true,
            message: 'Login realizado com Sucesso!',
            user: result.user,
            access_token: result.access_token,
            refresh_token: result.refresh_token
        });
    } catch (error) {
        return next(error);
    }
};

export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }
        const admin = await AuthService.getAdminById(adminId);
        res.status(200).json({
            success: true,
            admin: admin,
            role: 'admin'
        });
    } catch (error) {
        return next(error);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        const { name, email, phone, password } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }
        let image: string | undefined = undefined;
        if (file) {
            const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, function (error, result) {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Falha no upload da imagem'));
                    resolve(result);
                }).end(file.data);
            });
            image = resultFile.url !== null ? resultFile.url : undefined;
        }
        const updatedAdmin = await AuthService.updateAdmin(adminId, { name, email, phone, password, ...(image && { image }) });
        res.status(200).json({
            success: true,
            admin: updatedAdmin
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            return next(new ValidationError("ID do admin não fornecido!"));
        }
        await AuthService.deleteAdmin(adminId);
        res.status(200).json({
            success: true,
            message: 'Administrador deletado com sucesso!'
        });
    } catch (error) {
        return next(error);
    }
};

export const resetAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }
        await AuthService.resetPassword(email, newPassword);
        res.status(200).json({
            success: true,
            message: 'Senha alterada com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
};

export const forgotAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new ValidationError("Email é obrigatório!"));
        }
        await AuthService.forgotPassword(email);
        res.status(200).json({
            success: true,
            message: 'Email de recuperação enviado!'
        });
    } catch (error) {
        return next(error);
    }
};

export const refreshAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) throw new ValidationError("Refresh token é obrigatório!");
        const tokens = await AuthService.refreshToken(refresh_token);
        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};

export const logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.logoutAdmin(res);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};