import React, { createContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../util/api/api";
import AlertComponent from "../components/AlertComponent";
import { AxiosInstance } from "axios";

interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
    role: string;
    transport_type?: string;
}

type TypeUser = 'user' | 'driver';

interface AuthContextData {
    signed: boolean;
    user: User | null;
    userRole: string | null;
    signUp: (name: string, email: string, phone: string, transportType: string, password: string, role: TypeUser) => Promise<void>;
    signIn: (email: string, password: string, role: TypeUser) => Promise<void>;
    signOut: () => Promise<void>;
    loadingAuth: boolean;
    refreshAccessToken: () => Promise<AxiosInstance>
    loading: boolean;
    sendForgotPasswordCode: (email: string, activeTab: TypeUser) => Promise<{ success: boolean; message?: string }>;
    verifyForgotPasswordCode: (email: string, otp: string, activeTab: TypeUser) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados para o AlertComponent personalizado
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    useEffect(() => {

        async function loadStorage() {

            const accessToken = await AsyncStorage.getItem('@accessToken');
            const storedRole = await AsyncStorage.getItem('@userRole');

            if (accessToken) {
                // console.log('Token encontrado:', accessToken);
                // console.log('Role armazenado:', storedRole);

                api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

                try {

                    // console.log('Fazendo requisição para:', `${storedRole}/me`);
                    const response = await api.get(`${storedRole}/me`);
                    // console.log('Resposta da API:', response.data);

                    let userData;

                    if (storedRole === 'user') {
                        userData = response.data.user;
                    }

                    if (storedRole === 'driver') {
                        // console.log('Dados do driver:', response.data.driver);
                        userData = response.data.driver;
                    }

                    if (!userData) {
                        throw new Error('Dados do usuário não encontrados na resposta');
                    }

                    setUser(userData);
                    setToken(accessToken);
                    setUserRole(userData.role || storedRole);

                    // Atualizar role no storage se necessário
                    if (userData.role && userData.role !== storedRole) {
                        await AsyncStorage.setItem('@userRole', userData.role);
                    }
                } catch (err: any) {

                    // console.log('Erro na requisição /me:', err);
                    // console.log('Status do erro:', err.response?.status);
                    // console.log('Mensagem do erro:', err.response?.data);
                    // console.log('Token expirado ou inválido');
                    await AsyncStorage.removeItem('@accessToken');
                    await AsyncStorage.removeItem('@refreshToken');
                    await AsyncStorage.removeItem('@userRole');
                    setUser(null);
                    setUserRole(null);
                }
            }
            setLoading(false);
        }
        loadStorage();
    }, []);

    async function signUp(
        name: string,
        email: string,
        phone: string,
        transportType: string,
        password: string,
        role: TypeUser
    ) {

        setLoadingAuth(true);

        try {

            const dataSignUp: any = {
                name: name,
                email: email,
                phone: phone,
                password: password,
            };

            if (transportType !== null && role === 'driver') dataSignUp.transportType = transportType;

            // console.log(role);

            const response = await api.post(`/${role}/registration`, dataSignUp);

            if (response.status >= 400 && response.status <= 500) {
                showAlert('error', 'Erro no Cadastro', 'Houve um erro na criação do Usuário');
            } else {
                setLoadingAuth(false);
                showAlert('success', 'Sucesso!', 'Usuário cadastrado com sucesso!');
                setTimeout(() => {
                    navigation.navigate('SignIn' as never);
                }, 2000);
            }
        } catch (error: any) {
            setLoadingAuth(false);
            // console.log(error);
            const message = error.response?.data?.message || 'Não foi possível concluir o cadastro';
            showAlert('error', 'Erro no Cadastro', message);
        }
    }

    async function signIn(email: string, password: string, role: TypeUser) {

        setLoadingAuth(true);

        try {

            const response = await api.post(`/${role}/login`, {
                email: email,
                password: password,
            });

            if (response.status >= 400 && response.status <= 500) {
                console.log(response.status);
                showAlert('error', 'Erro no Login', 'Houve um erro no login');
            } else {


                const { user, access_token, refresh_token } = response.data;

                await AsyncStorage.setItem('@accessToken', access_token);
                await AsyncStorage.setItem('@refreshToken', refresh_token);
                await AsyncStorage.setItem('@userRole', user.role);

                api.defaults.headers['Authorization'] = `Bearer ${access_token}`;

                setUser(user);
                setUserRole(user.role);
                setLoadingAuth(false);
                showAlert('success', 'Login Realizado!', 'Login realizado com sucesso!');
            }
        } catch (error: any) {
            setLoadingAuth(false);
            console.log(error);
            const message = error.response?.data?.message || 'Não foi possível realizar o Login!';
            showAlert('error', 'Erro no Login', message);
        }
    }

    async function signOut() {
        try {

            await AsyncStorage.removeItem('@accessToken');
            await AsyncStorage.removeItem('@refreshToken');
            await AsyncStorage.removeItem('@userRole');

            delete api.defaults.headers['Authorization'];

            setUser(null);
            setUserRole(null);
            showAlert('info', 'Logout Realizado', 'Logout realizado com sucesso!');
        } catch (error) {
            showAlert('error', 'Erro no Logout', 'Erro ao fazer logout');
        }
    }

    async function refreshAccessToken() {
        const refreshToken = await AsyncStorage.getItem('@refreshToken');
        const userRole = await AsyncStorage.getItem('@userRole');

        if (!refreshToken || !userRole) return null;

        try {
            // console.log('Tentando refresh do token para role:', userRole);
            const response = await api.post(`/${userRole}/refresh`, { refresh_token: refreshToken });
            const { access_token, refresh_token: newRefreshToken } = response.data;

            await AsyncStorage.setItem('@accessToken', access_token);
            await AsyncStorage.setItem('@refreshToken', newRefreshToken);

            api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
            // console.log('Token renovado com sucesso');
            return access_token;
        } catch (error) {
            // console.log('Erro no refresh do token:', error);
            await signOut();
            return null;
        }
    }

    async function sendForgotPasswordCode(email: string, activeTab: TypeUser) {
        setLoadingAuth(true);
        try {
            const response = await api.post(`/${activeTab}/forgot-password-user`, { email });
            if (response.status >= 400 && response.status <= 500) {
                showAlert('error', 'Erro', 'Houve um erro ao enviar o código!');
                return { success: false, message: 'Houve um erro ao enviar o código!' };
            } else {
                console.log(response.data);
                setLoadingAuth(false);
                showAlert('success', 'Sucesso!', 'Verifique o código recebido em seu Email!');
                setTimeout(() => {
                    (navigation as any).navigate('ResetPassword', { email, activeTab });
                }, 1000);
                return { success: true };
            }
        } catch (error: any) {
            showAlert('error', 'Erro', error.response?.data?.message || 'Erro ao enviar código!');
            return { success: false, message: error.response?.data?.message || 'Erro ao enviar código!' };
        } finally {
            setLoadingAuth(false);
        }
    }

    async function verifyForgotPasswordCode(email: string, otp: string, activeTab: TypeUser) {
        setLoadingAuth(true);
        try {
            const response = await api.post(`/${activeTab}/verify-forgot-password-user`, { email, otp });
            if (response.data.success) {
                showAlert('success', 'Sucesso!', 'Código verificado. Agora você pode redefinir sua senha.');
                return { success: true };
            } else {
                showAlert('error', 'Erro', response.data.message || 'Código inválido ou expirado.');
                return { success: false, message: response.data.message || 'Código inválido ou expirado.' };
            }
        } catch (err: any) {
            showAlert('error', 'Erro', err?.response?.data?.message || 'Erro ao verificar código.');
            return { success: false, message: err?.response?.data?.message || 'Erro ao verificar código.' };
        } finally {
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, userRole, signUp, signIn, signOut, refreshAccessToken, loadingAuth, loading, sendForgotPasswordCode, verifyForgotPasswordCode }}>
            {children}

            {/* AlertComponent personalizado */}
            <AlertComponent
                visible={alertVisible}
                type={alertType}
                title={alertTitle}
                message={alertMessage}
                onClose={hideAlert}
                autoClose={true}
                autoCloseTime={3000}
            />
        </AuthContext.Provider>
    );
}