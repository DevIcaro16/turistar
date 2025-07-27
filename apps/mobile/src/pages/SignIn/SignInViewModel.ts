import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import { FormValues, typeUser } from "./SignInModel";

export function useSignInViewModel() {

    const [activeTab, setActiveTab] = useState<typeUser>('user');
    const [loading, setLoading] = useState(false);
    const [passVisible, setPassVisible] = useState(false);

    const navigator = useNavigation();
    const { signIn, loadingAuth } = useContext(AuthContext);

    const toggleVisibility = () => setPassVisible((v) => !v);

    const handleLogin = async (values: FormValues) => {
        setLoading(true);
        try {
            await signIn(values.email, values.password, activeTab);
        } catch (error) {
            // Trate o erro aqui se quiser
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToSignUp = () => navigator.navigate('SignUp' as never);
    const goToForgotPassword = () => (navigator as any).navigate('ForgotPassword', { activeTab });

    return {
        activeTab,
        setActiveTab,
        loading,
        passVisible,
        toggleVisibility,
        handleLogin,
        goToSignUp,
        goToForgotPassword,
        loadingAuth,
    };
} 