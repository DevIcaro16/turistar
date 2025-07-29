import { useState, useEffect } from 'react';
import api from '../util/api/api';
import { useAuth } from '../lib/auth';
import { useAlertContext } from '../components/AlertProvider';

interface Metrics {
    users?: { count: number };
    drivers?: { count: number };
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
    touristPoints?: { count: number };
    platformRevenue?: { value: number };
    transactions?: {
        data: any[];
        count: number;
    };
}

export const useMetrics = () => {
    const { user, userRole } = useAuth();
    const { showError } = useAlertContext();

    const [metrics, setMetrics] = useState<Metrics>({});
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

            if (userRole !== 'admin') {
                // console.log('useMetrics: Usuário não é admin, role:', userRole);
                setLoading(false);
                return;
            }

            // console.log('useMetrics: Buscando métricas para admin...');
            const response = await api.get('admin/metrics/all', { withCredentials: true });
            // console.log('useMetrics: Resposta:', response.data);

            if (response.data.success) {
                setMetrics(response.data.metrics);
            } else {
                console.error('useMetrics: Resposta não foi bem-sucedida:', response.data);
                const errorMessage = 'Resposta do servidor não foi bem-sucedida';
                setError(errorMessage);
                showError('Erro ao carregar métricas', errorMessage);
            }
        } catch (err: any) {
            console.error('Erro ao buscar métricas:', err);
            const errorMessage = err.response?.data?.message || 'Erro ao carregar métricas';
            setError(errorMessage);
            showError('Erro ao carregar métricas', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Métodos para buscar métricas individuais (caso necessário)
    const fetchUsers = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar usuários', 'Falha ao carregar dados dos usuários.');
            return null;
        }
    };

    const fetchDrivers = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/drivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar motoristas', 'Falha ao carregar dados dos motoristas.');
            return null;
        }
    };

    const fetchTourPackages = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/tour-packages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar pacotes', 'Falha ao carregar dados dos pacotes de passeio.');
            return null;
        }
    };

    const fetchReserves = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/reserves', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar reservas', 'Falha ao carregar dados das reservas.');
            return null;
        }
    };

    const fetchTouristPoints = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/tourist-points', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar pontos turísticos', 'Falha ao carregar dados dos pontos turísticos.');
            return null;
        }
    };

    const fetchPlatformRevenue = async () => {
        if (typeof window === 'undefined') return null;
        try {
            const token = localStorage.getItem('@token');
            const response = await api.get('admin/metrics/platform-revenue', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            showError('Erro ao carregar receita', 'Falha ao carregar dados da receita da plataforma.');
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
        if (mounted && userRole === 'admin') {
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
        fetchUsers,
        fetchDrivers,
        fetchTourPackages,
        fetchReserves,
        fetchTouristPoints,
        fetchPlatformRevenue
    };
}; 