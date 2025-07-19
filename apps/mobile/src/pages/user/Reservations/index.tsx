import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import styles from './styles';
import api from '../../../util/api/api';
import AlertComponent from '../../../components/AlertComponent';

interface ReservationData {
    id: string;
    amount: number;
    vacancies_reserved: number;
    confirmed: boolean;
    canceled: boolean;
    createdAt: string;
    tourPackage: {
        id: string;
        title: string;
        origin_local: string;
        destiny_local: string;
        date_tour: string;
        price: number;
        car: {
            type: string;
            model: string;
            image?: string;
            driver?: { name: string; image?: string };
        };
    };
}

function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export default function UserReservations() {

    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'confirm' | 'cancel' | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchReservations();

        intervalRef.current = setInterval(fetchReservations, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

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

    const handleOpenDetail = (reservation: ReservationData) => {
        setSelectedReservation(reservation);
        setDetailModalVisible(true);
    };

    const handleAction = (action: 'confirm' | 'cancel') => {
        setConfirmAction(action);
        setConfirmModalVisible(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedReservation || !confirmAction) return;
        setActionLoading(true);
        try {
            if (confirmAction === 'confirm') {
                await api.post('/user/reserve-confirmation', { ReserveId: selectedReservation.id });
                setAlertMessage('Reserva confirmada com sucesso!');
                setAlertType('success');
            } else {
                await api.post('user/reserve-cancellation', { ReserveId: selectedReservation.id });
                setAlertMessage('Reserva cancelada e valor estornado!');
                setAlertType('success');
            }
            setAlertVisible(true);
            fetchReservations();
        } catch (error: any) {
            setAlertMessage(error.response?.data?.message || 'Erro ao processar ação');
            setAlertType('error');
            setAlertVisible(true);
        } finally {
            setActionLoading(false);
            setConfirmModalVisible(false);
            setDetailModalVisible(false);
            setConfirmAction(null);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando reservas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Reservas</Text>
            <FlatList
                data={reservations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => handleOpenDetail(item)}
                    >
                        <Text style={styles.cardTitle}>{item.tourPackage.title}</Text>
                        <Text style={styles.cardText}>Origem: {item.tourPackage.origin_local}</Text>
                        <Text style={styles.cardText}>Destino: {item.tourPackage.destiny_local}</Text>
                        <Text style={styles.cardText}>Data: {formatDateTime(item.tourPackage.date_tour)}</Text>
                        <Text style={styles.cardText}>Qtd: {item.vacancies_reserved}</Text>
                        <Text style={styles.cardText}>Valor: R$ {item.amount}</Text>
                        <Text style={styles.cardText}>Status: {item.canceled ? 'Cancelada' : item.confirmed ? 'Confirmada' : 'Pendente'}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma reserva encontrada.</Text>}
                contentContainerStyle={reservations.length === 0 ? styles.emptyList : styles.listContainer}
            />
            {/* Modal de detalhes da reserva */}
            <Modal
                visible={detailModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '92%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: '#222' }}>Detalhes da Reserva</Text>
                        {/* Bloco do Carro */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedReservation?.tourPackage?.car?.image ? (
                                <Image source={{ uri: selectedReservation.tourPackage.car.image }} style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee' }} resizeMode="cover" />
                            ) : (
                                <View style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem imagem do carro</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#007AFF', marginBottom: 2 }}>Carro: {selectedReservation?.tourPackage?.car?.model || '--'}</Text>
                            <Text style={{ fontSize: 15, color: '#555', marginBottom: 2 }}>Tipo: {selectedReservation?.tourPackage?.car?.type === 'FOUR_BY_FOUR' ? '4X4' : selectedReservation?.tourPackage?.car?.type === 'BUGGY' ? 'Buggy' : selectedReservation?.tourPackage?.car?.type === 'LANCHA' ? 'Lancha' : selectedReservation?.tourPackage?.car?.type}</Text>
                        </View>
                        {/* Bloco do Motorista */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedReservation?.tourPackage?.car?.driver?.image ? (
                                <Image source={{ uri: selectedReservation.tourPackage.car.driver.image }} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee' }} />
                            ) : (
                                <View style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem foto</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#222' }}>Motorista: {selectedReservation?.tourPackage?.car?.driver?.name || '---'}</Text>
                        </View>
                        {/* Bloco de infos da reserva */}
                        <View style={{ width: '100%', marginBottom: 18 }}>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Origem: <Text style={{ fontWeight: '600' }}>{selectedReservation?.tourPackage?.origin_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Destino: <Text style={{ fontWeight: '600' }}>{selectedReservation?.tourPackage?.destiny_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Data: <Text style={{ fontWeight: '600' }}>{selectedReservation ? formatDateTime(selectedReservation.tourPackage.date_tour) : ''}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Qtd de vagas: <Text style={{ fontWeight: '600' }}>{selectedReservation?.vacancies_reserved}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Valor: <Text style={{ fontWeight: '600' }}>R$ {selectedReservation?.amount}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Status: <Text style={{ fontWeight: '600' }}>{selectedReservation?.canceled ? 'Cancelada' : selectedReservation?.confirmed ? 'Confirmada' : 'Pendente'}</Text></Text>
                        </View>
                        {/* Botões de ação lado a lado */}
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 18, gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.btnClose, { flex: 1 }]}
                                onPress={() => setDetailModalVisible(false)}
                            >
                                <Text style={styles.reserveButtonText}>Fechar</Text>
                            </TouchableOpacity>
                            {!selectedReservation?.canceled && (
                                <TouchableOpacity
                                    style={[styles.btnCancel, { flex: 1 }]}
                                    onPress={() => handleAction('cancel')}
                                    disabled={actionLoading}
                                >
                                    <Text style={styles.reserveButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            )}
                            {!selectedReservation?.canceled && !selectedReservation?.confirmed && (
                                <TouchableOpacity
                                    style={[styles.reserveButton, { flex: 1 }]}
                                    onPress={() => handleAction('confirm')}
                                    disabled={actionLoading}
                                >
                                    <Text style={styles.reserveButtonText}>Confirmar</Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal de confirmação de ação */}
            <Modal
                visible={confirmModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '85%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                            {confirmAction === 'confirm' ? 'Confirmar Reserva?' : 'Cancelar Reserva?'}
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 24 }}>
                            {confirmAction === 'confirm'
                                ? 'Deseja realmente confirmar esta reserva?'
                                : 'Deseja realmente cancelar esta reserva? O valor será estornado.'}
                        </Text>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.btnClose, { flex: 1 }]}
                                onPress={() => setConfirmModalVisible(false)}
                                disabled={actionLoading}
                            >
                                <Text style={styles.reserveButtonText}>Voltar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.reserveButton, { flex: 1 }]}
                                onPress={handleConfirmAction}
                                disabled={actionLoading}
                            >
                                <Text style={styles.reserveButtonText}>{confirmAction === 'confirm' ? 'Confirmar' : 'Cancelar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <AlertComponent
                title="Aviso"
                visible={alertVisible}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
} 