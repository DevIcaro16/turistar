'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AlertComponent from './AlertComponent';
import { useAlert } from '../hooks/useAlert';

interface AlertContextType {
    showAlert: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showWarning: (title: string, message: string) => void;
    showInfo: (title: string, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
    const [mounted, setMounted] = useState(false);
    const context = useContext(AlertContext);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !context) {
        // Valores padrão seguros para SSR
        return {
            showAlert: () => {
                // Método vazio durante SSR
            },
            showSuccess: () => {
                // Método vazio durante SSR
            },
            showError: () => {
                // Método vazio durante SSR
            },
            showWarning: () => {
                // Método vazio durante SSR
            },
            showInfo: () => {
                // Método vazio durante SSR
            },
        };
    }

    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

// Wrapper para verificar se está no cliente
const ClientOnlyAlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Renderizar apenas children durante SSR
        return <>{children}</>;
    }

    return <AlertProviderInner>{children}</AlertProviderInner>;
};

// Provider interno que só roda no cliente
const AlertProviderInner: React.FC<AlertProviderProps> = ({ children }) => {
    const { alert, showAlert, hideAlert, showSuccess, showError, showWarning, showInfo } = useAlert();

    const value = {
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
            <AlertComponent
                visible={alert.visible}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={hideAlert}
                autoClose={true}
                autoCloseTime={4000}
            />
        </AlertContext.Provider>
    );
};

// Exportar o wrapper como AlertProvider
export const AlertProvider = ClientOnlyAlertProvider; 