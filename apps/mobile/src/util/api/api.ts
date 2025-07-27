import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://54.91.55.102:8000/api/',
    // baseURL: 'http://192.168.15.4:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

async function refreshAccessToken() {


    const refreshToken = await AsyncStorage.getItem('@refreshToken');
    const userRole = await AsyncStorage.getItem('@userRole');

    if (!refreshToken) return null;

    try {
        const response = await api.post(`/${userRole}/refresh`, { refresh_token: refreshToken });
        const { access_token, refresh_token: newRefreshToken } = response.data;

        await AsyncStorage.setItem('@accessToken', access_token);
        await AsyncStorage.setItem('@refreshToken', newRefreshToken);

        api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
        return access_token;
    } catch (error) {
        // Se falhar, remova os tokens
        await AsyncStorage.removeItem('@accessToken');
        await AsyncStorage.removeItem('@refreshToken');
        return null;
    }
}

api.interceptors.response.use(
    response => {
        // console.log('Interceptor - Resposta bem-sucedida:', response.config.url);
        return response;
    },
    async error => {
        // console.log('Interceptor - Erro na requisição:', error.config?.url);
        // console.log('Interceptor - Status do erro:', error.response?.status);

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            // console.log('Interceptor - Tentando refresh do token...');
            originalRequest._retry = true;
            const newToken = await refreshAccessToken();
            if (newToken) {
                // console.log('Interceptor - Token renovado, repetindo requisição');
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } else {
                // console.log('Interceptor - Falha no refresh do token');
            }
        }
        return Promise.reject(error);
    }
);

export default api;