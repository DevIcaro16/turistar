'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../util/api/api';
import { useAlertContext } from '../components/AlertProvider';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string, role: TypeUser) => Promise<void>;
    logout: () => void;
    loading: boolean;
    loadingAuth: boolean;
}

type TypeUser = 'driver' | 'admin';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const { showAlert } = useAlertContext();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

    useEffect(() => {

        async function loadStorage() {

            const accessToken = localStorage.getItem('@accessToken');
            const storedRole = localStorage.getItem('@userRole');

            if (accessToken) {

                console.log(accessToken);

                api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

                try {

                    const response = await api.get(`/${storedRole}/me`);

                    let userData;

                    if (storedRole === 'user') {
                        userData = response.data.user;
                    }

                    if (storedRole === 'driver') {
                        userData = response.data.driver;
                    }

                    setUser(userData);
                    setToken(accessToken);
                    setUserRole(userData.role || storedRole);
                    setIsAuthenticated(true);

                    if (userData.role && userData.role !== storedRole) {
                        await localStorage.setItem('@userRole', userData.role);
                    }

                } catch (err: any) {

                    console.log('Token expirado ou inválido');
                    await localStorage.removeItem('@accessToken');
                    await localStorage.removeItem('@refreshToken');
                    await localStorage.removeItem('@userRole');
                    setUser(null);
                    setUserRole(null);
                }
            }
            setLoading(false);
        }

        loadStorage();
    }, []);

    const login = async (email: string, password: string, role: TypeUser) => {

        try {

            console.log(role);
            const response = await api.post(`/${role}/login`, {
                email: email,
                password: password,
            });

            if (response.status >= 400 && response.status <= 500) {
                console.log(response.status);
                showAlert('error', 'Erro no Login', 'Houve um erro no login');
            } else {

                const { user, access_token, refresh_token } = response.data;

                // Armazenar tokens e role no AsyncStorage
                await localStorage.setItem('@accessToken', access_token);
                await localStorage.setItem('@refreshToken', refresh_token);
                await localStorage.setItem('@userRole', user.role);

                // Configurar header de autorização para todas as requisições futuras
                api.defaults.headers['Authorization'] = `Bearer ${access_token}`;

                setUser(user);
                setUserRole(user.role);
                setLoadingAuth(false);
                setIsAuthenticated(true);
                showAlert('success', 'Login Realizado!', 'Login realizado com sucesso!');
            }
        } catch (error: any) {
            setLoadingAuth(false);
            console.log(error);
            const message = error.response?.data?.message || 'Não foi possível realizar o Login!';
            showAlert('error', 'Erro no Login', message);
        }
    };

    const logout = () => {
        localStorage.removeItem('@accessToken');
        localStorage.removeItem('@refreshToken');
        localStorage.removeItem('@userRole');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        loadingAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 