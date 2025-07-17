'use client';

import React, { createContext, useContext, ReactNode } from 'react';
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
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlertContext must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
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