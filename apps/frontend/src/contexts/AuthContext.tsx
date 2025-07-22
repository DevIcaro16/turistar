'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import api from '../util/api/api';
import { useAlertContext } from '../components/AlertProvider';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    userRole: TypeUser | string;
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
    const [userRole, setUserRole] = useState<TypeUser | string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

    useEffect(() => {
        async function fetchMe() {
            try {

                const userRole = await localStorage.getItem('@userRole');

                const res = await api.get(`/${userRole}/me`, {
                    withCredentials: true,
                });

                const me = res.data?.admin || res.data?.driver;
                const role = res.data?.role;

                if (me) {
                    setUser(me);
                    setUserRole(role || '');
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Usuário inválido');
                }
            } catch (err) {
                setUser(null);
                setIsAuthenticated(false);
                showAlert('error', 'Acesso Inválido', 'Por favor, realize seu acesso novamente!');
            } finally {
                setLoading(false);
            }
        }

        fetchMe();
    }, []);

    const login = async (email: string, password: string, role: TypeUser) => {
        setLoadingAuth(true);
        try {
            const res = await api.post(
                `/${role}/login`,
                { email, password },
                { withCredentials: true }
            );

            const me = res.data.user;

            if (me) {
                setUser(me);
                setUserRole(role);
                await localStorage.setItem('@userRole', role);
                setIsAuthenticated(true);
                showAlert('success', 'Login Realizado!', 'Login realizado com sucesso!');
            } else {
                throw new Error('Dados de login inválidos');
            }
        } catch (err: any) {
            showAlert(
                'error',
                'Erro no Login',
                err.response?.data?.message || 'Erro ao realizar login'
            );
        } finally {
            setLoadingAuth(false);
        }
    };

    const logout = async () => {
        try {
            const userRole = await localStorage.getItem('@userRole') || "driver";
            await api.post(`/${userRole}/logout`, {}, { withCredentials: true });
            await localStorage.removeItem('@userRole');
            showAlert(
                'success',
                'Logout',
                'Logout Realizado com Sucesso!'
            );
        } catch (err: any) {
            showAlert(
                'error',
                'Erro no Logout',
                err.response?.data?.message || 'Erro ao realizar login'
            );
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        isAuthenticated,
        user,
        userRole,
        login,
        logout,
        loading,
        loadingAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
