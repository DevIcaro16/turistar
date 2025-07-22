import { useState, useEffect } from 'react';
import api from '../util/api/api';
import { useAuth } from '../contexts/AuthContext';

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

    const [metrics, setMetrics] = useState<Metrics>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, userRole } = useAuth();

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);


            if (userRole !== 'admin') {
                setLoading(false);
                return;
            }

            const response = await api.get('admin/metrics/all', { withCredentials: true });

            if (response.data.success) {
                setMetrics(response.data.metrics);
            }
        } catch (err: any) {
            console.error('Erro ao buscar métricas:', err);
            setError(err.response?.data?.message || 'Erro ao carregar métricas');
        } finally {
            setLoading(false);
        }
    };

    // Métodos para buscar métricas individuais (caso necessário)
    const fetchUsers = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const fetchDrivers = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/drivers', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const fetchTourPackages = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/tour-packages', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const fetchReserves = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/reserves', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const fetchTouristPoints = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/tourist-points', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const fetchPlatformRevenue = async () => {
        const token = localStorage.getItem('@token');
        const response = await api.get('admin/metrics/platform-revenue', {
            headers: { Authorization: `Bearer ${token}` }
        });
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
        fetchUsers,
        fetchDrivers,
        fetchTourPackages,
        fetchReserves,
        fetchTouristPoints,
        fetchPlatformRevenue
    };
}; 