import React, { createContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../util/api/api";
import AlertComponent from "../components/AlertComponent";

interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
    role: string;
    transport_type?: string; // Adicionado para driver
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
    loading: boolean;
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
                console.log(accessToken);
                // Configurar header de autorização para todas as requisições
                api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

                try {
                    // Verificar se o token ainda é válido fazendo uma requisição
                    const response = await api.get(`/${storedRole}/me`);

                    let userData;

                    if (storedRole === 'user') {
                        userData = response.data.user;
                    }

                    if (storedRole === 'driver') {
                        // console.log(response.data.driver);
                        userData = response.data.driver;
                    }

                    setUser(userData);
                    setToken(accessToken);
                    setUserRole(userData.role || storedRole);

                    // Atualizar role no storage se necessário
                    if (userData.role && userData.role !== storedRole) {
                        await AsyncStorage.setItem('@userRole', userData.role);
                    }
                } catch (err: any) {
                    // Se o token expirou, limpar e redirecionar para login
                    console.log('Token expirado ou inválido');
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

            console.log(role);

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
            console.log(error);
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

                // Armazenar tokens e role no AsyncStorage
                await AsyncStorage.setItem('@accessToken', access_token);
                await AsyncStorage.setItem('@refreshToken', refresh_token);
                await AsyncStorage.setItem('@userRole', user.role);

                // Configurar header de autorização para todas as requisições futuras
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
            // Limpar tokens e role do AsyncStorage
            await AsyncStorage.removeItem('@accessToken');
            await AsyncStorage.removeItem('@refreshToken');
            await AsyncStorage.removeItem('@userRole');

            // Remover header de autorização
            delete api.defaults.headers['Authorization'];

            setUser(null);
            setUserRole(null);
            showAlert('info', 'Logout Realizado', 'Logout realizado com sucesso!');
        } catch (error) {
            showAlert('error', 'Erro no Logout', 'Erro ao fazer logout');
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, userRole, signUp, signIn, signOut, loadingAuth, loading }}>
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