import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://10.0.0.103:8000/api/',
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
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshAccessToken();
            if (newToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;