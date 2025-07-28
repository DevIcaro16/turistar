import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../contexts/auth';
import api from '../../../util/api/api';
import { TourPackageData, TourPackageFormData } from './TourPackageModel';

export function useTourPackageViewModel() {
    const { user } = useContext<any>(AuthContext);
    const [tourPackages, setTourPackages] = useState<TourPackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTourPackage, setEditingTourPackage] = useState<TourPackageData | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [cars, setCars] = useState<any[]>([]);
    const [touristPoints, setTouristPoints] = useState<any[]>([]);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchTourPackages = async () => {
        try {
            const response = await api.get(`/TourPackage/driver/${user.id}`);
            setTourPackages(response.data.tourPackages || []);
        } catch (error: any) {
            console.error('Erro ao buscar pacotes de passeio do motorista: ', error);
            showAlert('Erro ao carregar pacotes de passeio do motorista: ', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchCarsAndTouristPoints = async () => {
        try {
            const carsRes = await api.get(`/car/driver/${user.id}`);
            setCars(carsRes.data.cars || carsRes.data || []);
        } catch (e) {
            setCars([]);
        }
        try {
            const tpRes = await api.get(`/TouristPoint/driver/${user.id}`);
            setTouristPoints(tpRes.data.touristPoints || tpRes.data || []);
        } catch (e) {
            setTouristPoints([]);
        }
    };

    useEffect(() => {
        fetchTourPackages();
    }, []);

    useEffect(() => {
        if (modalVisible) {
            fetchCarsAndTouristPoints();
        }
    }, [modalVisible]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTourPackages();
    };

    const fetchAddressFromLatLong = async (
        lat: string,
        long: string,
        setFieldValue: any
    ) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
            // console.log('URL:', url);

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'app-passeios-turisticos/1.0',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            // console.log('Data:', data);

            if (data && data.address) {
                setFieldValue('city', data.address.city || data.address.town || data.address.village || '');
                setFieldValue('uf', data.address.state || '');

                const addressComplete = (data.address.road ?? 'Rua indefinida') + ', ' + (data.address.neighbourhood ?? 'Bairro indefinido') + ', ' + (data.address.suburb ?? 'Região indefinida');

                setFieldValue('name', addressComplete || '');
            }
        } catch (e) {
            console.error('Erro no fetchAddressFromLatLong:', e);
        }
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

    const handleCreateTourPackage = async (values: TourPackageData) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('origin_local', values.origin_local);
            formData.append('destiny_local', values.destiny_local);
            formData.append('date_tour', values.date_tour);
            formData.append('price', String(values.price));
            formData.append('seatsAvailable', String(values.seatsAvailable));
            formData.append('type', values.type);
            formData.append('carId', values.carId);
            formData.append('touristPointId', values.touristPointId);

            if (selectedImage) {
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'TourPackage.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            await api.post('/TourPackage/registration', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showAlert('Pacote de Passeio criado com sucesso!');
            setModalVisible(false);
            setSelectedImage(null);
            fetchTourPackages();
        } catch (error: any) {
            console.error('Erro ao criar Pacote de Passeio: ', error);
            showAlert(error.response?.data?.message || 'Erro ao criar Pacote de Passeio', 'error');
        }
    };

    const handleUpdateTourPackage = async (values: TourPackageData) => {
        if (!editingTourPackage) return;
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('origin_local', values.origin_local);
                formData.append('destiny_local', values.destiny_local);
                formData.append('date_tour', values.date_tour);
                formData.append('price', values.price);
                formData.append('seatsAvailable', values.seatsAvailable);
                formData.append('type', values.type);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'TourPackage.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.put(`/TourPackage/${editingTourPackage.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.put(`/TourPackage/${editingTourPackage.id}`, {
                    title: values.title,
                    origin_local: values.origin_local,
                    destiny_local: values.destiny_local,
                    date_tour: values.date_tour,
                    price: values.price,
                    seatsAvailable: values.seatsAvailable,
                    type: values.type,
                });
            }
            showAlert('Pacote de Passeio atualizado com sucesso!');
            setModalVisible(false);
            setEditingTourPackage(null);
            setSelectedImage(null);
            fetchTourPackages();
        } catch (error: any) {
            console.error('Erro ao atualizar Pacote de Passeio:', error);
            showAlert(error.response?.data?.message || 'Erro ao atualizar Pacote de Passeio', 'error');
        }
    };

    const handleDeleteTourPackage = (tourPackage: TourPackageData) => {
        Alert.alert(
            'Confirmar exclusão',
            `Tem certeza que deseja excluir o Pacote de Passeio ${tourPackage.title}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/TourPackage/${tourPackage.id}`);
                            showAlert('Pacote de Passeio excluído com sucesso!');
                            fetchTourPackages();
                        } catch (error: any) {
                            showAlert(error.response?.data?.message || 'Erro ao excluir Pacote de Passeio', 'error');
                        }
                    }
                }
            ]
        );
    };

    const openCreateModal = () => {
        setEditingTourPackage(null);
        setSelectedImage(null);
        setModalVisible(true);
    };

    const openEditModal = (tourPackage: TourPackageData) => {
        setEditingTourPackage(tourPackage);
        setSelectedImage(null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingTourPackage(null);
        setSelectedImage(null);
    };

    const formatDate = (date: Date | string) => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getInitialValues = () => {
        if (editingTourPackage) {
            return {
                title: editingTourPackage.title || '',
                origin_local: editingTourPackage.origin_local || '',
                destiny_local: editingTourPackage.destiny_local || '',
                date_tour: editingTourPackage.date_tour ? formatDate(editingTourPackage.date_tour) : '',
                time_tour: '',
                price: editingTourPackage.price ? String(editingTourPackage.price) : '',
                seatsAvailable: editingTourPackage.seatsAvailable ? String(editingTourPackage.seatsAvailable) : '',
                type: editingTourPackage.type || '',
                carId: editingTourPackage.carId || '',
                touristPointId: editingTourPackage.touristPointId || '',
            };
        }
        return {
            title: '',
            origin_local: '',
            destiny_local: '',
            date_tour: '',
            time_tour: '',
            price: '',
            seatsAvailable: '',
            type: '',
            carId: '',
            touristPointId: '',
        };
    };

    const handleSubmit = (values: TourPackageFormData) => {
        const [day, month, year] = values.date_tour.split('/');
        const [hour, minute] = values.time_tour.split(':');
        const isoDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
        isoDate.setHours(isoDate.getHours() - 3);

        const payload: TourPackageData = {
            ...values,
            date_tour: isoDate.toISOString(),
            price: Number(values.price),
            seatsAvailable: Number(values.seatsAvailable),
            isRunning: false,
            isFinalised: false,
            id: editingTourPackage?.id || '',
            image: editingTourPackage?.image,
        };

        if (editingTourPackage) {
            handleUpdateTourPackage(payload);
        } else {
            handleCreateTourPackage(payload);
        }
    };

    return {
        tourPackages,
        loading,
        refreshing,
        modalVisible,
        editingTourPackage,
        alertVisible,
        alertMessage,
        alertType,
        selectedImage,
        cars,
        touristPoints,

        showAlert,
        fetchTourPackages,
        onRefresh,
        fetchAddressFromLatLong,
        pickImage,
        handleCreateTourPackage,
        handleUpdateTourPackage,
        handleDeleteTourPackage,
        openCreateModal,
        openEditModal,
        closeModal,
        formatDate,
        getInitialValues,
        handleSubmit,
        setModalVisible,
        setAlertVisible,
        setEditingTourPackage,
        setSelectedImage,
    };
} 