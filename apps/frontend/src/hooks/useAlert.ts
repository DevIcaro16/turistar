import { useState, useCallback } from 'react';

interface AlertState {
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

export const useAlert = () => {
    const [alert, setAlert] = useState<AlertState>({
        visible: false,
        type: 'info',
        title: '',
        message: ''
    });

    const showAlert = useCallback((
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string
    ) => {
        setAlert({
            visible: true,
            type,
            title,
            message
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(prev => ({
            ...prev,
            visible: false
        }));
    }, []);

    const showSuccess = useCallback((title: string, message: string) => {
        showAlert('success', title, message);
    }, [showAlert]);

    const showError = useCallback((title: string, message: string) => {
        showAlert('error', title, message);
    }, [showAlert]);

    const showWarning = useCallback((title: string, message: string) => {
        showAlert('warning', title, message);
    }, [showAlert]);

    const showInfo = useCallback((title: string, message: string) => {
        showAlert('info', title, message);
    }, [showAlert]);

    return {
        alert,
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
}; 