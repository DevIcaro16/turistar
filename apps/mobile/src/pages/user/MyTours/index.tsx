import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Image, AppState } from 'react-native';
import styles from './styles';
import api from '../../../util/api/api';
import * as Notifications from 'expo-notifications';
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
        isRunning: boolean;
        isFinalised: boolean;
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

function getTourStatus(pkg: { isRunning: boolean; isFinalised: boolean }) {
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

function Timeline({ status }: { status: string }) {
    // status: 'Pendente', 'Em andamento', 'Finalizado'
    const steps = [
        { label: 'Não iniciada', key: 'Pendente', color: '#B0B0B0' },
        { label: 'Em andamento', key: 'Em andamento', color: '#007AFF' },
        { label: 'Finalizada', key: 'Finalizado', color: '#34C759' },
    ];
    const activeIndex = steps.findIndex(s => s.key === status);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            {steps.map((step, idx) => (
                <React.Fragment key={step.key}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: idx === activeIndex ? step.color : '#E5E5EA',
                            borderWidth: 2,
                            borderColor: idx === activeIndex ? step.color : '#B0B0B0',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {idx === activeIndex && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                        </View>
                        <Text style={{ fontSize: 11, color: idx === activeIndex ? step.color : '#888', marginTop: 2, fontWeight: idx === activeIndex ? 'bold' : 'normal', width: 70, textAlign: 'center' }}>{step.label}</Text>
                    </View>
                    {idx < steps.length - 1 && (
                        <View style={{ height: 2, width: 32, backgroundColor: activeIndex > idx ? steps[idx + 1].color : '#E5E5EA', alignSelf: 'center' }} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}

export default function MyTours() {
    const [tours, setTours] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState<ReservationData | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const prevStatusRef = useRef<{ [id: string]: string }>({});
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    //Notificações - EXPO
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                setAlertMessage('Permissão de notificação não concedida.');
                setAlertType('error');
                setAlertVisible(true);
            }
        })();
    }, []);

    useEffect(() => {
        fetchTours();
        intervalRef.current = setInterval(fetchTours, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {

            const response = await api.get('user/reservations');
            const confirmed = (response.data.reservations || []).filter((r: ReservationData) => r.confirmed && !r.canceled);
            console.log(confirmed);
            let notified = false;
            confirmed.forEach(async (tour: ReservationData) => {
                const status = getTourStatus(tour.tourPackage);
                if (!notified && prevStatusRef.current[tour.id] && prevStatusRef.current[tour.id] !== status) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Status do passeio atualizado',
                            body: `O passeio "${tour.tourPackage.title}" agora está: ${status}`,
                        },
                        trigger: null,
                    });
                    notified = true;
                }
                prevStatusRef.current[tour.id] = status;
            });

            setTours(confirmed);
        } catch (error: any) {
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (tour: ReservationData) => {
        setSelectedTour(tour);
        setDetailModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando passeios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Passeios</Text>
            <FlatList
                data={tours}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    const status = getTourStatus(item.tourPackage);
                    return (
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
                            <View style={{ marginTop: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Timeline status={status} />
                            </View>
                            {/* <Text style={[styles.cardText, { fontWeight: 'bold', color: status === 'Finalizado' ? '#34C759' : status === 'Em andamento' ? '#007AFF' : '#B0B0B0' }]}>Status: {status}</Text> */}
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum passeio encontrado.</Text>}
                contentContainerStyle={tours.length === 0 ? styles.emptyList : styles.listContainer}
            />
            {/* Modal de detalhes do passeio */}
            <Modal
                visible={detailModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '92%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: '#222' }}>Detalhes do Passeio</Text>
                        {/* Bloco do Carro */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedTour?.tourPackage?.car?.image ? (
                                <Image source={{ uri: selectedTour.tourPackage.car.image }} style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee' }} resizeMode="cover" />
                            ) : (
                                <View style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem imagem do carro</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#007AFF', marginBottom: 2 }}>Carro: {selectedTour?.tourPackage?.car?.model || '--'}</Text>
                            <Text style={{ fontSize: 15, color: '#555', marginBottom: 2 }}>Tipo: {selectedTour?.tourPackage?.car?.type === 'FOUR_BY_FOUR' ? '4X4' : selectedTour?.tourPackage?.car?.type === 'BUGGY' ? 'Buggy' : selectedTour?.tourPackage?.car?.type === 'LANCHA' ? 'Lancha' : selectedTour?.tourPackage?.car?.type}</Text>
                        </View>
                        {/* Bloco do Motorista */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedTour?.tourPackage?.car?.driver?.image ? (
                                <Image source={{ uri: selectedTour.tourPackage.car.driver.image }} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee' }} />
                            ) : (
                                <View style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem foto</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#222' }}>Motorista: {selectedTour?.tourPackage?.car?.driver?.name || '---'}</Text>
                        </View>
                        {/* Bloco de infos do passeio */}
                        <View style={{ width: '100%', marginBottom: 18 }}>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Origem: <Text style={{ fontWeight: '600' }}>{selectedTour?.tourPackage?.origin_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Destino: <Text style={{ fontWeight: '600' }}>{selectedTour?.tourPackage?.destiny_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Data: <Text style={{ fontWeight: '600' }}>{selectedTour ? formatDateTime(selectedTour.tourPackage.date_tour) : ''}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Qtd de vagas: <Text style={{ fontWeight: '600' }}>{selectedTour?.vacancies_reserved}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Valor: <Text style={{ fontWeight: '600' }}>R$ {selectedTour?.amount}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Status: <Text style={{ fontWeight: '600' }}>{selectedTour ? getTourStatus(selectedTour.tourPackage) : ''}</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 18 }}>
                            <TouchableOpacity
                                style={[styles.btnClose, { flex: 1 }]}
                                onPress={() => setDetailModalVisible(false)}
                            >
                                <Text style={styles.reserveButtonText}>Fechar</Text>
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