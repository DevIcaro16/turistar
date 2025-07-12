import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../../../../../packages/error-handle';

// Extend Request interface to include user info
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
        // Verificar se o token está no header Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            // Se não há token no header, verificar nos cookies
            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }

            // Se há refresh token mas não access token, tentar renovar
            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;

                    // Gerar novo access token
                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "15m",
                        }
                    );

                    // Definir novo access token no cookie
                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000 // 15 minutos
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

            // Se há access token nos cookies, verificar
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
            // Verificar token do header Authorization
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

// Middleware específico para motoristas
export const authenticateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Primeiro autenticar o token
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            // Se não há token no header, verificar nos cookies
            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }

            // Se há refresh token mas não access token, tentar renovar
            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;

                    // Verificar se é um motorista
                    if (decoded.role !== 'driver') {
                        throw new AuthError('Acesso negado! Apenas motoristas podem acessar este recurso.');
                    }

                    // Gerar novo access token
                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "15m",
                        }
                    );

                    // Definir novo access token no cookie
                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000 // 15 minutos
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

            // Se há access token nos cookies, verificar
            if (accessToken) {
                try {
                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;

                    // Verificar se é um motorista
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
        } else {
            // Verificar token do header Authorization
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;

                // Verificar se é um motorista
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

// Middleware específico para usuários
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Primeiro autenticar o token
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            // Se não há token no header, verificar nos cookies
            const accessToken = req.cookies?.access_token;
            const refreshToken = req.cookies?.refresh_token;

            if (!accessToken && !refreshToken) {
                throw new AuthError('Token de acesso não fornecido!');
            }

            // Se há refresh token mas não access token, tentar renovar
            if (!accessToken && refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;

                    // Verificar se é um usuário
                    if (decoded.role !== 'user') {
                        throw new AuthError('Acesso negado! Apenas usuários podem acessar este recurso.');
                    }

                    // Gerar novo access token
                    const newAccessToken = jwt.sign(
                        {
                            id: decoded.id,
                            role: decoded.role
                        },
                        process.env.ACCESS_TOKEN_SECRET as string,
                        {
                            expiresIn: "15m",
                        }
                    );

                    // Definir novo access token no cookie
                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000 // 15 minutos
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

            // Se há access token nos cookies, verificar
            if (accessToken) {
                try {
                    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;

                    // Verificar se é um usuário
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
            // Verificar token do header Authorization
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;

                // Verificar se é um usuário
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