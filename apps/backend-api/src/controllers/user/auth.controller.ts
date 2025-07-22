import { NextFunction, Request, Response } from "express";
import { AuthError, ValidationError } from "../../../../../packages/error-handle";
import { AuthService } from "../../services/user/auth.service";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import bcrypt from "bcryptjs";
import prisma from "../../../../../packages/libs/prisma";
import { handleForgotPassword, verifyForgotPasswordOtp } from "../../utils/auth/auth.helper";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Registro de um novo Usuário
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
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
        await AuthService.registerUser({ name, email, phone, password, ...(image && { image }) });
        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com Sucesso!'
        });
    } catch (error) {
        return next(error);
    }
}

//Login de um Usuário
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Todos os campos devem ser preenchidos!"));
        }

        const result = await AuthService.loginUser(email, password, res);

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

//Atualizar dados do usuário
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { name, email, phone, password } = req.body;
        const file = req.files?.['file'] as UploadedFile | undefined;
        if (!name && !email && !phone && !password && !file) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }
        if (typeof userId !== 'string' || userId.length !== 24) {
            return next(new ValidationError("ID do usuário inválido!"));
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
        if (password) updateData.password = password;
        if (image) updateData.image = image;
        const updatedUser = await AuthService.updateUser(userId, updateData);
        res.status(200).json({
            success: true,
            message: 'Usuário atualizado com Sucesso!',
            user: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

//Deletar usuário
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        // Validar formato do ID
        if (typeof userId !== 'string' || userId.length !== 24) {
            return next(new ValidationError("ID do usuário inválido!"));
        }

        await AuthService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: 'Usuário deletado com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};

//Buscar usuário por ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.user?.id;

        // Validar formato do ID
        if (typeof userId !== 'string' || userId.length !== 24) {
            return next(new ValidationError("ID do usuário inválido!"));
        }

        const user = await AuthService.getUserById(userId);

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        return next(error);
    }
};

//resetando senha do Usuário
// export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email, newPassword } = req.body;

//         if (!email || !newPassword) {
//             return next(new ValidationError("Todos os campos devem ser preenchidos!"));
//         }

//         await AuthService.resetPassword(email, newPassword);

//         res.status(200).json({
//             success: true,
//             message: 'Senha alterada com Sucesso!'
//         });

//     } catch (error) {
//         return next(error);
//     }
// };

// //Esqueci minha senha
// export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return next(new ValidationError("Email é obrigatório!"));
//         }

//         await AuthService.forgotPassword(email);

//         res.status(200).json({
//             success: true,
//             message: 'Email de recuperação enviado!'
//         });

//     } catch (error) {
//         return next(error);
//     }
// };

// Retorna dados do usuário autenticado
export const meUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Não autenticado!' });
        }
        const user = await AuthService.getUserById(userId);
        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(error);
    }
};

export const refreshUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) throw new ValidationError("Refresh token é obrigatório!");

        const tokens = await AuthService.refreshToken(refresh_token);
        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};


export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, 'user');
};

//Verificando código OTP da recuperação de senha
export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
};

//resetando senha do Usuário
export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return next(new ValidationError("Todos os campos são Obrigatórios!"));
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return next(new AuthError("Usuário não encontrado!"));

        //Verificando o hash da senha criptografada
        const isSamePassword = await bcrypt.compare(newPassword, user.password!);

        if (isSamePassword) {
            return next(new AuthError("Senha não pode ser igual a anterior!"));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        });


        res.status(200).json({
            success: true,
            message: 'Senha alterada com Sucesso!'
        });

    } catch (error) {
        return next(error);
    }
};