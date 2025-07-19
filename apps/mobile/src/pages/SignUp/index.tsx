import React, { useState, useContext } from "react";
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
    Alert,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { SignUpSchema } from "../../schemas/schema-yup";

type typeUser = 'user' | 'driver';

interface FormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    TransportType: string;
}

const transportOptions = [
    { label: 'Selecione um tipo', value: '' },
    { label: 'Buggy', value: 'BUGGY' },
    { label: 'Lancha', value: 'LANCHA' },
    { label: '4x4', value: 'FOUR_BY_FOUR' }
];

export default function SignUp() {
    const [activeTab, setActiveTab] = useState<typeUser>('user');
    const [loading, setLoading] = useState<boolean>(false);
    const [passVisible, setPassVisible] = useState<boolean>(false);
    const [passConfirmVisible, setPassConfirmVisible] = useState<boolean>(false);

    const { signUp, loadingAuth } = useContext(AuthContext);

    const navigator = useNavigation();

    const togglePassVisibility = () => {
        setPassVisible(!passVisible);
    }

    const togglePassConfirmVisibility = () => {
        setPassConfirmVisible(!passConfirmVisible);
    }

    const handleSignUp = async (values: FormValues) => {
        // Alert.alert('teste')
        setLoading(true);

        try {

            await signUp(
                values.name,
                values.email,
                values.phone,
                values.TransportType,
                values.password,
                activeTab
            );

        } catch (error) {
            console.error('Erro no cadastro:', error);
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
                            name: '',
                            email: '',
                            phone: '',
                            password: '',
                            password_confirmation: '',
                            TransportType: ''
                        }}
                        validationSchema={SignUpSchema}
                        onSubmit={handleSignUp}
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

                                {activeTab === 'driver' && (
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Tipo de Transporte</Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={values.TransportType}
                                                onValueChange={(itemValue) => setFieldValue('TransportType', itemValue)}
                                                style={styles.picker}
                                                mode="dropdown"
                                            >
                                                {transportOptions.map((option) => (
                                                    <Picker.Item
                                                        key={option.value}
                                                        label={option.label}
                                                        value={option.value}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        {touched.TransportType && errors.TransportType && (
                                            <Text style={styles.error}>{errors.TransportType}</Text>
                                        )}
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
                                    style={[styles.loginButton, (loading || loadingAuth || isSubmitting) && styles.loginButtonDisabled]}
                                    onPress={handleSubmit as any}
                                    disabled={loading || loadingAuth || isSubmitting}
                                >
                                    {(loading || loadingAuth || isSubmitting) ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>
                                            Cadastrar como {activeTab === 'user' ? 'Usuário' : 'Motorista'}
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <TouchableOpacity onPress={() => navigator.navigate('SignIn' as never)}>
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