import axios from 'axios';
import { getAccessToken, refreshToken } from '../../lib/auth';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://www.turistarturismo.shop/api/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
    try {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erro ao obter token:', error);
    }
    return config;
});

// Interceptor para lidar com erros de token expirado
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Se falhar o refresh, redirecionar para login
                if (typeof window !== 'undefined') {
                    window.location.href = '/Login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;

