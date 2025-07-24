import React from "react";
import { TextInputMask } from 'react-native-masked-text';
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
    ScrollView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";
import { SignUpSchema } from "../../schemas/schema-yup";
import { useSignUpViewModel } from "./SignUpViewModel";

export default function SignUp() {
    const signUpViewModel = useSignUpViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Turistar</Text>
                        <Text style={styles.subtitle}>Cadastra-se em nossa plataforma!</Text>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, signUpViewModel.activeTab === 'user' && styles.activeTab]}
                            onPress={() => signUpViewModel.setActiveTab('user')}
                        >
                            <Text style={[styles.tabText, signUpViewModel.activeTab === 'user' && styles.activeTabText]}>
                                Usuário
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, signUpViewModel.activeTab === 'driver' && styles.activeTab]}
                            onPress={() => signUpViewModel.setActiveTab('driver')}
                        >
                            <Text style={[styles.tabText, signUpViewModel.activeTab === 'driver' && styles.activeTabText]}>
                                Motorista
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Formik
                        initialValues={signUpViewModel.initialValues}
                        validationSchema={SignUpSchema}
                        onSubmit={signUpViewModel.handleSignUp}
                        context={{ $activeTab: signUpViewModel.activeTab }}

                    >
                        {({ handleChange, handleBlur, handleSubmit, isSubmitting, values, errors, touched, setFieldValue }) => (
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Nome</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu Nome"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        keyboardType="default"
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.error}>{errors.name}</Text>
                                    )}
                                </View>

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
                                    <Text style={styles.label}>Telefone</Text>
                                    <TextInputMask
                                        type={'cel-phone'}
                                        options={{
                                            maskType: 'BRL',
                                            withDDD: true,
                                            dddMask: '(99) '
                                        }}
                                        style={styles.input}
                                        placeholder="Digite seu Telefone"
                                        value={values.phone}
                                        maxLength={16}
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {touched.phone && errors.phone && (
                                        <Text style={styles.error}>{errors.phone}</Text>
                                    )}
                                </View>

                                {signUpViewModel.activeTab === 'driver' && (
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Tipo de Transporte</Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={values.TransportType}
                                                onValueChange={(itemValue) => setFieldValue('TransportType', itemValue)}
                                                style={styles.picker}
                                                mode="dropdown"
                                            >
                                                {signUpViewModel.transportOptions.map((option) => (
                                                    <Picker.Item
                                                        key={option.value}
                                                        label={option.label}
                                                        value={option.value}
                                                    />
                                                ))}
                                            </Picker>
                                            {touched.TransportType && errors.TransportType && (
                                                <Text style={styles.error}>{errors.TransportType}</Text>
                                            )}
                                        </View>
                                    </View>
                                )}

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Senha</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            placeholder="Digite sua senha"
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            secureTextEntry={!signUpViewModel.passVisible}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeButton}
                                            onPress={signUpViewModel.togglePassVisibility}
                                        >
                                            <Ionicons
                                                name={signUpViewModel.passVisible ? 'eye-off' : 'eye'}
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
                                            secureTextEntry={!signUpViewModel.passConfirmVisible}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeButton}
                                            onPress={signUpViewModel.togglePassConfirmVisibility}
                                        >
                                            <Ionicons
                                                name={signUpViewModel.passConfirmVisible ? 'eye-off' : 'eye'}
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
                                    style={[styles.loginButton, (signUpViewModel.loading || signUpViewModel.loadingAuth || isSubmitting) && styles.loginButtonDisabled]}
                                    onPress={handleSubmit as any}
                                    disabled={signUpViewModel.loading || signUpViewModel.loadingAuth || isSubmitting}
                                >
                                    {(signUpViewModel.loading || signUpViewModel.loadingAuth || isSubmitting) ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>
                                            Cadastrar como {signUpViewModel.activeTab === 'user' ? 'Usuário' : 'Motorista'}
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <TouchableOpacity onPress={signUpViewModel.goToSignIn}>
                                        <Text style={styles.footerText}>
                                            Já possui uma conta?
                                            <Text style={styles.linkText}> Entre</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}