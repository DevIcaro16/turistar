import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Modal,
    Image,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../../contexts/auth';
import AlertComponent from '../../../components/AlertComponent';
import styles from './styles';
import api from '../../../util/api/api';
import { transportOptions } from '../../../util/types/transportTypes';
import * as ImagePicker from 'expo-image-picker';

interface Car {
    id: string;
    type: string;
    model: string;
    capacity: number;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface CarFormData {
    type: string;
    model: string;
    capacity: string;
}


const validationSchema = Yup.object().shape({
    type: Yup.string().required('Tipo de transporte é obrigatório'),
    model: Yup.string().required('Modelo é obrigatório'),
    capacity: Yup.string()
        .required('Capacidade é obrigatória')
        .max(1, 'Capacidade deve ser um valor entre 1 e 9')
        .matches(/^\d+$/, 'Capacidade deve ser um número')
});

export default function CarManagement() {
    const { user } = useContext<any>(AuthContext);
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchCars = async () => {
        try {
            const response = await api.get('/car/driver');
            setCars(response.data.cars || []);
        } catch (error: any) {
            console.error('Erro ao buscar carros:', error);
            showAlert('Erro ao carregar carros', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCars();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleCreateCar = async (values: CarFormData) => {
        try {
            const formData = new FormData();
            formData.append('type', values.type);
            formData.append('model', values.model);
            formData.append('capacity', parseInt(values.capacity));
            formData.append('driverId', user.id);
            if (selectedImage) {
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'car.jpg',
                    type: 'image/jpeg',
                } as any);
            }
            await api.post('/car/registration', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showAlert('Carro criado com sucesso!');
            setModalVisible(false);
            setSelectedImage(null);
            fetchCars();
        } catch (error: any) {
            console.error('Erro ao criar carro:', error);
            showAlert(error.response?.data?.message || 'Erro ao criar carro', 'error');
        }
    };

    const handleUpdateCar = async (values: CarFormData) => {
        if (!editingCar) return;

        try {
            const formData = new FormData();
            formData.append('type', values.type);
            formData.append('model', values.model);
            formData.append('capacity', parseInt(values.capacity));

            if (selectedImage) {
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'car.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            await api.put(`/car/${editingCar.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showAlert('Carro atualizado com sucesso!');
            setModalVisible(false);
            setEditingCar(null);
            setSelectedImage(null);
            fetchCars();
        } catch (error: any) {
            console.error('Erro ao atualizar carro:', error);
            showAlert(error.response?.data?.message || 'Erro ao atualizar carro', 'error');
        }
    };

    const handleDeleteCar = (car: Car) => {
        Alert.alert(
            'Confirmar exclusão',
            `Tem certeza que deseja excluir o ${car.model}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/car/${car.id}`);
                            showAlert('Carro excluído com sucesso!');
                            fetchCars();
                        } catch (error: any) {
                            console.error('Erro ao excluir carro:', error);
                            showAlert(error.response?.data?.message || 'Erro ao excluir carro', 'error');
                        }
                    }
                }
            ]
        );
    };

    const openCreateModal = () => {
        setEditingCar(null);
        setModalVisible(true);
    };

    const openEditModal = (car: Car) => {
        console.log('Abrindo modal para editar:', car);
        setEditingCar(car);
        setModalVisible(true);
    };

    const getTransportIcon = (type: string) => {
        const option = transportOptions.find(opt => opt.value === type);
        return option?.icon || 'directions-car';
    };

    const getTransportLabel = (type: string) => {
        const option = transportOptions.find(opt => opt.value === type);
        return option?.label || type;
    };

    const renderCarCard = ({ item }: { item: Car }) => (
        <View style={styles.carCard}>
            <View style={styles.carImageContainer}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.carCardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <MaterialIcons name="directions-car" size={64} color="#C7C7CC" />
                )}
            </View>
            <View style={styles.carHeader}>
                <MaterialIcons
                    name={getTransportIcon(item.type) as any}
                    size={24}
                    color="#007AFF"
                />
                <Text style={styles.carType}>{getTransportLabel(item.type)}</Text>
            </View>
            <Text style={styles.carModel}>{item.model}</Text>
            <Text style={styles.carCapacity}>Capacidade: {item.capacity} pessoas</Text>
            <View style={styles.carActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(item)}
                >
                    <MaterialIcons name="edit" size={20} color="#007AFF" />
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteCar(item)}
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

    if (loading) {
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
                <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={cars}
                renderItem={renderCarCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={cars.length === 0 ? styles.emptyList : styles.listContainer}
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
                    setEditingCar(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingCar ? 'Editar Veículo' : 'Novo Veículo'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingCar(null);
                                }}
                            >
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
                                    type: editingCar?.type || '',
                                    model: editingCar?.model || '',
                                    capacity: editingCar?.capacity?.toString() || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={editingCar ? handleUpdateCar : handleCreateCar}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <View style={styles.form}>
                                        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                            <Text style={styles.imagePickerButtonText}>
                                                {selectedImage ? 'Trocar Foto' : 'Escolher Foto'}
                                            </Text>
                                        </TouchableOpacity>
                                        {selectedImage && (
                                            <Image
                                                source={{ uri: selectedImage.uri }}
                                                style={styles.imagePreview}
                                                resizeMode="cover"
                                            />
                                        )}
                                        {editingCar?.image && !selectedImage && (
                                            <View style={styles.currentImageContainer}>
                                                <Text style={styles.currentImageLabel}>Imagem atual:</Text>
                                                <Image
                                                    source={{ uri: editingCar.image }}
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
                                                onPress={() => {
                                                    setModalVisible(false);
                                                    setEditingCar(null);
                                                }}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.formButton, styles.submitButton]}
                                                onPress={() => handleSubmit()}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {editingCar ? 'Atualizar' : 'Criar'}
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
                visible={alertVisible}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}
