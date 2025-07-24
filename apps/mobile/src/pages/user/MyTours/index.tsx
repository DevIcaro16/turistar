import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import styles from './styles';
import AlertComponent from '../../../components/AlertComponent';
import { useMyToursViewModel, formatDateTime, getTourStatus } from './MyToursViewModel';
import { ReservationData } from './types';

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
    const myToursViewModel = useMyToursViewModel();

    const renderTourCard = ({ item }: { item: ReservationData }) => (
        <TouchableOpacity style={styles.tourCard} onPress={() => myToursViewModel.handleOpenDetail(item)}>
            <View style={styles.tourHeader}>
                <Text style={styles.tourTitle}>{item.tourPackage.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getTourStatus(item.tourPackage) === 'Finalizado' ? '#34C759' : getTourStatus(item.tourPackage) === 'Em andamento' ? '#007AFF' : '#FF9500' }]}>
                    <Text style={styles.statusText}>{getTourStatus(item.tourPackage)}</Text>
                </View>
            </View>

            <Text style={styles.tourRoute}>{item.tourPackage.origin_local} → {item.tourPackage.destiny_local}</Text>
            <Text style={styles.tourDate}>{formatDateTime(item.tourPackage.date_tour)}</Text>
            <Text style={styles.tourPrice}>R$ {item.amount.toFixed(2)}</Text>

            <Timeline status={getTourStatus(item.tourPackage)} />

            {item.tourPackage.car?.driver && (
                <View style={styles.driverInfo}>
                    <Text style={styles.driverLabel}>Motorista:</Text>
                    <Text style={styles.driverName}>{item.tourPackage.car.driver.name}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum passeio encontrado</Text>
            <Text style={styles.emptySubtitle}>
                Você ainda não possui passeios reservados
            </Text>
        </View>
    );

    if (myToursViewModel.loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando seus passeios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Passeios</Text>

            <FlatList
                data={myToursViewModel.tours}
                renderItem={renderTourCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={myToursViewModel.tours.length === 0 ? styles.emptyList : styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={myToursViewModel.detailModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => myToursViewModel.setDetailModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Passeio</Text>
                            <TouchableOpacity onPress={() => myToursViewModel.setDetailModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {myToursViewModel.selectedTour && (
                            <View style={styles.modalBody}>
                                <Text style={styles.detailTitle}>{myToursViewModel.selectedTour.tourPackage.title}</Text>
                                <Text style={styles.detailRoute}>
                                    {myToursViewModel.selectedTour.tourPackage.origin_local} → {myToursViewModel.selectedTour.tourPackage.destiny_local}
                                </Text>
                                <Text style={styles.detailDate}>
                                    {formatDateTime(myToursViewModel.selectedTour.tourPackage.date_tour)}
                                </Text>
                                <Text style={styles.detailPrice}>
                                    R$ {myToursViewModel.selectedTour.amount.toFixed(2)}
                                </Text>
                                <Text style={styles.detailVagas}>
                                    Vagas reservadas: {myToursViewModel.selectedTour.vacancies_reserved}
                                </Text>

                                {myToursViewModel.selectedTour.tourPackage.car?.driver && (
                                    <View style={styles.driverDetail}>
                                        <Text style={styles.driverDetailLabel}>Motorista:</Text>
                                        <Text style={styles.driverDetailName}>
                                            {myToursViewModel.selectedTour.tourPackage.car.driver.name}
                                        </Text>
                                    </View>
                                )}

                                <Timeline status={getTourStatus(myToursViewModel.selectedTour.tourPackage)} />

                                {!myToursViewModel.selectedTour.canceled && getTourStatus(myToursViewModel.selectedTour.tourPackage) === 'Pendente' && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => myToursViewModel.handleCancelReservation(myToursViewModel.selectedTour!)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={myToursViewModel.alertVisible}
                message={myToursViewModel.alertMessage}
                type={myToursViewModel.alertType}
                onClose={() => myToursViewModel.setAlertVisible(false)}
            />
        </View>
    );
} 