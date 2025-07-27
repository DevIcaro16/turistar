import React from "react";
import { Formik } from 'formik';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useSignInViewModel } from "./SignInViewModel";
import { SignInSchema } from "./SignInModel";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {

    const signInViewModel = useSignInViewModel();

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
                        style={[styles.tab, signInViewModel.activeTab === 'user' && styles.activeTab]}
                        onPress={() => signInViewModel.setActiveTab('user')}
                    >
                        <Text style={[styles.tabText, signInViewModel.activeTab === 'user' && styles.activeTabText]}>
                            Usuário
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, signInViewModel.activeTab === 'driver' && styles.activeTab]}
                        onPress={() => signInViewModel.setActiveTab('driver')}
                    >
                        <Text style={[styles.tabText, signInViewModel.activeTab === 'driver' && styles.activeTabText]}>
                            Motorista
                        </Text>
                    </TouchableOpacity>
                </View>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={SignInSchema}
                    onSubmit={signInViewModel.handleLogin}
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
                                        secureTextEntry={!signInViewModel.passVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={signInViewModel.toggleVisibility}
                                    >
                                        <Ionicons
                                            name={signInViewModel.passVisible ? 'eye-off' : 'eye'}
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
                                style={[styles.loginButton, (signInViewModel.loading || signInViewModel.loadingAuth || isSubmitting) && styles.loginButtonDisabled]}
                                onPress={handleSubmit as any}
                                disabled={signInViewModel.loading || signInViewModel.loadingAuth || isSubmitting}
                            >
                                {(signInViewModel.loading || signInViewModel.loadingAuth || isSubmitting) ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.loginButtonText}>
                                        Entrar como {signInViewModel.activeTab === 'user' ? 'Usuário' : 'Motorista'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <View style={styles.footer}>
                                <TouchableOpacity onPress={signInViewModel.goToSignUp}>
                                    <Text style={styles.footerText}>
                                        Não tem uma conta?
                                        <Text style={styles.linkText}> Cadastre-se</Text>
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={signInViewModel.goToForgotPassword} style={{ marginTop: 12 }}>
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