import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FormValues, TypeUser } from "./ForgotPasswordModel";


export function ForgotPasswordViewModel() {

    const route = useRoute();
    const navigation = useNavigation();
    const { activeTab }: any = route.params;
    const userType = (activeTab as TypeUser);
    const [loading, setLoading] = useState<boolean>(false);
    const navigator = useNavigation();
    const [loadingAuth, setLoadingAuth] = useState(false);
    const { sendForgotPasswordCode } = useContext(AuthContext);

    const handleResetPass = async (values: FormValues) => {
        setLoading(true);
        try {
            await sendForgotPasswordCode(values.email, activeTab);
        } catch (error) {
            console.error('Erro no envio do código:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToSignIn = () => navigator.navigate('SignIn' as never)

    return {
        handleResetPass,
        loading,
        loadingAuth,
        userType,
        goToSignIn
    };
} 