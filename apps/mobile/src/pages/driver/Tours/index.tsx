import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Modal,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AlertComponent from '../../../components/AlertComponent';
import styles from './styles';
import { useToursViewModel, formatDate, formatDateTime } from './ToursViewModel';

export default function ToursManagement() {
    const toursViewModel = useToursViewModel();

    const renderTourCard = ({ item }: { item: any }) => (
        <View style={styles.carCard}>
            <View style={styles.carHeader}>
                <MaterialIcons name="tour" size={24} color="#007AFF" />
                <Text style={styles.carType}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: toursViewModel.getStatusColor(item) }]}>
                    <Text style={styles.statusText}>{toursViewModel.getStatusText(item)}</Text>
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
                        onPress={() => toursViewModel.handleStartTour(item)}
                    >
                        <MaterialIcons name="play-arrow" size={20} color="#28a745" />
                        <Text style={styles.startButtonText}>Iniciar</Text>
                    </TouchableOpacity>
                )}
                {item.isRunning && !item.isFinalised && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.finishButton]}
                        onPress={() => toursViewModel.handleFinishTour(item)}
                    >
                        <MaterialIcons name="stop" size={20} color="#dc3545" />
                        <Text style={styles.finishButtonText}>Finalizar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="directions-car" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Nenhum passeio encontrado</Text>
            <Text style={styles.emptySubtitle}>
                Você ainda não possui passeios cadastrados
            </Text>
        </View>
    );

    if (toursViewModel.loading) {
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
                data={toursViewModel.tours}
                renderItem={renderTourCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={toursViewModel.tours.length === 0 ? styles.emptyList : styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={toursViewModel.refreshing} onRefresh={toursViewModel.onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={toursViewModel.modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => toursViewModel.setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Passeio</Text>
                            <TouchableOpacity onPress={() => toursViewModel.setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        {toursViewModel.selectedTour && (
                            <ScrollView>
                                <View style={styles.form}>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Título</Text>
                                        <Text style={styles.detailValue}>{toursViewModel.selectedTour.title}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Rota</Text>
                                        <Text style={styles.detailValue}>{toursViewModel.selectedTour.origin_local} → {toursViewModel.selectedTour.destiny_local}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Data e Hora</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDateTime(toursViewModel.selectedTour.date_tour)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Preço</Text>
                                        <Text style={styles.detailValue}>R$ {toursViewModel.selectedTour.price.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Vagas</Text>
                                        <Text style={styles.detailValue}>{toursViewModel.selectedTour.vacancies}/{toursViewModel.selectedTour.seatsAvailable}</Text>
                                        {toursViewModel.selectedTour.vacancies === toursViewModel.selectedTour.seatsAvailable && (
                                            <Text style={styles.detailValue}>Nenhuma vaga foi vendida ainda</Text>
                                        )}
                                    </View>
                                    <View style={styles.detailGroup}>
                                        <Text style={styles.detailLabel}>Status</Text>
                                        <Text style={[styles.detailValue, { color: toursViewModel.getStatusColor(toursViewModel.selectedTour) }]}>
                                            {toursViewModel.getStatusText(toursViewModel.selectedTour)}
                                        </Text>
                                    </View>
                                    {toursViewModel.selectedTour.car && (
                                        <View style={styles.detailGroup}>
                                            <Text style={styles.detailLabel}>Carro</Text>
                                            <Text style={styles.detailValue}>{toursViewModel.selectedTour.car.model}</Text>
                                        </View>
                                    )}
                                    {toursViewModel.selectedTour.touristPoint && (
                                        <View style={styles.detailGroup}>
                                            <Text style={styles.detailLabel}>Ponto Turístico</Text>
                                            <Text style={styles.detailValue}>{toursViewModel.selectedTour.touristPoint.name}</Text>
                                        </View>
                                    )}
                                    <View style={styles.formActions}>
                                        <TouchableOpacity
                                            style={[styles.formButton, styles.cancelButton]}
                                            onPress={() => toursViewModel.setModalVisible(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={toursViewModel.alertVisible}
                message={toursViewModel.alertMessage}
                type={toursViewModel.alertType}
                onClose={() => toursViewModel.setAlertVisible(false)}
            />
        </View>
    );
}