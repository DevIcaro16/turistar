import { useState } from "react";
import api from "../../util/api/api";
import { FormValues, TypeUser } from "./types";
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

            const response = await api.post(`${activeTab}/reset-password-user`, { email: email, newPassword: values.password });

            if (response.status >= 400 && response.status <= 500) {
                showAlert('error', 'Erro', 'Houve um erro ao enviar o código!');
            } else {
                setLoadingAuth(false);
                showAlert('success', 'Sucesso!', 'Senha redefinida com Sucesso! Realize o Login novamente!');
                setTimeout(() => {
                    navigation.navigate('SignIn' as never);
                }, 1500);
            }

        } catch (error) {

            console.error('Erro no login:', error);

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