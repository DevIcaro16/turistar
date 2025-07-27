'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

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
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 200); // Aguarda a animação de saída
    }, [onClose]);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);

            // Auto close se habilitado
            if (autoClose) {
                const timer = setTimeout(() => {
                    handleClose();
                }, autoCloseTime);

                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }

        // Retorna undefined para casos onde não há cleanup
        return undefined;
    }, [visible, autoClose, autoCloseTime, handleClose]);

    const getIcon = (): React.ReactElement => {
        const iconClass = "w-6 h-6";
        switch (type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-green-500`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-500`} />;
            case 'warning':
                return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
            case 'info':
                return <Info className={`${iconClass} text-blue-500`} />;
            default:
                return <Info className={`${iconClass} text-blue-500`} />;
        }
    };

    const getBackgroundColor = (): string => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

            <div
                className={`
                    relative max-w-md w-full bg-white rounded-lg border shadow-lg
                    transform transition-all duration-300 ease-in-out
                    ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
                    ${getBackgroundColor()}
                `}
            >
                <div className="flex items-start p-4">
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                        {getIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {message}
                        </p>
                    </div>

                    {showCloseButton && (
                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 ml-3 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Fechar"
                            aria-label="Fechar alerta"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 