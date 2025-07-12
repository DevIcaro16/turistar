import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../packages/error-handle";
import { AuthService } from "../../services/user/auth.service";

//Registro de um novo Usuário
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, password } = req.body;

        await AuthService.registerUser({ name, email, phone, password });

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
            user: result.user
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

        // Validar se pelo menos um campo foi fornecido
        if (!name && !email && !phone && !password) {
            return next(new ValidationError("Pelo menos um campo deve ser fornecido para atualização!"));
        }

        // Validar formato do ID
        if (typeof userId !== 'string' || userId.length !== 24) {
            return next(new ValidationError("ID do usuário inválido!"));
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (password) updateData.password = password;

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
        const { userId } = req.params;

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