import { useState, useEffect } from 'react';
import api from '../util/api/api';
import { useAuth } from '../contexts/AuthContext';

interface DriverMetrics {
    tourPackages?: {
        data: any[];
        count: number;
        completed: any[];
        active: any[];
    };
    reserves?: {
        data: any[];
        count: number;
    };
    touristPoints?: {
        data: any[];
        count: number;
    };
    wallet?: {
        balance: number;
        totalEarnings: number;
    };
    transactions?: {
        data: any[];
        count: number;
    };
}

export const useDriverMetrics = () => {
    const [metrics, setMetrics] = useState<DriverMetrics>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, userRole } = useAuth();

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);


            if (userRole !== 'driver') {
                setLoading(false);
                return;
            }

            const response = await api.get('driver/metrics/all', { withCredentials: true });

            if (response.data.success) {
                setMetrics(response.data.metrics);
            }
        } catch (err: any) {
            console.error('Erro ao buscar métricas do motorista:', err);
            setError(err.response?.data?.message || 'Erro ao carregar métricas');
        } finally {
            setLoading(false);
        }
    };

    // Métodos para buscar métricas individuais (caso necessário)
    const fetchTourPackages = async () => {
        const response = await api.get('driver/metrics/tour-packages');
        return response.data;
    };

    const fetchReserves = async () => {
        const response = await api.get('driver/metrics/reserves');
        return response.data;
    };

    const fetchTouristPoints = async () => {
        const response = await api.get('driver/metrics/tourist-points');
        return response.data;
    };

    const fetchWallet = async () => {
        const response = await api.get('driver/metrics/wallet');
        return response.data;
    };

    const fetchTransactions = async () => {
        const response = await api.get('driver/metrics/transactions');
        return response.data;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    return {
        metrics,
        loading,
        error,
        refetch: fetchMetrics,
        formatCurrency,
        // Métodos individuais
        fetchTourPackages,
        fetchReserves,
        fetchTouristPoints,
        fetchWallet,
        fetchTransactions
    };
}; 