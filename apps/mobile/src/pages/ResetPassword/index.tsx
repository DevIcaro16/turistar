import React, { useRef, useState, useContext } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import api from "../../util/api/api";
import { AuthContext } from "../../contexts/auth";

type TypeUser = 'user' | 'driver';

export default function ResetPassword() {
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

    const renderAlert = () => (
        alertVisible && (
            <View style={{
                backgroundColor: alertType === 'success' ? '#bbf7d0' : '#fecaca',
                borderColor: alertType === 'success' ? '#3B82F6' : '#ef4444',
                borderWidth: 1,
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                alignItems: 'center',
            }}>
                <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: 16, marginBottom: 4 }}>{alertTitle}</Text>
                <Text style={{ color: '#1e293b', fontSize: 15 }}>{alertMessage}</Text>
            </View>
        )
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#f7fafc' }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.keyboardView, { justifyContent: 'center', flex: 1 }]}
            >
                <View style={[styles.header, { alignItems: 'center', marginBottom: 24 }]}>
                    <Text style={[styles.title, { fontSize: 32, color: '#1e293b', marginBottom: 8 }]}>Verifique o Código</Text>
                    <Text style={[styles.subtitle, { color: '#475569', fontSize: 16, textAlign: 'center' }]}>Digite o código de 4 dígitos enviado para seu e-mail</Text>
                </View>
                {renderAlert()}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
                    {code.map((digit, idx) => (
                        <TextInput
                            key={idx}
                            ref={inputRefs[idx]}
                            style={{
                                width: 56,
                                height: 56,
                                marginHorizontal: 8,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: '#3B82F6',
                                backgroundColor: '#fff',
                                textAlign: 'center',
                                fontSize: 28,
                                color: '#1e293b',
                                fontWeight: 'bold',
                                shadowColor: '#000',
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, idx)}
                            returnKeyType={idx === 3 ? 'done' : 'next'}
                            onSubmitEditing={handleSubmit}
                        />
                    ))}
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#3B82F6',
                        borderRadius: 8,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginHorizontal: 24,
                        marginBottom: 12,
                        shadowColor: '#3B82F6',
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Confirmar Código</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 16 }}>Voltar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}