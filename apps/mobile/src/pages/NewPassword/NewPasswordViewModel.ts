import { useState } from "react";
import api from "../../util/api/api";
import { FormValues, TypeUser } from "./NewPasswordModel";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function NewPasswordViewModel() {

    const route = useRoute();
    const navigation = useNavigation();
    const { activeTab = 'user', email = '' }: any = route.params || {};
    const userType = (activeTab as TypeUser);
    const [loading, setLoading] = useState<boolean>(false);
    const navigator = useNavigation();
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [passVisible, setPassVisible] = useState<boolean>(false);
    const [passConfirmVisible, setPassConfirmVisible] = useState<boolean>(false);

    const togglePassVisibility = () => {
        setPassVisible(!passVisible);
    }

    const togglePassConfirmVisibility = () => {
        setPassConfirmVisible(!passConfirmVisible);
    }

    const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleResetPass = async (values: FormValues) => {

        setLoading(true);

        try {

            await api.post(`${activeTab}/reset-password-user`, { email: email, newPassword: values.password });

            setLoadingAuth(false);
            showAlert('success', 'Sucesso!', 'Senha redefinida com Sucesso! Realize o Login novamente!');
            setTimeout(() => {
                navigation.navigate('SignIn' as never);
            }, 1500);

        } catch (error: any) {
            console.error('Erro no reset de senha:', error);

            if (error.response) {
                const { status, data } = error.response;

                if (status === 401) {
                    showAlert('error', 'Erro', data?.message || 'Senha igual à anterior. Escolha uma nova senha.');
                } else if (status === 400) {
                    showAlert('error', 'Erro', data?.message || 'Dados inválidos');
                } else if (status === 404) {
                    showAlert('error', 'Erro', 'Usuário não encontrado');
                } else {
                    showAlert('error', 'Erro', data?.message || 'Erro interno do servidor');
                }
            } else if (error.request) {
                showAlert('error', 'Erro de Conexão', 'Verifique sua conexão com a internet');
            } else {
                showAlert('error', 'Erro', 'Ocorreu um erro inesperado');
            }

        } finally {
            setLoading(false);
        }
    };

    const goToSignIn = () => navigator.navigate('SignIn' as never);

    return {
        loading,
        loadingAuth,
        alertVisible,
        alertType,
        alertTitle,
        alertMessage,
        setAlertVisible,
        passVisible,
        passConfirmVisible,
        togglePassVisibility,
        togglePassConfirmVisibility,
        handleResetPass,
        userType,
        goToSignIn
    };
}