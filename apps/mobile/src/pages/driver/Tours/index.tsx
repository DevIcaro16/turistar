import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator,
    Modal,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../contexts/auth';
import AlertComponent from '../../../components/AlertComponent';
import styles from './styles';
import api from '../../../util/api/api';

interface TourData {
    id: string;
    title: string;
    image?: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string | Date;
    startDate: Date;
    endDate: Date;
    price: number;
    seatsAvailable: number;
    vacancies: number;
    type: string;
    isRunning: boolean;
    isFinalised: boolean;
    carId: string;
    touristPointId: string;
    car?: {
        model: string;
        plate: string;
    };
    touristPoint?: {
        name: string;
    };
}

export default function ToursManagement() {
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
                                        text: 'Iniciar mesmo assim',
                                        style: 'destructive',
                                        onPress: async () => {
                                            try {
                                                await api.post(`/driver/start-tourpackage`, { tourPackageId: tour.id }, {
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                });
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
                                await api.post(`/driver/start-tourpackage`, { tourPackageId: tour.id }, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
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
                            await api.post(`/driver/end-tourpackage`, { tourPackageId: tour.id }, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
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
        if (tour.isFinalised) return '#28a745';
        if (tour.isRunning) return '#ffc107';
        return '#6c757d';
    };

    const getStatusText = (tour: TourData) => {
        if (tour.isFinalised) return 'Finalizado';
        if (tour.isRunning) return 'Em Andamento';
        return 'Aguardando';
    };

    function formatDate(date: Date | string) {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateTime(date: Date | string) {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} as ${hour}:${minute}`;
    }

    const renderTourCard = ({ item }: { item: TourData }) => (
        <TouchableOpacity style={styles.carCard} onPress={() => openTourDetails(item)}>
            <View style={styles.carHeader}>
                <MaterialIcons name="tour" size={24} color="#007AFF" />
                <Text style={styles.carType}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
                    <Text style={styles.statusText}>{getStatusText(item)}</Text>
                </View>
            </View>
            <Text style={styles.carModel}>{item.origin_local} → {item.destiny_local}</Text>
            <Text style={styles.carCapacity}>
                {formatDateTime(item.date_tour)}
            </Text>
            <Text style={styles.carCapacity}>
                R$ {item.price.toFixed(2)} |
            </Text>
            <Text style={styles.carCapacity}>
                Total de {item.seatsAvailable} vagas
            </Text>
            <Text style={styles.carCapacity}>
                {item.vacancies} vagas disponíveis
            </Text>
            {item.vacancies === item.seatsAvailable && (
                <Text style={styles.carInfo}>Nenhuma vaga foi vendida ainda</Text>
            )}
            {item.car && (
                <Text style={styles.carInfo}>Carro: {item.car.model}</Text>
            )}
            {item.touristPoint && (
                <Text style={styles.carInfo}>Ponto: {item.touristPoint.name}</Text>
            )}
            <View style={styles.carActions}>
                {!item.isRunning && !item.isFinalised && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.startButton]}
                        onPress={() => handleStartTour(item)}
                    >
                        <MaterialIcons name="play-arrow" size={20} color="#28a745" />
                        <Text style={styles.startButtonText}>Iniciar</Text>
                    </TouchableOpacity>
                )}
                {item.isRunning && !item.isFinalised && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.finishButton]}
                        onPress={() => handleFinishTour(item)}
                    >
                        <MaterialIcons name="stop" size={20} color="#dc3545" />
                        <Text style={styles.finishButtonText}>Finalizar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="tour" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Você não tem nenhum passeio cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Crie pacotes de passeio para começar
            </Text>
        </View>
    );

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
            <View style={styles.header}>
                <Text style={styles.title}>Meus Passeios</Text>
            </View>

            <FlatList
                data={tours}
                renderItem={renderTourCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={tours.length === 0 ? styles.emptyList : styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedTour(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Passeio</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedTour(null);
                                }}
                            >
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {selectedTour && (
                                <View style={styles.form}>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Título</Text>
                                        <Text style={styles.detailValue}>{selectedTour.title}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Rota</Text>
                                        <Text style={styles.detailValue}>{selectedTour.origin_local} → {selectedTour.destiny_local}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Data e Hora</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDateTime(selectedTour.date_tour)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Preço</Text>
                                        <Text style={styles.detailValue}>R$ {selectedTour.price.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Vagas</Text>
                                        <Text style={styles.detailValue}>{selectedTour.vacancies}/{selectedTour.seatsAvailable}</Text>
                                        {selectedTour.vacancies === selectedTour.seatsAvailable && (
                                            <Text style={styles.detailValue}>Nenhuma vaga foi vendida ainda</Text>
                                        )}
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Tipo</Text>
                                        <Text style={styles.detailValue}>{selectedTour.type}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Status</Text>
                                        <Text style={[styles.detailValue, { color: getStatusColor(selectedTour) }]}>
                                            {getStatusText(selectedTour)}
                                        </Text>
                                    </View>
                                    {
                                        selectedTour.isFinalised && (
                                            <>
                                                <View style={styles.detailGroup}>
                                                    <Text style={styles.detailLabel}>Iniciado em</Text>
                                                    <Text style={styles.detailValue}>
                                                        {formatDateTime(selectedTour.startDate)}
                                                    </Text>
                                                </View>
                                                <View style={styles.detailGroup}>
                                                    <Text style={styles.detailLabel}>Finalizado em</Text>
                                                    <Text style={styles.detailValue}>
                                                        {formatDateTime(selectedTour.endDate)}
                                                    </Text>
                                                </View></>
                                        )
                                    }
                                    {selectedTour.car && (
                                        <View style={styles.detailGroup}>
                                            <Text style={styles.detailLabel}>Carro</Text>
                                            <Text style={styles.detailValue}>{selectedTour.car.model}</Text>
                                        </View>
                                    )}
                                    {selectedTour.touristPoint && (
                                        <View style={styles.detailGroup}>
                                            <Text style={styles.detailLabel}>Ponto Turístico</Text>
                                            <Text style={styles.detailValue}>{selectedTour.touristPoint.name}</Text>
                                        </View>
                                    )}
                                    <View style={styles.formActions}>
                                        {!selectedTour.isRunning && !selectedTour.isFinalised && (
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.startButton]}
                                                onPress={() => {
                                                    setModalVisible(false);
                                                    handleStartTour(selectedTour);
                                                }}
                                            >
                                                <Text style={styles.startButtonText}>Iniciar Passeio</Text>
                                            </TouchableOpacity>
                                        )}
                                        {selectedTour.isRunning && !selectedTour.isFinalised && (
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.finishButton]}
                                                onPress={() => {
                                                    setModalVisible(false);
                                                    handleFinishTour(selectedTour);
                                                }}
                                            >
                                                <Text style={styles.finishButtonText}>Finalizar Passeio</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.formButton, styles.cancelButton]}
                                            onPress={() => {
                                                setModalVisible(false);
                                                setSelectedTour(null);
                                            }}
                                        >
                                            <Text style={styles.cancelButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={alertVisible}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}