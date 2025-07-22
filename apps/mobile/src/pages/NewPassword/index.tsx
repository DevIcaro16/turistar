import React, { useState, useContext } from "react";
import { Formik } from 'formik';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from "react-native";
import { AuthContext } from "../../contexts/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as yup from "yup";
import { SignInSchema } from "../../schemas/schema-yup";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import api from "../../util/api/api";
import { NewPasswordSchema } from "../../schemas/schema-newPassword";

type TypeUser = 'user' | 'driver';

interface FormValues {
    password: string;
    password_confirmation: string;
}

export default function NewPassword() {

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

    const renderAlert = () => (
        alertVisible && (
            <View style={{
                backgroundColor: alertType === 'success' ? '#bbf7d0' : alertType === 'error' ? '#fecaca' : '#fef9c3',
                borderColor: alertType === 'success' ? '#3B82F6' : alertType === 'error' ? '#ef4444' : '#eab308',
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
                    <Text style={[styles.title, { fontSize: 32, color: '#1e293b', marginBottom: 8 }]}>Recuperar Senha</Text>
                    <Text style={[styles.subtitle, { color: '#475569', fontSize: 16 }]}>Redefina sua senha agora</Text>
                </View>
                {renderAlert()}
                <Formik
                    initialValues={{
                        password: '',
                        password_confirmation: '',
                    }}
                    validationSchema={NewPasswordSchema}
                    onSubmit={handleResetPass}
                >
                    {({ handleChange, handleBlur, handleSubmit, isSubmitting, values, errors, touched }) => (
                        <View style={[styles.formContainer, { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }]}>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Senha</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Digite sua senha"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={!passVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={togglePassVisibility}
                                    >
                                        <Ionicons
                                            name={passVisible ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="#6B7280"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirmar Senha</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Confirme sua senha"
                                        value={values.password_confirmation}
                                        onChangeText={handleChange('password_confirmation')}
                                        onBlur={handleBlur('password_confirmation')}
                                        secureTextEntry={!passConfirmVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={togglePassConfirmVisibility}
                                    >
                                        <Ionicons
                                            name={passConfirmVisible ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="#6B7280"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {touched.password_confirmation && errors.password_confirmation && (
                                    <Text style={styles.error}>{errors.password_confirmation}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    { backgroundColor: '#3B82F6', borderRadius: 8, marginTop: 8 },
                                    (loading || loadingAuth || isSubmitting) && styles.loginButtonDisabled
                                ]}
                                onPress={handleSubmit as any}
                                disabled={loading || loadingAuth || isSubmitting}
                            >
                                {(loading || loadingAuth || isSubmitting) ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={[styles.loginButtonText, { fontWeight: 'bold', fontSize: 16 }]}>Redefinir Senha</Text>
                                )}
                            </TouchableOpacity>
                            <View style={[styles.footer, { marginTop: 24, alignItems: 'center' }]}>
                                <TouchableOpacity onPress={() => navigator.navigate('SignIn' as never)}>
                                    <Text style={[styles.footerText, { color: '#2563eb', fontWeight: 'bold' }]}>Voltar para Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}