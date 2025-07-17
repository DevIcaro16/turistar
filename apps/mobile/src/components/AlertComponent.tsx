import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertComponentProps {
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose: () => void;
    showCloseButton?: boolean;
    autoClose?: boolean;
    autoCloseTime?: number;
}

const { width } = Dimensions.get('window');

export default function AlertComponent({
    visible,
    type,
    title,
    message,
    onClose,
    showCloseButton = true,
    autoClose = false,
    autoCloseTime = 3000
}: AlertComponentProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            // Animação de entrada
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto close se habilitado
            if (autoClose) {
                const timer = setTimeout(() => {
                    handleClose();
                }, autoCloseTime);

                return () => clearTimeout(timer);
            }
        } else {
            // Animação de saída
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        onClose();
    };

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'close-circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'information-circle';
            default:
                return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'error':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            case 'info':
                return '#3B82F6';
            default:
                return '#3B82F6';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#ECFDF5';
            case 'error':
                return '#FEF2F2';
            case 'warning':
                return '#FFFBEB';
            case 'info':
                return '#EFF6FF';
            default:
                return '#EFF6FF';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return '#D1FAE5';
            case 'error':
                return '#FECACA';
            case 'warning':
                return '#FED7AA';
            case 'info':
                return '#DBEAFE';
            default:
                return '#DBEAFE';
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.alertContainer,
                        {
                            backgroundColor: getBackgroundColor(),
                            borderColor: getBorderColor(),
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={getIconName() as any}
                            size={24}
                            color={getIconColor()}
                        />
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {showCloseButton && (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
    },
    alertContainer: {
        width: width - 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    iconContainer: {
        marginRight: 16,
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 12,
        marginTop: 2,
    },
});