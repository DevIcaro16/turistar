import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../../../../../packages/error-handle';


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {

            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }


            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;


                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "30m",
                        }
                    );


                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000
                    });

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };

                    return next();
                } catch (error) {
                    throw new AuthError('Token de refresh inválido!');
                }
            }


            if (accessToken) {
                try {
                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;
                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };
                    return next();
                } catch (error) {
                    throw new AuthError('Token de acesso inválido!');
                }
            }
        } else {

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                return next();
            } catch (error) {
                throw new AuthError('Token de acesso inválido!');
            }
        }
    } catch (error) {
        return next(error);
    }
};


export const authenticateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {



        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];



        if (!token) {

            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;




            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }


            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;



                    if (decoded.role !== 'driver') {

                        throw new AuthError('Acesso negado! Apenas motoristas podem acessar este recurso.');
                    }


                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "30m",
                        }
                    );


                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000
                    });

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };


                    return next();
                } catch (error) {
                    throw new AuthError('Token de refresh inválido!');
                }
            }


            if (accessToken) {
                try {

                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;



                    if (decoded.role !== 'driver') {

                        throw new AuthError('Acesso negado! Apenas motoristas podem acessar este recurso.');
                    }

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };


                    return next();
                } catch (error) {

                    return next(error);
                }
            }
        } else {

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;



                if (decoded.role !== 'driver') {

                    throw new AuthError('Acesso negado! Apenas motoristas podem acessar este recurso.');
                }

                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };

                return next();
            } catch (error) {
                throw new AuthError('Token de acesso inválido!');
            }
        }
    } catch (error) {

        return next(error);
    }
};


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {

            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }


            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;


                    if (decoded.role !== 'user') {
                        throw new AuthError('Acesso negado! Apenas usuários podem acessar este recurso.');
                    }


                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "30m",
                        }
                    );


                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000
                    });

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };

                    return next();
                } catch (error) {
                    throw new AuthError('Token de refresh inválido!');
                }
            }


            if (accessToken) {
                try {
                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;


                    if (decoded.role !== 'user') {
                        throw new AuthError('Acesso negado! Apenas usuários podem acessar este recurso.');
                    }

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };

                    return next();
                } catch (error) {
                    throw new AuthError('Token de acesso inválido!');
                }
            }
        } else {

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;


                if (decoded.role !== 'user') {
                    throw new AuthError('Acesso negado! Apenas usuários podem acessar este recurso.');
                }

                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                return next();
            } catch (error) {
                throw new AuthError('Token de acesso inválido!');
            }
        }
    } catch (error) {
        return next(error);
    }
};

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {

            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }

            if (!accessToken && refreshToken) {

                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;


                    if (decoded.role !== 'admin') {
                        throw new AuthError('Acesso negado! Apenas administradores podem acessar este recurso.');
                    }


                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "30m",
                        }
                    );


                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000
                    });

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };

                    return next();
                } catch (error) {
                    throw new AuthError('Token de refresh inválido!');
                }
            }


            if (accessToken) {
                try {
                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;


                    if (decoded.role !== 'admin') {
                        throw new AuthError('Acesso negado! Apenas administradores podem acessar este recurso.');
                    }

                    req.user = {
                        id: decoded.id,
                        role: decoded.role
                    };

                    return next();
                } catch (error) {
                    throw new AuthError('Token de acesso inválido!');
                }
            }
        } else {

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;

                if (decoded.role !== 'admin') {
                    throw new AuthError('Acesso negado! Apenas administradores podem acessar este recurso.');
                }

                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                return next();
            } catch (error) {
                throw new AuthError('Token de acesso inválido!');
            }
        }
    } catch (error) {
        return next(error);
    }
}; 