import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../../../contexts/auth';
import AlertComponent from '../../../components/AlertComponent';
import api from '../../../util/api/api';
import { TourData } from './types';

export function formatDate(date: Date | string) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date | string) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function useToursViewModel() {
    const { user } = useContext<any>(AuthContext);
    const [tours, setTours] = useState<TourData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTour, setSelectedTour] = useState<TourData | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchTours = async () => {
        try {
            const response = await api.get(`/TourPackage/driver/${user.id}`);
            setTours(response.data.tourPackages || []);
        } catch (error: any) {
            console.error('Erro ao buscar passeios do motorista: ', error);
            showAlert('Erro ao carregar passeios do motorista', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTours();
    };

    const handleStartTour = async (tour: TourData) => {
        Alert.alert(
            'Iniciar Passeio',
            `Deseja iniciar o passeio "${tour.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Iniciar',
                    style: 'default',
                    onPress: async () => {
                        if (tour.vacancies === tour.seatsAvailable) {
                            Alert.alert(
                                'Nenhuma vaga vendida',
                                'Nenhuma vaga foi vendida ainda. Deseja iniciar o passeio mesmo assim?',
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    {
                                        text: 'Iniciar',
                                        style: 'default',
                                        onPress: async () => {
                                            try {
                                                await api.put(`/TourPackage/${tour.id}/start`);
                                                showAlert('Passeio iniciado com sucesso!');
                                                fetchTours();
                                            } catch (error: any) {
                                                showAlert(error.response?.data?.message || 'Erro ao iniciar passeio', 'error');
                                            }
                                        }
                                    }
                                ]
                            );
                        } else {
                            try {
                                await api.put(`/TourPackage/${tour.id}/start`);
                                showAlert('Passeio iniciado com sucesso!');
                                fetchTours();
                            } catch (error: any) {
                                showAlert(error.response?.data?.message || 'Erro ao iniciar passeio', 'error');
                            }
                        }
                    }
                }
            ]
        );
    };

    const handleFinishTour = async (tour: TourData) => {
        Alert.alert(
            'Finalizar Passeio',
            `Deseja finalizar o passeio "${tour.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Finalizar',
                    style: 'default',
                    onPress: async () => {
                        try {
                            await api.put(`/TourPackage/${tour.id}/finish`);
                            showAlert('Passeio finalizado com sucesso!');
                            fetchTours();
                        } catch (error: any) {
                            showAlert(error.response?.data?.message || 'Erro ao finalizar passeio', 'error');
                        }
                    }
                }
            ]
        );
    };

    const openTourDetails = (tour: TourData) => {
        setSelectedTour(tour);
        setModalVisible(true);
    };

    const getStatusColor = (tour: TourData) => {
        if (tour.isFinalised) return '#34C759';
        if (tour.isRunning) return '#FF9500';
        return '#007AFF';
    };

    const getStatusText = (tour: TourData) => {
        if (tour.isFinalised) return 'Finalizado';
        if (tour.isRunning) return 'Em andamento';
        return 'Aguardando';
    };

    return {
        tours,
        loading,
        refreshing,
        modalVisible,
        selectedTour,
        alertVisible,
        alertMessage,
        alertType,
        showAlert,
        fetchTours,
        onRefresh,
        handleStartTour,
        handleFinishTour,
        openTourDetails,
        getStatusColor,
        getStatusText,
        setModalVisible,
        setAlertVisible,
    };
} 