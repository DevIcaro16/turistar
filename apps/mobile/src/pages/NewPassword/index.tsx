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
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import { NewPasswordSchema } from "../../schemas/schema-newPassword";
import NewPasswordViewModel from "./NewPasswordViewModel";

export default function NewPassword() {

    const newPasswordViewModel = NewPasswordViewModel();

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
                {newPasswordViewModel.alertVisible && (
                    <View style={{
                        backgroundColor: newPasswordViewModel.alertType === 'success' ? '#bbf7d0' : newPasswordViewModel.alertType === 'error' ? '#fecaca' : '#fef9c3',
                        borderColor: newPasswordViewModel.alertType === 'success' ? '#3B82F6' : newPasswordViewModel.alertType === 'error' ? '#ef4444' : '#eab308',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: 16, marginBottom: 4 }}>{newPasswordViewModel.alertTitle}</Text>
                        <Text style={{ color: '#1e293b', fontSize: 15 }}>{newPasswordViewModel.alertMessage}</Text>
                    </View>
                )}
                <Formik
                    initialValues={{
                        password: '',
                        password_confirmation: '',
                    }}
                    validationSchema={NewPasswordSchema}
                    onSubmit={newPasswordViewModel.handleResetPass}
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
                                        secureTextEntry={!newPasswordViewModel.passVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={newPasswordViewModel.togglePassVisibility}
                                    >
                                        <Ionicons
                                            name={newPasswordViewModel.passVisible ? 'eye-off' : 'eye'}
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
                                        secureTextEntry={!newPasswordViewModel.passConfirmVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={newPasswordViewModel.togglePassConfirmVisibility}
                                    >
                                        <Ionicons
                                            name={newPasswordViewModel.passConfirmVisible ? 'eye-off' : 'eye'}
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
                                    (newPasswordViewModel.loading || newPasswordViewModel.loadingAuth || isSubmitting) && styles.loginButtonDisabled
                                ]}
                                onPress={handleSubmit as any}
                                disabled={newPasswordViewModel.loading || newPasswordViewModel.loadingAuth || isSubmitting}
                            >
                                {(newPasswordViewModel.loading || newPasswordViewModel.loadingAuth || isSubmitting) ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={[styles.loginButtonText, { fontWeight: 'bold', fontSize: 16 }]}>Redefinir Senha</Text>
                                )}
                            </TouchableOpacity>
                            <View style={[styles.footer, { marginTop: 24, alignItems: 'center' }]}>
                                <TouchableOpacity onPress={newPasswordViewModel.goToSignIn}>
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