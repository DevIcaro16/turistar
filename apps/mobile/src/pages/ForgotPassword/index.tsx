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
import { ForgotPasswordSchema } from "../../schemas/schema-forgotpassword";
import { ForgotPasswordViewModel } from "./ForgotPasswordViewModel";

export default function ForgotPassword() {

    const forgotPasswordViewModel = ForgotPasswordViewModel();

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
                    onSubmit={forgotPasswordViewModel.handleResetPass}
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
                                        (forgotPasswordViewModel.loading || forgotPasswordViewModel.loadingAuth || isSubmitting) && styles.loginButtonDisabled
                                    ]}
                                    onPress={() => handleSubmit()}
                                    disabled={forgotPasswordViewModel.loading || forgotPasswordViewModel.loadingAuth || isSubmitting}
                                >
                                    {(forgotPasswordViewModel.loading || forgotPasswordViewModel.loadingAuth || isSubmitting) ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={[styles.loginButtonText, { fontWeight: 'bold', fontSize: 16 }]}>
                                            Verificar Email como
                                            {
                                                forgotPasswordViewModel.userType === "driver" ? " Motorista" : " Usuário"
                                            }
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <View style={[styles.footer, { marginTop: 24, alignItems: 'center' }]}>
                                    <TouchableOpacity onPress={forgotPasswordViewModel.goToSignIn}>
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