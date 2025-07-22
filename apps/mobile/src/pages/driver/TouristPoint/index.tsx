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
import { adaptViewConfig } from 'react-native-reanimated/lib/typescript/ConfigHelper';
import * as Linking from 'expo-linking';

interface TouristPoint {
    id: string;
    name: string;
    city: string;
    uf: string;
    driverId: string;
    image?: string;
    latitude?: string;
    longitude?: string;
};

interface TouristPointData {
    id: string;
    name: string;
    city: string;
    uf: string;
    driverId: string;
    image?: string;
    latitude?: string;
    longitude?: string;
}


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nome do local é obrigatório'),
    city: Yup.string().required('Cidade é obrigatório'),
    uf: Yup.string().required('Estado é obrigatório'),
});

export default function TouristPointManagement() {
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
        lat: string,
        long: string,
        setFieldValue: any
    ) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
            console.log('URL:', url);

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'app-passeios-turisticos/1.0', // obrigatório pelo Nominatim
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data:', data);

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

    const handleCreateTouristPoints = async (values: TouristPointData) => {
        try {

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('city', values.city);
            formData.append('uf', values.uf);
            formData.append('latitude', values.latitude);
            formData.append('longitude', values.longitude);
            formData.append('driverId', user.id);

            if (selectedImage) {
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'touristpoint.jpg',
                    type: 'image/jpeg',
                } as any);
            }
            await api.post('/touristPoint/registration', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showAlert('Carro criado com sucesso!');
            setModalVisible(false);
            setSelectedImage(null);
            fetchTouristPoint();
        } catch (error: any) {
            console.error('Erro ao criar Ponto Turístico: ', error);
            showAlert(error.response?.data?.message || 'Erro ao criar Ponto Turístico', 'error');
        }
    };

    const handleUpdateTouristPoint = async (values: TouristPointData) => {
        if (!editingTouristPoint) return;

        try {
            // Se houver nova imagem selecionada, envia como multipart/form-data
            if (selectedImage) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('city', values.city);
                formData.append('uf', values.uf);
                formData.append('latitude', values.latitude);
                formData.append('longitude', values.longitude);
                formData.append('driverId', user.id);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'touristpoint.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.put(`/touristPoint/${editingTouristPoint.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Caso contrário, envia como JSON normal
                await api.put(`/touristPoint/${editingTouristPoint.id}`, {
                    name: values.name,
                    city: values.city,
                    uf: values.uf,
                    latitude: values.latitude,
                    longitude: values.longitude,
                });
            }

            showAlert('Ponto Turistíco atualizado com sucesso!');
            setModalVisible(false);
            setEditingTouristPoint(null);
            setSelectedImage(null);
            fetchTouristPoint();
        } catch (error: any) {
            console.error('Erro ao atualizar ponto turístico:', error);
            showAlert(error.response?.data?.message || 'Erro ao atualizar ponto turístico', 'error');
        }
    };

    const handleDeleteTouristPoint = (point: TouristPoint) => {

        Alert.alert(
            'Confirmar exclusão',
            `Tem certeza que deseja excluir o Ponto Turístico ${point.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/touristPoint/${point.id}`);
                            showAlert('Ponto Turístico excluído com sucesso!');
                            fetchTouristPoint();
                        } catch (error: any) {
                            showAlert(error.response?.data?.message || 'Erro ao excluir ponto turístico', 'error');
                        }
                    }
                }
            ]
        );
    };

    const openCreateModal = () => {
        setEditingTouristPoint(null);
        setModalVisible(true);
    };

    const openEditModal = (point: TouristPoint) => {
        setEditingTouristPoint(point);
        setModalVisible(true);
    };

    const renderTouristPointCard = ({ item }: { item: TouristPoint }) => (
        <View style={styles.carCard}>
            <View style={styles.carImageContainer}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.carCardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <MaterialIcons name="beach-access" size={64} color="#C7C7CC" />
                )}
            </View>
            <View style={styles.carHeader}>
                <MaterialIcons name="landscape" size={24} color="#007AFF" />
                <Text style={styles.carType}>{item.name}</Text>
            </View>
            <Text style={styles.carModel}>{item.city} - {item.uf}</Text>
            <Text style={styles.carCapacity}>Lat: {item.latitude} | Long: {item.longitude}</Text>
            {/* Botão Google Maps */}
            {item.latitude && item.longitude && !isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude)) && (
                <TouchableOpacity
                    style={{ marginTop: 4, marginBottom: 24, alignSelf: 'flex-start' }}
                    onPress={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
                        Linking.openURL(url);
                    }}
                >
                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Visualizar no Google Maps</Text>
                </TouchableOpacity>
            )}
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
                    onPress={() => handleDeleteTouristPoint(item)}
                >
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="tour" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Você não tem nenhum Ponto turistico cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Toque no botão + para adicionar um ponto turístico
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando pontos turisticos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Pontos turísticos</Text>
                <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={touristPoint}
                renderItem={renderTouristPointCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={touristPoint.length === 0 ? styles.emptyList : styles.listContainer}
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
                    setEditingTouristPoint(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingTouristPoint ? 'Editar Ponto Turístico' : 'Novo Ponto Turístico'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingTouristPoint(null);
                                }}
                            >
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView

                        >
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    id: editingTouristPoint?.id || '',
                                    driverId: editingTouristPoint?.driverId || user.id || '',
                                    name: editingTouristPoint?.name || '',
                                    city: editingTouristPoint?.city || '',
                                    uf: editingTouristPoint?.uf || '',
                                    latitude: editingTouristPoint?.latitude || '',
                                    longitude: editingTouristPoint?.longitude || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={editingTouristPoint ? handleUpdateTouristPoint : handleCreateTouristPoints}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <View style={styles.form}>
                                        {/* Latitude e Longitude no topo */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Latitude</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="my-location" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: -12.9714"
                                                    value={values.latitude}
                                                    onChangeText={(text) => {
                                                        setFieldValue('latitude', text);
                                                        if (
                                                            text &&
                                                            values.longitude &&
                                                            !isNaN(Number(text)) &&
                                                            !isNaN(Number(values.longitude))
                                                        ) {
                                                            console.log(text)
                                                            fetchAddressFromLatLong(text, values.longitude, setFieldValue);
                                                        }
                                                    }}
                                                    onBlur={handleBlur('latitude')}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Longitude</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="my-location" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: -38.5014"
                                                    value={values.longitude}
                                                    onChangeText={(text) => {
                                                        setFieldValue('longitude', text);
                                                        if (
                                                            text &&
                                                            values.latitude &&
                                                            !isNaN(Number(text)) &&
                                                            !isNaN(Number(values.latitude))
                                                        ) {
                                                            fetchAddressFromLatLong(values.latitude, text, setFieldValue);
                                                        }
                                                    }}
                                                    onBlur={handleBlur('longitude')}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            {/* Botão Google Maps */}
                                            {values.latitude && values.longitude && !isNaN(Number(values.latitude)) && !isNaN(Number(values.longitude)) && (
                                                <TouchableOpacity
                                                    style={{ marginTop: 8, alignSelf: 'flex-end' }}
                                                    onPress={() => {
                                                        const url = `https://www.google.com/maps/search/?api=1&query=${values.latitude},${values.longitude}`;
                                                        Linking.openURL(url);
                                                    }}
                                                >
                                                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Visualizar no Google Maps</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        {/* Botão de imagem e preview */}
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
                                        {/* Demais campos */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Nome do Local</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="place" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Praia do Forte"
                                                    value={values.name}
                                                    onChangeText={handleChange('name')}
                                                    onBlur={handleBlur('name')}
                                                />
                                            </View>
                                            {touched.name && errors.name && (
                                                <Text style={styles.errorText}>{errors.name}</Text>
                                            )}
                                        </View>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Cidade</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="location-city" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Salvador"
                                                    value={values.city}
                                                    onChangeText={handleChange('city')}
                                                    onBlur={handleBlur('city')}
                                                />
                                            </View>
                                            {touched.city && errors.city && (
                                                <Text style={styles.errorText}>{errors.city}</Text>
                                            )}
                                        </View>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Estado (UF)</Text>
                                            <View style={styles.inputContainer}>
                                                <MaterialIcons name="map" size={20} color="#8E8E93" />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: BA"
                                                    value={values.uf}
                                                    onChangeText={handleChange('uf')}
                                                    onBlur={handleBlur('uf')}
                                                    maxLength={2}
                                                />
                                            </View>
                                            {touched.uf && errors.uf && (
                                                <Text style={styles.errorText}>{errors.uf}</Text>
                                            )}
                                        </View>
                                        <View style={styles.formActions}>
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.cancelButton]}
                                                onPress={() => {
                                                    setModalVisible(false);
                                                    setEditingTouristPoint(null);
                                                }}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.submitButton]}
                                                onPress={() => handleSubmit()}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {editingTouristPoint ? 'Atualizar' : 'Criar'}
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

