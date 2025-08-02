import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import api from '../../../util/api/api';
import { ReservationData, TimelineStep } from './MyToursModel';

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
    const previousToursRef = useRef<ReservationData[]>([]);

    // Solicitar permissões de notificação
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão de notificação não concedida');
            }
        };
        requestPermissions();

        // Configurar listener de notificações
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notificação recebida:', notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Resposta da notificação:', response);
            // Aqui você pode navegar para a tela de detalhes do passeio
            const tourId = response.notification.request.content.data?.tourId;
            if (tourId) {
                // Navegar para detalhes do passeio
                console.log('Navegar para passeio:', tourId);
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const checkStatusChanges = (newTours: ReservationData[], oldTours: ReservationData[]) => {
        const changes: Array<{ tour: ReservationData; oldStatus: string; newStatus: string }> = [];

        newTours.forEach(newTour => {
            const oldTour = oldTours.find(t => t.id === newTour.id);
            if (oldTour) {
                const oldStatus = getTourStatus(oldTour.tourPackage);
                const newStatus = getTourStatus(newTour.tourPackage);

                if (oldStatus !== newStatus) {
                    changes.push({
                        tour: newTour,
                        oldStatus,
                        newStatus
                    });
                }
            }
        });

        return changes;
    };

    const sendStatusNotification = async (tour: ReservationData, oldStatus: string, newStatus: string) => {
        const statusMessages = {
            'Pendente': 'Seu passeio está pendente',
            'Em andamento': 'Seu passeio começou! 🚀',
            'Finalizado': 'Seu passeio foi finalizado! ✅'
        };

        const statusEmojis = {
            'Pendente': '⏳',
            'Em andamento': '🚀',
            'Finalizado': '✅'
        };

        const message = statusMessages[newStatus as keyof typeof statusMessages] || `Status alterado para: ${newStatus}`;
        const emoji = statusEmojis[newStatus as keyof typeof statusEmojis] || '📢';

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${emoji} Status do Passeio: ${tour.tourPackage.title}`,
                body: `${message}\n\n${tour.tourPackage.origin_local} → ${tour.tourPackage.destiny_local}`,
                data: {
                    tourId: tour.id,
                    oldStatus,
                    newStatus,
                    tourTitle: tour.tourPackage.title,
                    origin: tour.tourPackage.origin_local,
                    destiny: tour.tourPackage.destiny_local
                },
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // Enviar imediatamente
        });

        console.log(`Notificação enviada: ${oldStatus} → ${newStatus} para ${tour.tourPackage.title}`);
    };

    const fetchTours = async () => {
        try {
            const response = await api.get('/user/reservations');
            const reservations = response.data.reservations || [];

            // Verificar mudanças de status
            if (previousToursRef.current.length > 0) {
                const statusChanges = checkStatusChanges(reservations, previousToursRef.current);

                // Enviar notificações para mudanças de status
                for (const change of statusChanges) {
                    await sendStatusNotification(change.tour, change.oldStatus, change.newStatus);
                }
            }

            previousToursRef.current = reservations;
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

        // Verificar mudanças de status a cada 30 segundos
        const statusCheckInterval = setInterval(() => {
            fetchTours();
        }, 30000);

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                fetchTours();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription?.remove();
            clearInterval(statusCheckInterval);
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