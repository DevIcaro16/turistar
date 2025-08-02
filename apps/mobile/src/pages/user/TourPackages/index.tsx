import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import AlertComponent from '../../../components/AlertComponent';
import { useTourPackagesViewModel, formatDateTime, CAR_TYPES } from './TourPackagesViewModel';
import { TourPackageData } from './TourPackagesModel';

export default function UserTourPackages() {
    const tourPackagesViewModel = useTourPackagesViewModel();

    const renderTourPackageCard = ({ item }: { item: TourPackageData }) => (
        <TouchableOpacity style={styles.card} onPress={() => tourPackagesViewModel.handleReserve(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                </View>
            </View>

            <Text style={styles.cardRoute}>{item.origin_local} → {item.destiny_local}</Text>
            <Text style={styles.cardDate}>{formatDateTime(item.date_tour)}</Text>
            <Text style={styles.cardType}>Tipo: {item.type}</Text>
            <Text style={styles.cardVagas}>Vagas disponíveis: {item.vacancies}</Text>

            {item.car?.driver && (
                <View style={styles.driverInfo}>
                    <Text style={styles.driverLabel}>Motorista:</Text>
                    <Text style={styles.driverName}>{item.car.driver.name}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum pacote encontrado</Text>
            <Text style={styles.emptySubtitle}>
                Não há pacotes de passeio disponíveis no momento
            </Text>
        </View>
    );

    if (tourPackagesViewModel.loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando pacotes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pacotes de Passeio</Text>

            {/* Filtros */}
            <View style={styles.filtersContainer}>
                <TextInput
                    style={styles.filterInput}
                    placeholder="Origem"
                    value={tourPackagesViewModel.origin}
                    onChangeText={tourPackagesViewModel.setOrigin}
                />
                <TextInput
                    style={styles.filterInput}
                    placeholder="Destino"
                    value={tourPackagesViewModel.destiny}
                    onChangeText={tourPackagesViewModel.setDestiny}
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={tourPackagesViewModel.carType}
                        onValueChange={tourPackagesViewModel.setCarType}
                        style={styles.picker}
                    >
                        <Picker.Item label="Todos os tipos" value="" />
                        {CAR_TYPES.map((type) => (
                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <FlatList
                data={tourPackagesViewModel.tourPackages}
                renderItem={renderTourPackageCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={tourPackagesViewModel.tourPackages.length === 0 ? styles.emptyList : styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal de Detalhes */}
            <Modal
                visible={tourPackagesViewModel.detailModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => tourPackagesViewModel.setDetailModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Pacote</Text>
                            <TouchableOpacity onPress={() => tourPackagesViewModel.setDetailModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {tourPackagesViewModel.selectedPackage && (
                            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                                <Text style={styles.detailTitle}>{tourPackagesViewModel.selectedPackage.title}</Text>
                                <Text style={styles.detailRoute}>
                                    {tourPackagesViewModel.selectedPackage.origin_local} → {tourPackagesViewModel.selectedPackage.destiny_local}
                                </Text>
                                <Text style={styles.detailDate}>
                                    {formatDateTime(tourPackagesViewModel.selectedPackage.date_tour)}
                                </Text>
                                <Text style={styles.detailPrice}>
                                    R$ {tourPackagesViewModel.selectedPackage.price.toFixed(2)}
                                </Text>
                                <Text style={styles.detailVagas}>
                                    Vagas disponíveis: {tourPackagesViewModel.selectedPackage.vacancies}
                                </Text>

                                {tourPackagesViewModel.selectedPackage.car?.driver && (
                                    <View style={styles.driverDetail}>
                                        <Text style={styles.driverDetailLabel}>Motorista:</Text>
                                        <Text style={styles.driverDetailName}>
                                            {tourPackagesViewModel.selectedPackage.car.driver.name}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.quantityContainer}>
                                    <Text style={styles.quantityLabel}>Quantidade de vagas:</Text>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                const currentQty = parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1');
                                                const newQty = Math.max(1, currentQty - 1);
                                                tourPackagesViewModel.setQuantities({
                                                    ...tourPackagesViewModel.quantities,
                                                    [tourPackagesViewModel.selectedPackage?.id || '']: newQty.toString()
                                                });
                                            }}
                                            disabled={parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1') <= 1}
                                        >
                                            <Text style={[styles.quantityButtonText,
                                            parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1') <= 1 && styles.quantityButtonDisabled
                                            ]}>-</Text>
                                        </TouchableOpacity>

                                        <TextInput
                                            style={styles.quantityInput}
                                            value={tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage.id] || '1'}
                                            onChangeText={(text) => {
                                                const numValue = parseInt(text) || 1;
                                                const maxValue = tourPackagesViewModel.selectedPackage?.vacancies || 1;
                                                const validValue = Math.max(1, Math.min(numValue, maxValue));
                                                tourPackagesViewModel.setQuantities({
                                                    ...tourPackagesViewModel.quantities,
                                                    [tourPackagesViewModel.selectedPackage?.id || '']: validValue.toString()
                                                });
                                            }}
                                            keyboardType="numeric"
                                            textAlign="center"
                                        />

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                const currentQty = parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1');
                                                const maxValue = tourPackagesViewModel.selectedPackage?.vacancies || 1;
                                                const newQty = Math.min(maxValue, currentQty + 1);
                                                tourPackagesViewModel.setQuantities({
                                                    ...tourPackagesViewModel.quantities,
                                                    [tourPackagesViewModel.selectedPackage?.id || '']: newQty.toString()
                                                });
                                            }}
                                            disabled={parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1') >= (tourPackagesViewModel.selectedPackage?.vacancies || 1)}
                                        >
                                            <Text style={[styles.quantityButtonText,
                                            parseInt(tourPackagesViewModel.quantities[tourPackagesViewModel.selectedPackage?.id || ''] || '1') >= (tourPackagesViewModel.selectedPackage?.vacancies || 1) && styles.quantityButtonDisabled
                                            ]}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.reserveButton}
                                    onPress={tourPackagesViewModel.handleAdvance}
                                >
                                    <Text style={styles.reserveButtonText}>Reservar</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmação */}
            <Modal
                visible={tourPackagesViewModel.confirmModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => tourPackagesViewModel.setConfirmModalVisible(false)}
            >
                <View style={styles.confirmModalContainer}>
                    <ScrollView contentContainerStyle={styles.confirmModalContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.confirmModalTitle}>Confirmar Reserva</Text>
                        <Text style={styles.confirmModalMessage}>
                            {tourPackagesViewModel.pendingReservation && (
                                <>
                                    Pacote: {tourPackagesViewModel.pendingReservation.pkg.title}{'\n'}
                                    Quantidade: {tourPackagesViewModel.pendingReservation.quantity} vagas{'\n'}
                                    Valor total: R$ {(tourPackagesViewModel.pendingReservation.pkg.price * tourPackagesViewModel.pendingReservation.quantity).toFixed(2)}
                                </>
                            )}
                        </Text>

                        <View style={styles.confirmModalActions}>
                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.cancelModalButton]}
                                onPress={() => tourPackagesViewModel.setConfirmModalVisible(false)}
                                disabled={tourPackagesViewModel.reservingId !== null}
                            >
                                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.confirmModalButton]}
                                onPress={tourPackagesViewModel.handleConfirmReservation}
                                disabled={tourPackagesViewModel.reservingId !== null}
                            >
                                {tourPackagesViewModel.reservingId !== null ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.confirmModalButtonText}>Confirmar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={tourPackagesViewModel.alertVisible}
                message={tourPackagesViewModel.alertMessage}
                type={tourPackagesViewModel.alertType}
                onClose={() => tourPackagesViewModel.setAlertVisible(false)}
            />
        </View>
    );
} 