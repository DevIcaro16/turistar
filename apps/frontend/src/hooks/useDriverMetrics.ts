import { useState, useEffect } from 'react';
import api from '../util/api/api';
import { useAuth } from '../lib/auth';

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
    const { user, userRole } = useAuth();

    const [metrics, setMetrics] = useState<DriverMetrics>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchMetrics = async () => {
        if (!mounted) return;

        try {
            setLoading(true);
            setError(null);

            if (userRole !== 'driver') {
                // console.log('useDriverMetrics: Usuário não é driver, role:', userRole);
                setLoading(false);
                return;
            }

            // console.log('useDriverMetrics: Buscando métricas para driver...');
            const response = await api.get('driver/metrics/all', { withCredentials: true });
            // console.log('useDriverMetrics: Resposta:', response.data);

            if (response.data.success) {
                setMetrics(response.data.metrics);
            } else {
                console.error('useDriverMetrics: Resposta não foi bem-sucedida:', response.data);
                setError('Resposta do servidor não foi bem-sucedida');
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
        if (typeof window === 'undefined') return null;
        const response = await api.get('driver/metrics/tour-packages');
        return response.data;
    };

    const fetchReserves = async () => {
        if (typeof window === 'undefined') return null;
        const response = await api.get('driver/metrics/reserves');
        return response.data;
    };

    const fetchTouristPoints = async () => {
        if (typeof window === 'undefined') return null;
        const response = await api.get('driver/metrics/tourist-points');
        return response.data;
    };

    const fetchWallet = async () => {
        if (typeof window === 'undefined') return null;
        const response = await api.get('driver/metrics/wallet');
        return response.data;
    };

    const fetchTransactions = async () => {
        if (typeof window === 'undefined') return null;
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
        if (mounted && userRole === 'driver') {
            fetchMetrics();
        }
    }, [mounted, userRole]);

    return {
        metrics,
        loading: !mounted || loading,
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