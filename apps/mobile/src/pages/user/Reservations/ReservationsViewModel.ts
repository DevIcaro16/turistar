import { useEffect, useRef, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import api from '../../../util/api/api';
import { ReservationData, ConfirmAction } from './ReservationsModel';

export function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function useReservationsViewModel() {
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();


    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await api.get('user/reservations');
            const reservationsData = response.data.reservations || response.data || [];
            setReservations(reservationsData);
        } catch (error: any) {
            console.log('Erro ao buscar reservas:', error);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchReservations();

        intervalRef.current = setInterval(fetchReservations, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleOpenDetail = (reservation: ReservationData) => {
        setSelectedReservation(reservation);
        setDetailModalVisible(true);
    };

    const handleAction = (action: ConfirmAction) => {
        setConfirmAction(action);
        setConfirmModalVisible(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedReservation || !confirmAction) return;
        setActionLoading(true);

        if (confirmAction === 'confirm') {
            try {
                console.log('🔄 Iniciando pagamento para reserva:', selectedReservation.id);
                console.log('💰 Valor:', selectedReservation.amount);

                const paymentIntentRes = await api.post('/stripe/create-payment-intent', {
                    amount: (selectedReservation.amount * 100), //Valor normal fica em centavos, * 100 resolve
                    metadata: { reservationId: selectedReservation.id },
                });

                console.log('✅ PaymentIntent criado:', paymentIntentRes.data);
                const { clientSecret } = paymentIntentRes.data;

                if (!clientSecret) {
                    console.error('❌ ClientSecret não encontrado na resposta');
                    showAlert('Erro: ClientSecret não encontrado', 'error');
                    return;
                }

                console.log('🔄 Inicializando PaymentSheet...');
                const { error: initError } = await initPaymentSheet({
                    paymentIntentClientSecret: clientSecret,
                    merchantDisplayName: 'Turistar',
                });

                if (initError) {
                    console.error('❌ Erro ao inicializar PaymentSheet:', initError);
                    showAlert(`Erro ao inicializar pagamento: ${initError.message}`, 'error');
                    return;
                }

                console.log('✅ PaymentSheet inicializado com sucesso');
                console.log('🔄 Apresentando PaymentSheet...');

                const { error: presentError } = await presentPaymentSheet();

                if (presentError) {
                    console.error('❌ Erro ao apresentar PaymentSheet:', presentError);
                    showAlert(`Pagamento falhou: ${presentError.message}`, 'error');
                } else {
                    console.log('✅ Pagamento realizado com sucesso!');
                    showAlert('Pagamento confirmado com sucesso!');
                    setDetailModalVisible(false);
                    fetchReservations();
                }
            } catch (error: any) {
                console.error('❌ Erro geral no pagamento:', error);
                console.error('❌ Detalhes do erro:', error.response?.data);
                showAlert(error.response?.data?.message || 'Erro ao processar pagamento', 'error');
            }
        } else if (confirmAction === 'cancel') {
            try {
                await api.post(`user/reserve-cancellation`, {
                    ReserveId: selectedReservation.id
                });
                showAlert('Reserva cancelada com sucesso!');
                setDetailModalVisible(false);
                fetchReservations();
            } catch (error: any) {
                showAlert(error.response?.data?.message || 'Erro ao cancelar reserva', 'error');
            }
        }

        setActionLoading(false);
        setConfirmModalVisible(false);
        setConfirmAction(null);
    };

    return {
        reservations,
        loading,
        alertVisible,
        alertMessage,
        alertType,
        selectedReservation,
        detailModalVisible,
        actionLoading,
        confirmAction,
        confirmModalVisible,
        showAlert,
        fetchReservations,
        handleOpenDetail,
        handleAction,
        handleConfirmAction,
        setDetailModalVisible,
        setAlertVisible,
        setConfirmModalVisible,
    };
} 