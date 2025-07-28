import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { AuthContext } from '../../../contexts/auth';
import api from '../../../util/api/api';
import { TouristPoint, TouristPointFormData } from './TouristPointModel';

export function useTouristPointViewModel() {
    const { user } = useContext<any>(AuthContext);
    const [touristPoint, setTouristPoint] = useState<TouristPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTouristPoint, setEditingTouristPoint] = useState<TouristPoint | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchTouristPoint = async () => {
        try {
            const response = await api.get(`/TouristPoint/driver/${user.id}`);
            setTouristPoint(response.data.touristPoints || []);
        } catch (error: any) {
            console.error('Erro ao buscar pontos turisticos do motorista: ', error);
            showAlert('Erro ao carregar pontos turisticos do motorista: ', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTouristPoint();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTouristPoint();
    };

    const fetchAddressFromLatLong = async (
        lat: number,
        long: number,
        setFieldValue: any
    ) => {
        setIsLoadingAddress(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Turistar/1.0 (suporte.turistarturismo@dgmail.com)'
                    }
                }
            );
            const data = await response.json();

            // console.log(data);

            if (data.address) {
                // Mapear cidade - priorizar city, depois municipality, depois suburb
                const city = data.address.city || data.address.municipality || data.address.suburb || '';
                setFieldValue('city', city);

                // Mapear estado - extrair sigla do state ou ISO3166-2-lvl4
                let state = '';
                if (data.address.state) {
                    // Mapear nomes completos para siglas
                    const stateMapping: { [key: string]: string } = {
                        'Ceará': 'CE',
                        'São Paulo': 'SP',
                        'Rio de Janeiro': 'RJ',
                        'Minas Gerais': 'MG',
                        'Bahia': 'BA',
                        'Pernambuco': 'PE',
                        'Paraná': 'PR',
                        'Rio Grande do Sul': 'RS',
                        'Santa Catarina': 'SC',
                        'Goiás': 'GO',
                        'Maranhão': 'MA',
                        'Mato Grosso': 'MT',
                        'Mato Grosso do Sul': 'MS',
                        'Pará': 'PA',
                        'Paraíba': 'PB',
                        'Piauí': 'PI',
                        'Rio Grande do Norte': 'RN',
                        'Rondônia': 'RO',
                        'Roraima': 'RR',
                        'Sergipe': 'SE',
                        'Tocantins': 'TO',
                        'Acre': 'AC',
                        'Alagoas': 'AL',
                        'Amapá': 'AP',
                        'Amazonas': 'AM',
                        'Distrito Federal': 'DF',
                        'Espírito Santo': 'ES'
                    };
                    state = stateMapping[data.address.state] || data.address.state;
                } else if (data.address['ISO3166-2-lvl4']) {
                    // Extrair sigla do código ISO (ex: "BR-CE" -> "CE")
                    const isoCode = data.address['ISO3166-2-lvl4'];
                    state = isoCode.split('-')[1] || '';
                }
                setFieldValue('uf', state);

                // Preencher nome do local automaticamente
                const road = data.address.road || '';
                const neighbourhood = data.address.neighbourhood || '';
                const suburb = data.address.suburb || '';
                const nameParts = [road, neighbourhood, suburb].filter(Boolean);
                if (nameParts.length > 0) {
                    setFieldValue('name', nameParts.join(', '));
                }

                // console.log('Dados mapeados:', { city, state });
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
        } finally {
            setIsLoadingAddress(false);
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

    const handleCreateTouristPoints = async (values: TouristPointFormData) => {
        setLoading(true);
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('city', values.city);
                formData.append('uf', values.uf);
                formData.append('driverId', user.id);
                if (values.latitude) formData.append('latitude', values.latitude);
                if (values.longitude) formData.append('longitude', values.longitude);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'touristpoint.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.post('/TouristPoint', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.post('/TouristPoint', {
                    name: values.name,
                    city: values.city,
                    uf: values.uf,
                    driverId: user.id,
                    latitude: values.latitude || undefined,
                    longitude: values.longitude || undefined,
                });
            }
            showAlert('Ponto turístico criado com sucesso!');
            setModalVisible(false);
            setSelectedImage(null);
            fetchTouristPoint();
        } catch (error: any) {
            showAlert(error.response?.data?.message || 'Erro ao criar ponto turístico', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTouristPoint = async (values: TouristPointFormData) => {
        setLoading(true);
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('city', values.city);
                formData.append('uf', values.uf);
                formData.append('driverId', user.id);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'touristpoint.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.put(`/TouristPoint/${editingTouristPoint?.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.put(`/TouristPoint/${editingTouristPoint?.id}`, {
                    name: values.name,
                    city: values.city,
                    uf: values.uf,
                    driverId: user.id,
                });
            }
            showAlert('Ponto turístico atualizado com sucesso!');
            setModalVisible(false);
            setEditingTouristPoint(null);
            setSelectedImage(null);
            fetchTouristPoint();
        } catch (error: any) {
            showAlert(error.response?.data?.message || 'Erro ao atualizar ponto turístico', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTouristPoint = (point: TouristPoint) => {
        Alert.alert(
            'Confirmar exclusão',
            `Deseja realmente excluir o ponto turístico "${point.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await api.delete(`/TouristPoint/${point.id}`);
                            showAlert('Ponto turístico excluído com sucesso!');
                            fetchTouristPoint();
                        } catch (error: any) {
                            showAlert(error.response?.data?.message || 'Erro ao excluir ponto turístico', 'error');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const openCreateModal = () => {
        setEditingTouristPoint(null);
        setSelectedImage(null);
        setModalVisible(true);
    };

    const openEditModal = (point: TouristPoint) => {
        setEditingTouristPoint(point);
        setSelectedImage(null);
        setModalVisible(true);
    };

    const openLocation = (point: TouristPoint) => {
        if (point.latitude && point.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;
            Linking.openURL(url);
        } else {
            showAlert('Localização não disponível para este ponto turístico', 'error');
        }
    };

    return {
        touristPoint,
        loading,
        refreshing,
        modalVisible,
        editingTouristPoint,
        alertVisible,
        alertMessage,
        alertType,
        selectedImage,
        showAlert,
        fetchTouristPoint,
        onRefresh,
        fetchAddressFromLatLong,
        pickImage,
        handleCreateTouristPoints,
        handleUpdateTouristPoint,
        handleDeleteTouristPoint,
        openCreateModal,
        openEditModal,
        openLocation,
        setModalVisible,
        setAlertVisible,
        isLoadingAddress,
    };
} 