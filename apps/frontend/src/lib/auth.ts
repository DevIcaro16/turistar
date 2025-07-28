'use client';

import React from 'react';
import api from '../util/api/api';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'driver' | 'admin';
    image?: string;
    phone?: string;
}


const getFromStorage = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const setToStorage = (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, value);
    } catch (error: any) {
        console.log('Erro: ', error);
    }
};

const removeFromStorage = (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch (error: any) {
        console.log('Erro: ', error);
    }
};


export const login = async (email: string, password: string, role: 'driver' | 'admin'): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const response = await api.post(`/${role}/login`, {
            email,
            password
        }, {
            withCredentials: true
        });

        const data = response.data;

        if (data.access_token && data.user) {

            setToStorage('access_token', data.access_token);
            setToStorage('refresh_token', data.refresh_token || '');
            setToStorage('user_role', data.user.role);

            return { success: true, user: data.user };
        } else {
            return { success: false, error: 'Resposta inválida do servidor' };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Erro ao fazer login'
        };
    }
};


export const logout = async (): Promise<void> => {
    try {
        const role = getFromStorage('user_role') || 'driver';
        await api.post(`/${role}/logout`, {}, { withCredentials: true });
    } catch (error: any) {
        console.log('Erro: ', error);
    }


    removeFromStorage('access_token');
    removeFromStorage('refresh_token');
    removeFromStorage('user_role');
};


export const getCurrentUser = async (): Promise<User | null> => {
    const accessToken = getFromStorage('access_token');
    const role = getFromStorage('user_role');

    if (!accessToken || !role) return null;

    try {
        const response = await api.get(`/${role}/me`, {
            withCredentials: true
        });

        const userData = response.data?.admin || response.data?.driver;
        if (userData) {
            return {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: role as 'driver' | 'admin',
                image: userData.image || undefined,
                phone: userData.phone || undefined
            };
        }

        return null;
    } catch (error: any) {

        if (error?.response?.status === 401) {
            logout();
        }
        return null;
    }
};


export const getAccessToken = (): string | null => {
    return getFromStorage('access_token');
};


export const isAuthenticated = (): boolean => {
    return getAccessToken() !== null;
};


export const getUserRole = (): string => {
    return getFromStorage('user_role') || '';
};


export const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshTokenValue = getFromStorage('refresh_token');
        const role = getFromStorage('user_role');

        if (!refreshTokenValue || !role) return null;

        const response = await api.post(`/${role}/refresh`, {
            refresh_token: refreshTokenValue
        }, {
            withCredentials: true
        });

        const newAccessToken = response.data.access_token;
        if (newAccessToken) {
            setToStorage('access_token', newAccessToken);
            return newAccessToken;
        }

        return null;
    } catch {
        logout();
        return null;
    }
};


export const useAuth = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const initializeAuth = async () => {
            const token = getAccessToken();
            if (token) {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const loginUser = async (email: string, password: string, role: 'driver' | 'admin') => {
        const result = await login(email, password, role);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        userRole: user?.role || '',
        login: loginUser,
        logout: logoutUser,
    };
}; 