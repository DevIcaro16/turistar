import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FormValues, TypeUser } from "./ForgotPasswordModel";
import { Alert } from "react-native";


export function ForgotPasswordViewModel() {

    const route = useRoute();
    const navigation = useNavigation();
    const { activeTab }: any = route.params;
    const userType = (activeTab as TypeUser);
    const [loading, setLoading] = useState<boolean>(false);
    const navigator = useNavigation();
    const [loadingAuth, setLoadingAuth] = useState(false);
    const authContext = useContext(AuthContext);
    const { sendForgotPasswordCode } = authContext;

    // console.log('AuthContext completo:', authContext);
    // console.log('sendForgotPasswordCode:', sendForgotPasswordCode);

    const handleResetPass = async (values: FormValues) => {
        setLoading(true);
        try {
            if (!sendForgotPasswordCode) {
                console.error('sendForgotPasswordCode não está disponível no nomento, reinice o app!');
                Alert.alert('Erro', 'Função de recuperação de senha não disponível');
                return;
            }

            console.log('Chamando sendForgotPasswordCode com:', { email: values.email, activeTab });
            const result = await sendForgotPasswordCode(values.email, activeTab);
            console.log('Resultado:', result);

        } catch (error) {
            console.error('Erro no envio do código:', error);
            Alert.alert('Erro', 'Erro ao enviar código de recuperação');
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