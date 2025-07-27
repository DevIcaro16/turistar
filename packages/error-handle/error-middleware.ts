import { NextFunction, Request, Response } from "express";
import { AppError } from "./index";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const msg = `Error: ${req.method} ${req.url} - ${err.message}`;

    if (err instanceof AppError) {

        // console.log(msg);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    console.log("Erro Desconhecido: ", err);

    return res.status(500).json({
        status: 'error',
        message: msg || 'Algo de errado aconteceu, por favor tente novamente!',
    });
};
