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
import ResetPasswordViewModel from "./ResetPasswordViewModel";


export default function ResetPassword() {

    const resetPasswordViewModel = ResetPasswordViewModel();

    const renderAlert = () => (
        resetPasswordViewModel.alertVisible && (
            <View style={{
                backgroundColor: resetPasswordViewModel.alertType === 'success' ? '#bbf7d0' : '#fecaca',
                borderColor: resetPasswordViewModel.alertType === 'success' ? '#3B82F6' : '#ef4444',
                borderWidth: 1,
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                alignItems: 'center',
            }}>
                <Text style={{ fontWeight: 'bold', color: '#1e293b', fontSize: 16, marginBottom: 4 }}>{resetPasswordViewModel.alertTitle}</Text>
                <Text style={{ color: '#1e293b', fontSize: 15 }}>{resetPasswordViewModel.alertMessage}</Text>
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
                    {resetPasswordViewModel.code.map((digit, idx) => (
                        <TextInput
                            key={idx}
                            ref={resetPasswordViewModel.inputRefs[idx]}
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
                            onChangeText={(text) => resetPasswordViewModel.handleChange(text, idx)}
                            returnKeyType={idx === 3 ? 'done' : 'next'}
                            onSubmitEditing={resetPasswordViewModel.handleSubmit}
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
                    onPress={resetPasswordViewModel.handleSubmit}
                    disabled={resetPasswordViewModel.loading}
                >
                    {resetPasswordViewModel.loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Confirmar Código</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={resetPasswordViewModel.goToback} style={{ alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 16 }}>Voltar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}