import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4FF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    keyboardView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 26,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 4,
        marginBottom: 22,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#1E3A8A',
        fontWeight: '600',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
    },
    pickerContainer: {
        height: 44,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    picker: {
        height: 54,
        color: '#1F2937',
        fontSize: 16,
        bottom: 6
    },
    loginButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#3B82F6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0.1,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    linkText: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeButton: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
});