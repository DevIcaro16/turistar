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
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import { SignInSchema } from "../../schemas/schema-yup";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';

type typeUser = 'user' | 'driver';

interface FormValues {
    email: string;
    password: string;
}

export default function SignIn() {
    const [activeTab, setActiveTab] = useState<typeUser>('user');
    const [loading, setLoading] = useState<boolean>(false);
    const [passVisible, setPassVisible] = useState<boolean>(false);

    const navigator = useNavigation();
    const { signIn, loadingAuth } = useContext(AuthContext);

    const toggleVisibility = () => {
        setPassVisible(!passVisible);
    }

    const handleLogin = async (values: FormValues) => {
        setLoading(true);
        // Alert.alert('LOGIN');
        try {
            await signIn(values.email, values.password, activeTab);
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Turistar</Text>
                    <Text style={styles.subtitle}>Faça login para continuar</Text>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'user' && styles.activeTab]}
                        onPress={() => setActiveTab('user')}
                    >
                        <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>
                            Usuário
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'driver' && styles.activeTab]}
                        onPress={() => setActiveTab('driver')}
                    >
                        <Text style={[styles.tabText, activeTab === 'driver' && styles.activeTabText]}>
                            Motorista
                        </Text>
                    </TouchableOpacity>
                </View>

                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validationSchema={SignInSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, isSubmitting, values, errors, touched }) => (
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite seu email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>{errors.email}</Text>
                                )}
                            </View>

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
                                        onPress={toggleVisibility}
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

                            <TouchableOpacity
                                style={[styles.loginButton, (loading || loadingAuth || isSubmitting) && styles.loginButtonDisabled]}
                                onPress={handleSubmit as any}
                                disabled={loading || loadingAuth || isSubmitting}
                            >
                                {(loading || loadingAuth || isSubmitting) ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.loginButtonText}>
                                        Entrar como {activeTab === 'user' ? 'Usuário' : 'Motorista'}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <TouchableOpacity onPress={() => navigator.navigate('SignUp' as never)}>
                                    <Text style={styles.footerText}>
                                        Não tem uma conta?
                                        <Text style={styles.linkText}> Cadastre-se</Text>
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => (navigator as any).navigate('ForgotPassword', { activeTab })} style={{ marginTop: 12 }}>
                                    <Text style={styles.footerText}>
                                        Esqueçeu sua Senha?
                                        <Text style={styles.linkText}> Recupere aqui</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}