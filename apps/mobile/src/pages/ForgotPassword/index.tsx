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
import { SignInSchema } from "../../schemas/schema-yup";
import { styles } from "./styles";
import { ForgotPasswordSchema } from "../../schemas/schema-forgotpassword";

type TypeUser = 'user' | 'driver';

interface FormValues {
    email: string;
}

export default function ForgotPassword() {

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


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#f7fafc' }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.keyboardView, { justifyContent: 'center', flex: 1 }]}
            >
                <View style={[styles.header, { alignItems: 'center', marginBottom: 24 }]}>
                    <Text style={[styles.title, { fontSize: 32, color: '#1e293b', marginBottom: 8 }]}>Recuperar Senha</Text>
                    <Text style={[styles.subtitle, { color: '#475569', fontSize: 16 }]}>Digite seu email para redefinir sua senha</Text>
                </View>

                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={handleResetPass}
                // onSubmit={() => Alert.alert('testeeee')}
                >
                    {
                        ({ handleChange, handleBlur, handleSubmit, isSubmitting, values, errors, touched }) => (
                            <View style={[styles.formContainer, { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }]}>
                                <View style={[styles.inputContainer, { marginBottom: 18 }]}>
                                    <Text style={[styles.label, { color: '#1e293b', fontWeight: 'bold' }]}>Email</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }]}
                                        placeholder="Digite seu email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={[styles.error, { color: '#ef4444' }]}>{errors.email}</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.loginButton,
                                        { backgroundColor: '#3B82F6', borderRadius: 8, marginTop: 8 },
                                        (loading || loadingAuth || isSubmitting) && styles.loginButtonDisabled
                                    ]}
                                    onPress={() => handleSubmit()}
                                    // onPress={() => Alert.alert('teste')}
                                    disabled={loading || loadingAuth || isSubmitting}
                                >
                                    {(loading || loadingAuth || isSubmitting) ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={[styles.loginButtonText, { fontWeight: 'bold', fontSize: 16 }]}>
                                            Verificar Email como
                                            {
                                                userType === "driver" ? " Motorista" : " Usuário"
                                            }
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <View style={[styles.footer, { marginTop: 24, alignItems: 'center' }]}>
                                    <TouchableOpacity onPress={() => navigator.navigate('SignIn' as never)}>
                                        <Text style={[styles.footerText, { color: '#2563eb', fontWeight: 'bold' }]}>
                                            Voltar para Login
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )
                    }
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}