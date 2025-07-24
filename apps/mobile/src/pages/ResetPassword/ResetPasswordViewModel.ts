import { useNavigation, useRoute } from "@react-navigation/native";
import { TypeUser } from "./types";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth";

export default function ResetPasswordViewModel() {
    const navigation = useNavigation();
    const route = useRoute();
    const { email = "", activeTab = "" }: any = route.params || {};
    const userType = (activeTab as TypeUser);
    const [code, setCode] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const { verifyForgotPasswordCode } = useContext(AuthContext);

    const showAlert = (type: 'success' | 'error', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 2500);
    };

    const handleChange = (text: string, idx: number) => {
        if (/^\d?$/.test(text)) {
            const newCode = [...code];
            newCode[idx] = text;
            setCode(newCode);
            if (text && idx < 3) {
                // @ts-expect-error: inputRefs type is not strongly typed
                inputRefs[idx + 1].current.focus();
            }
            if (!text && idx > 0) {
                // @ts-expect-error: inputRefs type is not strongly typed
                inputRefs[idx - 1].current.focus();
            }
        }
    };

    const handleSubmit = async () => {
        if (code.some((c) => c === "")) {
            showAlert('error', 'Código incompleto', 'Digite os 4 dígitos do código enviado por e-mail.');
            return;
        }
        setLoading(true);
        try {
            const otp = code.join("");
            const result = await verifyForgotPasswordCode(email, otp, activeTab);
            if (result.success) {
                setTimeout(() => {
                    (navigation as any).navigate('NewPassword' as never, { email, activeTab } as any);
                }, 1200);
            }
        } catch (err: any) {
            console.log(`Erro: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const goToback = () => navigation.goBack();

    return {
        code,
        alertVisible,
        loading,
        alertType,
        alertTitle,
        alertMessage,
        handleSubmit,
        handleChange,
        inputRefs,
        goToback
    };
}