import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import api from '../../../util/api/api';
import { ReservationData, TimelineStep } from './types';

export function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function getTourStatus(pkg: { isRunning: boolean; isFinalised: boolean }) {
    if (pkg.isFinalised) return 'Finalizado';
    if (pkg.isRunning) return 'Em andamento';
    return 'Pendente';
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
    }),
});

export function useMyToursViewModel() {
    const [tours, setTours] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState<ReservationData | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const appState = useRef(AppState.currentState);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchTours = async () => {
        try {
            const response = await api.get('/user/reservations');
            const reservations = response.data.reservations || [];
            setTours(reservations);
        } catch (error: any) {
            console.error('Erro ao buscar reservas:', error);
            showAlert('Erro ao carregar seus passeios', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                fetchTours();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    const handleOpenDetail = (tour: ReservationData) => {
        setSelectedTour(tour);
        setDetailModalVisible(true);
    };

    const handleCancelReservation = async (tour: ReservationData) => {
        try {
            await api.put(`/reservation/${tour.id}/cancel`);
            showAlert('Reserva cancelada com sucesso!');
            fetchTours();
        } catch (error: any) {
            showAlert(error.response?.data?.message || 'Erro ao cancelar reserva', 'error');
        }
    };

    return {
        tours,
        loading,
        selectedTour,
        detailModalVisible,
        alertVisible,
        alertMessage,
        alertType,
        showAlert,
        fetchTours,
        handleOpenDetail,
        handleCancelReservation,
        setDetailModalVisible,
        setAlertVisible,
    };
} 