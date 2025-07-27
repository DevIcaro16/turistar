import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";
import { transportOptions } from "./SignUpModel";

export const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    TransportType: ''
};

export function useSignUpViewModel() {
    const [activeTab, setActiveTab] = useState<'user' | 'driver'>('user');
    const [loading, setLoading] = useState(false);
    const [passVisible, setPassVisible] = useState(false);
    const [passConfirmVisible, setPassConfirmVisible] = useState(false);
    const navigator = useNavigation();
    const { signUp, loadingAuth } = useContext(AuthContext);

    const togglePassVisibility = () => setPassVisible((v) => !v);
    const togglePassConfirmVisibility = () => setPassConfirmVisible((v) => !v);

    const handleSignUp = async (values: typeof initialValues) => {
        setLoading(true);
        try {
            await signUp(
                values.name,
                values.email,
                values.phone,
                values.TransportType,
                values.password,
                activeTab
            );
        } catch (error) {
            console.error('Erro no cadastro:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToSignIn = () => navigator.navigate('SignIn' as never);

    return {
        initialValues,
        transportOptions,
        activeTab,
        setActiveTab,
        loading,
        passVisible,
        passConfirmVisible,
        togglePassVisibility,
        togglePassConfirmVisibility,
        loadingAuth,
        handleSignUp,
        goToSignIn,
    };
} 