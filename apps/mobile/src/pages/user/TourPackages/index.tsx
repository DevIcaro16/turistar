import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import api from '../../../util/api/api';
import AlertComponent from '../../../components/AlertComponent';

interface TourPackageData {
    id: string;
    title: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string;
    price: number;
    vacancies: number;
    type: string;
    car: { type: string; model: string; image?: string; driver?: { name: string; image?: string } };
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

const CAR_TYPES = [
    { value: 'BUGGY', label: 'Buggy' },
    { value: 'LANCHA', label: 'Lancha' },
    { value: 'FOUR_BY_FOUR', label: '4X4' },
];

export default function UserTourPackages() {
    const [tourPackages, setTourPackages] = useState<TourPackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [origin, setOrigin] = useState('');
    const [destiny, setDestiny] = useState('');
    const [carType, setCarType] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [reservingId, setReservingId] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{ [id: string]: string }>({});
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingReservation, setPendingReservation] = useState<{ pkg: TourPackageData, quantity: number } | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<TourPackageData | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        fetchTourPackages();

        intervalRef.current = setInterval(fetchTourPackages, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const fetchTourPackages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/TourPackage');
            console.log(response);
            setTourPackages(response.data.tourPackages || response.data || []);
        } catch (error) {
            setTourPackages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = (tourPackage: TourPackageData) => {
        setSelectedPackage(tourPackage);
        setDetailModalVisible(true);
    };

    const handleAdvance = () => {
        if (!selectedPackage) return;
        const quantity = parseInt(quantities[selectedPackage.id] || '1', 10);
        if (!quantity || quantity < 1) {
            setAlertMessage('Informe uma quantidade válida de reservas.');
            setAlertType('error');
            setAlertVisible(true);
            return;
        }
        if (quantity > selectedPackage.vacancies) {
            setAlertMessage('Quantidade de reservas maior que o número de vagas disponíveis.');
            setAlertType('error');
            setAlertVisible(true);
            return;
        }
        setPendingReservation({ pkg: selectedPackage, quantity });
        setDetailModalVisible(false);
        setConfirmModalVisible(true);
    };

    const confirmReserve = async () => {
        if (!pendingReservation) return;
        const { pkg, quantity } = pendingReservation;
        setReservingId(pkg.id);
        setConfirmModalVisible(false);
        try {
            await api.post('/user/reservation', {
                tourPackageId: pkg.id,
                vacancies_reserved: quantity,
                amount: pkg.price * quantity,
            });
            setAlertMessage('Reserva realizada com sucesso!');
            setAlertType('success');
            setAlertVisible(true);
            fetchTourPackages();
        } catch (error: any) {
            setAlertMessage(error.response?.data?.message || 'Erro ao reservar pacote');
            setAlertType('error');
            setAlertVisible(true);
        } finally {
            setReservingId(null);
            setPendingReservation(null);
        }
    };

    const filteredPackages = tourPackages.filter(pkg => {
        const matchOrigin = origin ? pkg.origin_local.toLowerCase().includes(origin.toLowerCase()) : true;
        const matchDestiny = destiny ? pkg.destiny_local.toLowerCase().includes(destiny.toLowerCase()) : true;
        const matchCarType = carType ? pkg.car?.type === carType : true;
        return matchOrigin && matchDestiny && matchCarType;
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando pacotes de turismo...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pacotes de Turismo</Text>
            <View style={styles.filtersContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Origem"
                    value={origin}
                    onChangeText={setOrigin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Destino"
                    value={destiny}
                    onChangeText={setDestiny}
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={carType}
                        onValueChange={setCarType}
                        style={styles.picker}
                    >
                        <Picker.Item label="Tipo de Carro" value="" />
                        {CAR_TYPES.map(type => (
                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                </View>
            </View>
            <FlatList
                data={filteredPackages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardText}>Origem: {item.origin_local}</Text>
                        <Text style={styles.cardText}>Destino: {item.destiny_local}</Text>
                        <Text style={styles.cardText}>Data: {formatDateTime(item.date_tour)}</Text>
                        <Text style={styles.cardText}>Preço: R$ {item.price}</Text>
                        <Text style={styles.cardText}>Vagas: {item.vacancies}</Text>
                        <Text style={styles.cardText}>
                            Tipo de Carro: {
                                item.car?.type === "FOUR_BY_FOUR"
                                    ? "4X4"
                                    : item.car?.type === "BUGGY"
                                        ? "Buggy"
                                        : item.car?.type === "LANCHA"
                                            ? "Lancha"
                                            : item.car?.type
                            }
                        </Text>
                        {
                            item.vacancies > 0
                                ?
                                (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'flex-end' }}>
                                        <Text style={{ marginRight: 8 }}>Qtd de reservas:</Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#E5E5EA',
                                                borderRadius: 4,
                                                paddingHorizontal: 14,
                                                paddingVertical: 6,
                                                marginRight: 4,
                                            }}
                                            onPress={() => setQuantities(q => ({
                                                ...q,
                                                [item.id]: String(Math.max(1, (parseInt(q[item.id] || '1', 10) - 1)))
                                            }))}
                                            disabled={parseInt(quantities[item.id] || '1', 10) <= 1}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>
                                            {quantities[item.id] || '1'}
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#E5E5EA',
                                                borderRadius: 4,
                                                paddingHorizontal: 14,
                                                paddingVertical: 6,
                                                marginLeft: 4,
                                            }}
                                            onPress={() => setQuantities(q => ({
                                                ...q,
                                                [item.id]: String(Math.min(item.vacancies, (parseInt(q[item.id] || '1', 10) + 1)))
                                            }))}
                                            disabled={parseInt(quantities[item.id] || '1', 10) >= item.vacancies}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                                :
                                (
                                    <>
                                    </>
                                )
                        }
                        {
                            item.vacancies > 0
                                ?
                                (
                                    <TouchableOpacity
                                        style={styles.reserveButton}
                                        onPress={() => handleReserve(item)}
                                        disabled={reservingId === item.id}
                                    >
                                        <Text style={styles.reserveButtonText}>{reservingId === item.id ? 'Reservando...' : 'Reservar'}</Text>
                                    </TouchableOpacity>
                                )
                                : (
                                    <TouchableOpacity
                                        style={styles.btnEsgotado}
                                        disabled={reservingId === item.id}
                                    >
                                        <Text style={styles.reserveButtonText}>Esgotado</Text>
                                    </TouchableOpacity>
                                )
                        }
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum pacote encontrado.</Text>}
                contentContainerStyle={filteredPackages.length === 0 ? styles.emptyList : styles.listContainer}
            />
            <AlertComponent
                title="Aviso"
                visible={alertVisible}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />
            {/* Modal de detalhes do pacote */}
            <Modal
                visible={detailModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '92%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: '#222' }}>Detalhes do Pacote</Text>
                        {/* Bloco do Carro */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedPackage?.car?.image ? (
                                <Image source={{ uri: selectedPackage.car.image }} style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee' }} resizeMode="cover" />
                            ) : (
                                <View style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem imagem do carro</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#007AFF', marginBottom: 2 }}>Carro: {selectedPackage?.car?.model || '--'}</Text>
                            <Text style={{ fontSize: 15, color: '#555', marginBottom: 2 }}>Tipo: {selectedPackage?.car?.type === 'FOUR_BY_FOUR' ? '4X4' : selectedPackage?.car?.type === 'BUGGY' ? 'Buggy' : selectedPackage?.car?.type === 'LANCHA' ? 'Lancha' : selectedPackage?.car?.type}</Text>
                        </View>
                        {/* Bloco do Motorista */}
                        <View style={{ alignItems: 'center', marginBottom: 18, width: '100%' }}>
                            {selectedPackage?.car?.driver?.image ? (
                                <Image source={{ uri: selectedPackage.car.driver.image }} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee' }} />
                            ) : (
                                <View style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#aaa' }}>Sem foto</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#222' }}>Motorista: {selectedPackage?.car?.driver?.name || '---'}</Text>
                        </View>
                        {/* Bloco de infos do pacote */}
                        <View style={{ width: '100%', marginBottom: 18 }}>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Origem: <Text style={{ fontWeight: '600' }}>{selectedPackage?.origin_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Destino: <Text style={{ fontWeight: '600' }}>{selectedPackage?.destiny_local}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Data: <Text style={{ fontWeight: '600' }}>{selectedPackage ? formatDateTime(selectedPackage.date_tour) : ''}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Preço: <Text style={{ fontWeight: '600' }}>R$ {selectedPackage?.price}</Text></Text>
                            <Text style={{ fontSize: 15, color: '#444', marginBottom: 2 }}>Vagas disponíveis: <Text style={{ fontWeight: '600' }}>{selectedPackage?.vacancies}</Text></Text>
                        </View>
                        {/* Quantidade e botões de ação permanecem iguais */}
                        {selectedPackage?.vacancies && selectedPackage.vacancies > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'flex-end', width: '100%' }}>
                                <Text style={{ marginRight: 8 }}>Qtd de reservas:</Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#E5E5EA',
                                        borderRadius: 4,
                                        paddingHorizontal: 14,
                                        paddingVertical: 6,
                                        marginRight: 4,
                                    }}
                                    onPress={() => setQuantities(q => ({
                                        ...q,
                                        [selectedPackage.id]: String(Math.max(1, (parseInt(q[selectedPackage.id] || '1', 10) - 1)))
                                    }))}
                                    disabled={parseInt(quantities[selectedPackage.id] || '1', 10) <= 1}
                                >
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                                </TouchableOpacity>
                                <Text style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>
                                    {quantities[selectedPackage.id] || '1'}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#E5E5EA',
                                        borderRadius: 4,
                                        paddingHorizontal: 14,
                                        paddingVertical: 6,
                                        marginLeft: 4,
                                    }}
                                    onPress={() => setQuantities(q => ({
                                        ...q,
                                        [selectedPackage.id]: String(Math.min(selectedPackage.vacancies, (parseInt(q[selectedPackage.id] || '1', 10) + 1)))
                                    }))}
                                    disabled={parseInt(quantities[selectedPackage.id] || '1', 10) >= selectedPackage.vacancies}
                                >
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* Botões de ação lado a lado */}
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 18, gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.btnEsgotado, { flex: 1 }]}
                                onPress={() => setDetailModalVisible(false)}
                            >
                                <Text style={styles.reserveButtonText}>Fechar</Text>
                            </TouchableOpacity>
                            {selectedPackage?.vacancies && selectedPackage.vacancies > 0 ? (
                                <TouchableOpacity
                                    style={[styles.reserveButton, { flex: 1 }]}
                                    onPress={() => {
                                        setPendingReservation({ pkg: selectedPackage, quantity: parseInt(quantities[selectedPackage.id] || '1', 10) });
                                        setDetailModalVisible(false);
                                        setConfirmModalVisible(true);
                                    }}
                                    disabled={reservingId === selectedPackage.id}
                                >
                                    <Text style={styles.reserveButtonText}>{reservingId === selectedPackage.id ? 'Reservando...' : 'Reservar'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.btnEsgotado, { flex: 1 }]}
                                    disabled
                                >
                                    <Text style={styles.reserveButtonText}>Esgotado</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={confirmModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '80%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Confirmar Reserva</Text>
                        <Text style={{ fontSize: 16, marginBottom: 8 }}>
                            Você confirma a reserva de {pendingReservation?.quantity} vaga(s) no pacote "{pendingReservation?.pkg.title}"?
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 20 }}>
                            Valor total: <Text style={{ fontWeight: 'bold' }}>R$ {pendingReservation ? (pendingReservation.pkg.price * pendingReservation.quantity).toFixed(2) : '0.00'}</Text>
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity
                                style={[styles.btnEsgotado, { flex: 1, marginLeft: 8 }]}
                                onPress={() => setConfirmModalVisible(false)}
                            >
                                <Text style={styles.reserveButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.reserveButton, { flex: 1, marginRight: 8 }]}
                                onPress={confirmReserve}
                            >
                                <Text style={styles.reserveButtonText}>Confirmar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
} 