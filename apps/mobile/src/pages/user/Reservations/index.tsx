import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Image, ScrollView } from 'react-native';
import styles from './styles';
import AlertComponent from '../../../components/AlertComponent';
import { useReservationsViewModel, formatDateTime } from './ReservationsViewModel';
import { ReservationData } from './ReservationsModel';

export default function UserReservations() {
    const reservationsViewModel = useReservationsViewModel();

    const renderReservationCard = ({ item }: { item: ReservationData }) => (
        <TouchableOpacity style={styles.reservationCard} onPress={() => reservationsViewModel.handleOpenDetail(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.tourPackage.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.confirmed ? '#34C759' : item.canceled ? '#FF3B30' : '#FF9500' }]}>
                    <Text style={styles.statusText}>
                        {item.confirmed ? 'Confirmada' : item.canceled ? 'Cancelada' : 'Pendente'}
                    </Text>
                </View>
            </View>

            <Text style={styles.cardRoute}>{item.tourPackage.origin_local} → {item.tourPackage.destiny_local}</Text>
            <Text style={styles.cardDate}>{formatDateTime(item.tourPackage.date_tour)}</Text>
            <Text style={styles.cardPrice}>R$ {item.amount.toFixed(2)}</Text>
            <Text style={styles.cardVagas}>Vagas: {item.vacancies_reserved}</Text>

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
            <Text style={styles.emptyTitle}>Nenhuma reserva encontrada</Text>
            <Text style={styles.emptySubtitle}>
                Você ainda não possui reservas
            </Text>
        </View>
    );

    if (reservationsViewModel.loading) {
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
                data={reservationsViewModel.reservations}
                renderItem={renderReservationCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={reservationsViewModel.reservations.length === 0 ? styles.emptyList : styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal de Detalhes */}
            <Modal
                visible={reservationsViewModel.detailModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => reservationsViewModel.setDetailModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes da Reserva</Text>
                            <TouchableOpacity onPress={() => reservationsViewModel.setDetailModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {reservationsViewModel.selectedReservation && (
                            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
                                <Text style={styles.detailTitle}>{reservationsViewModel.selectedReservation.tourPackage.title}</Text>
                                <Text style={styles.detailRoute}>
                                    {reservationsViewModel.selectedReservation.tourPackage.origin_local} → {reservationsViewModel.selectedReservation.tourPackage.destiny_local}
                                </Text>
                                <Text style={styles.detailDate}>
                                    {formatDateTime(reservationsViewModel.selectedReservation.tourPackage.date_tour)}
                                </Text>
                                <Text style={styles.detailPrice}>
                                    R$ {reservationsViewModel.selectedReservation.amount.toFixed(2)}
                                </Text>
                                <Text style={styles.detailVagas}>
                                    Vagas reservadas: {reservationsViewModel.selectedReservation.vacancies_reserved}
                                </Text>

                                {reservationsViewModel.selectedReservation.tourPackage.car?.driver && (
                                    <View style={styles.driverDetail}>
                                        <Text style={styles.driverDetailLabel}>Motorista:</Text>
                                        <Text style={styles.driverDetailName}>
                                            {reservationsViewModel.selectedReservation.tourPackage.car.driver.name}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.actionButtons}>
                                    {!reservationsViewModel.selectedReservation.confirmed && !reservationsViewModel.selectedReservation.canceled && (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.confirmButton]}
                                                onPress={() => reservationsViewModel.handleAction('confirm')}
                                                disabled={reservationsViewModel.actionLoading}
                                            >
                                                <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.cancelButton]}
                                                onPress={() => reservationsViewModel.handleAction('cancel')}
                                                disabled={reservationsViewModel.actionLoading}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmação */}
            <Modal
                visible={reservationsViewModel.confirmModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => reservationsViewModel.setConfirmModalVisible(false)}
            >
                <View style={styles.confirmModalContainer}>
                    <ScrollView contentContainerStyle={styles.confirmModalContent} showsVerticalScrollIndicator={true}>
                        <Text style={styles.confirmModalTitle}>
                            {reservationsViewModel.confirmAction === 'confirm' ? 'Confirmar Pagamento' : 'Cancelar Reserva'}
                        </Text>
                        <Text style={styles.confirmModalMessage}>
                            {reservationsViewModel.confirmAction === 'confirm'
                                ? 'Deseja confirmar o pagamento desta reserva?'
                                : 'Tem certeza que deseja cancelar esta reserva?'}
                        </Text>

                        <View style={styles.confirmModalActions}>
                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.cancelModalButton]}
                                onPress={() => reservationsViewModel.setConfirmModalVisible(false)}
                                disabled={reservationsViewModel.actionLoading}
                            >
                                <Text style={styles.cancelModalButtonText}>Não</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.confirmModalButton]}
                                onPress={reservationsViewModel.handleConfirmAction}
                                disabled={reservationsViewModel.actionLoading}
                            >
                                {reservationsViewModel.actionLoading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.confirmModalButtonText}>Sim</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={reservationsViewModel.alertVisible}
                message={reservationsViewModel.alertMessage}
                type={reservationsViewModel.alertType}
                onClose={() => reservationsViewModel.setAlertVisible(false)}
            />
        </View>
    );
} 