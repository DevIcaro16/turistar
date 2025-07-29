import { useState, useEffect } from 'react';
import api from '../util/api/api';
import { useAuth } from '../lib/auth';
import { useAlertContext } from '../components/AlertProvider';

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
    const { showError } = useAlertContext();

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
                const errorMessage = 'Resposta do servidor não foi bem-sucedida';
                setError(errorMessage);
                showError('Erro ao carregar métricas', errorMessage);
            }
        } catch (err: any) {
            console.error('Erro ao buscar métricas do motorista:', err);
            const errorMessage = err.response?.data?.message || 'Erro ao carregar métricas';
            setError(errorMessage);
            showError('Erro ao carregar métricas', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Métodos para buscar métricas individuais (caso necessário)
    const fetchTourPackages = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const response = await api.get('driver/metrics/tour-packages');
            return response.data;
        } catch (error) {
            showError('Erro ao carregar pacotes', 'Falha ao carregar dados dos pacotes de passeio.');
            return null;
        }
    };

    const fetchReserves = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const response = await api.get('driver/metrics/reserves');
            return response.data;
        } catch (error) {
            showError('Erro ao carregar reservas', 'Falha ao carregar dados das reservas.');
            return null;
        }
    };

    const fetchTouristPoints = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const response = await api.get('driver/metrics/tourist-points');
            return response.data;
        } catch (error) {
            showError('Erro ao carregar pontos turísticos', 'Falha ao carregar dados dos pontos turísticos.');
            return null;
        }
    };

    const fetchWallet = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const response = await api.get('driver/metrics/wallet');
            return response.data;
        } catch (error) {
            showError('Erro ao carregar carteira', 'Falha ao carregar dados da carteira.');
            return null;
        }
    };

    const fetchTransactions = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const response = await api.get('driver/metrics/transactions');
            return response.data;
        } catch (error) {
            showError('Erro ao carregar transações', 'Falha ao carregar dados das transações.');
            return null;
        }
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
        fetchTourPackages,
        fetchReserves,
        fetchTouristPoints,
        fetchWallet,
        fetchTransactions
    };
}; 