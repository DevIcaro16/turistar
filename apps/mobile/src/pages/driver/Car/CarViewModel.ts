import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../contexts/auth';
import api from '../../../util/api/api';
import { transportOptions } from '../../../util/types/transportTypes';
import { Car, CarFormData } from './CarModel';

export function useCarViewModel() {
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
        setEditingCar(car);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingCar(null);
        setSelectedImage(null);
    };

    const getTransportIcon = (type: string) => {
        const option = transportOptions.find(opt => opt.value === type);
        return option?.icon || 'directions-car';
    };

    const getTransportLabel = (type: string) => {
        const option = transportOptions.find(opt => opt.value === type);
        return option?.label || type;
    };

    return {

        cars,
        loading,
        refreshing,
        modalVisible,
        editingCar,
        alertVisible,
        alertMessage,
        alertType,
        selectedImage,

        showAlert,
        fetchCars,
        onRefresh,
        pickImage,
        handleCreateCar,
        handleUpdateCar,
        handleDeleteCar,
        openCreateModal,
        openEditModal,
        closeModal,
        getTransportIcon,
        getTransportLabel,
        setAlertVisible,
    };
} 