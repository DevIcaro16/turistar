import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Modal,
    Image,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import AlertComponent from '../../../components/AlertComponent';
import styles from './styles';
import { transportOptions } from '../../../util/types/transportTypes';
import { useCarViewModel } from './CarViewModel';
import { validationSchema, initialFormValues, CarFormData, Car } from './CarModel';
import { secureImageUrl } from '../../../util/imageUtils';

export default function CarManagement() {
    const carViewModel = useCarViewModel();

    const renderCarCard = ({ item }: { item: Car }) => (
        <View style={styles.carCard}>
            <View style={styles.carImageContainer}>
                {item.image ? (
                    <Image
                        source={{ uri: secureImageUrl(item.image) || '' }}
                        style={styles.carCardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <MaterialIcons name="directions-car" size={64} color="#C7C7CC" />
                )}
            </View>
            <View style={styles.carHeader}>
                <MaterialIcons
                    name={carViewModel.getTransportIcon(item.type) as any}
                    size={24}
                    color="#007AFF"
                />
                <Text style={styles.carType}>{carViewModel.getTransportLabel(item.type)}</Text>
            </View>
            <Text style={styles.carModel}>{item.model}</Text>
            <Text style={styles.carCapacity}>Capacidade: {item.capacity} pessoas</Text>
            <View style={styles.carActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => carViewModel.openEditModal(item)}
                >
                    <MaterialIcons name="edit" size={20} color="#007AFF" />
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => carViewModel.handleDeleteCar(item)}
                >
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="directions-car" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Nenhum carro cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Toque no botão + para adicionar seu primeiro veículo
            </Text>
        </View>
    );

    if (carViewModel.loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando carros...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Veículos</Text>
                <TouchableOpacity style={styles.addButton} onPress={carViewModel.openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={carViewModel.cars}
                renderItem={renderCarCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={carViewModel.cars.length === 0 ? styles.emptyList : styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={carViewModel.refreshing} onRefresh={carViewModel.onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={carViewModel.modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={carViewModel.closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {carViewModel.editingCar ? 'Editar Veículo' : 'Novo Veículo'}
                            </Text>
                            <TouchableOpacity onPress={carViewModel.closeModal}>
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={{ flexGrow: 0 }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScrollContent}
                        >
                            <Formik
                                initialValues={{
                                    type: carViewModel.editingCar?.type || '',
                                    model: carViewModel.editingCar?.model || '',
                                    capacity: carViewModel.editingCar?.capacity?.toString() || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={carViewModel.editingCar ? carViewModel.handleUpdateCar : carViewModel.handleCreateCar}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <View style={styles.form}>
                                        <TouchableOpacity style={styles.imagePickerButton} onPress={carViewModel.pickImage}>
                                            <Text style={styles.imagePickerButtonText}>
                                                {carViewModel.selectedImage ? 'Trocar Foto' : 'Escolher Foto'}
                                            </Text>
                                        </TouchableOpacity>
                                        {carViewModel.selectedImage && (
                                            <Image
                                                source={{ uri: carViewModel.selectedImage.uri }}
                                                style={styles.imagePreview}
                                                resizeMode="cover"
                                            />
                                        )}
                                        {carViewModel.editingCar?.image && !carViewModel.selectedImage && (
                                            <View style={styles.currentImageContainer}>
                                                <Text style={styles.currentImageLabel}>Imagem atual:</Text>
                                                <Image
                                                    source={{ uri: secureImageUrl(carViewModel.editingCar.image) || '' }}
                                                    style={styles.imagePreview}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Tipo de Transporte</Text>
                                            <View style={styles.pickerContainer}>
                                                <Picker
                                                    selectedValue={values.type}
                                                    onValueChange={(value) => setFieldValue('type', value)}
                                                    style={styles.picker}
                                                >
                                                    <Picker.Item label="Selecione o tipo" value="" />
                                                    {transportOptions.map((option) => (
                                                        <Picker.Item
                                                            key={option.value}
                                                            label={option.label}
                                                            value={option.value}
                                                        />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {touched.type && errors.type && (
                                                <Text style={styles.errorText}>{errors.type}</Text>
                                            )}
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Modelo</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="directions-car" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Toyota Corolla"
                                                    value={values.model}
                                                    onChangeText={handleChange('model')}
                                                    onBlur={handleBlur('model')}
                                                />
                                            </View>
                                            {touched.model && errors.model && (
                                                <Text style={styles.errorText}>{errors.model}</Text>
                                            )}
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Capacidade</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="people" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: 4"
                                                    maxLength={2}
                                                    value={values.capacity}
                                                    onChangeText={handleChange('capacity')}
                                                    onBlur={handleBlur('capacity')}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            {touched.capacity && errors.capacity && (
                                                <Text style={styles.errorText}>{errors.capacity}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formActions}>
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.cancelButton]}
                                                onPress={carViewModel.closeModal}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.formButton, styles.submitButton]}
                                                onPress={() => handleSubmit()}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {carViewModel.editingCar ? 'Atualizar' : 'Criar'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={carViewModel.alertVisible}
                message={carViewModel.alertMessage}
                type={carViewModel.alertType}
                onClose={() => carViewModel.setAlertVisible(false)}
            />
        </View>
    );
}
