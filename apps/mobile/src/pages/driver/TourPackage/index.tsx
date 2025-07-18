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
import * as ImagePicker from 'expo-image-picker';
import { adaptViewConfig } from 'react-native-reanimated/lib/typescript/ConfigHelper';
import * as Linking from 'expo-linking';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';

interface TourPackageData {
    id: string;
    title: string;
    image?: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string | Date;
    startDate?: Date;
    endDate?: Date;
    isRunning: boolean;
    isFinalised: boolean;
    price: number;
    seatsAvailable: number;
    vacancies?: number;
    type: string;
    carId: string;
    touristPointId: string;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Título é obrigatório'),
    origin_local: Yup.string().required('Origem é obrigatória'),
    destiny_local: Yup.string().required('Destino é obrigatório'),
    date_tour: Yup.string()
        .required('Data do passeio é obrigatória')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida')
        .test('valid-date', 'Data inválida', value => {
            if (!value) return false;
            const [day, month, year] = value.split('/');
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            const currentYear = new Date().getFullYear();
            return (
                date.getFullYear() === Number(year) &&
                date.getMonth() === Number(month) - 1 &&
                date.getDate() === Number(day) &&
                Number(year) >= currentYear &&
                Number(year) <= 2100
            );
        })
        .test('not-in-past', 'A data não pode ser anterior a hoje', value => {
            if (!value) return false;
            const [day, month, year] = value.split('/');
            const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return inputDate >= today;
        }),
    time_tour: Yup.string()
        .required('Horário é obrigatório')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
    price: Yup.number().typeError('Preço deve ser um número').required('Preço é obrigatório'),
    seatsAvailable: Yup.number().typeError('Vagas disponíveis deve ser um número').required('Vagas disponíveis é obrigatório').max(99, 'Número de vagas acima do comum.'),
    type: Yup.string().required('Tipo é obrigatório'),
    carId: Yup.string().required('Selecione um carro'),
    touristPointId: Yup.string().required('Selecione um ponto turístico'),
});

export default function TourPackageManagement() {

    const { user } = useContext<any>(AuthContext);
    const [TourPackage, setTourPackage] = useState<TourPackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTouristPoint, setEditingTouristPoint] = useState<TourPackageData | null>(null);
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

    const fetchTourPackage = async () => {
        try {
            const response = await api.get(`/TourPackage/driver/${user.id}`);
            setTourPackage(response.data.tourPackages || []);
        } catch (error: any) {
            console.error('Erro ao buscar pacotes de passeio do motorista: ', error);
            showAlert('Erro ao carregar pacotes de passeio do motorista: ', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTourPackage();
        // Buscar carros e pontos turísticos do motorista
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
        if (modalVisible) fetchCarsAndTouristPoints();
    }, [modalVisible]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTourPackage();
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

    const handleCreateTouristPoint = async (values: TourPackageData) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('origin_local', values.origin_local);
            formData.append('destiny_local', values.destiny_local);
            formData.append('date_tour', values.date_tour);
            formData.append('price', parseFloat(values.price));
            formData.append('seatsAvailable', values.seatsAvailable);
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
            fetchTourPackage();
        } catch (error: any) {
            console.error('Erro ao criar Pacote de Passeio: ', error);
            showAlert(error.response?.data?.message || 'Erro ao criar Pacote de Passeio', 'error');
        }
    };

    const handleUpdateTouristPoint = async (values: TourPackageData) => {
        if (!editingTouristPoint) return;
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
                await api.put(`/TourPackage/${editingTouristPoint.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.put(`/TourPackage/${editingTouristPoint.id}`, {
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
            setEditingTouristPoint(null);
            setSelectedImage(null);
            fetchTourPackage();
        } catch (error: any) {
            console.error('Erro ao atualizar Pacote de Passeio:', error);
            showAlert(error.response?.data?.message || 'Erro ao atualizar Pacote de Passeio', 'error');
        }
    };

    const handleDeleteTouristPoint = (point: TourPackageData) => {
        Alert.alert(
            'Confirmar exclusão',
            `Tem certeza que deseja excluir o Pacote de Passeio ${point.title}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/TourPackage/${point.id}`);
                            showAlert('Pacote de Passeio excluído com sucesso!');
                            fetchTourPackage();
                        } catch (error: any) {
                            showAlert(error.response?.data?.message || 'Erro ao excluir Pacote de Passeio', 'error');
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

    const openEditModal = (point: TourPackageData) => {
        setEditingTouristPoint(point);
        setModalVisible(true);
    };

    const renderTourPackageCard = ({ item }: { item: TourPackageData }) => (
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
                <Text style={styles.carType}>{item.title}</Text>
            </View>
            <Text style={styles.carModel}>{item.origin_local} - {item.destiny_local}</Text>
            {/* Adapte latitude/longitude se necessário */}
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
            <Text style={styles.emptyTitle}>Você não tem nenhum Pacote de Passeio cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Toque no botão + para adicionar um Pacote de Passeio
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando pacotes de passeio...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Pacotes</Text>
                <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={TourPackage}
                renderItem={renderTourPackageCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={TourPackage.length === 0 ? styles.emptyList : styles.listContainer}
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
                                {editingTouristPoint ? 'Editar Pacote de Passeio' : 'Novo Pacote de Passeio'}
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
                                initialValues={{
                                    title: editingTouristPoint?.title || '',
                                    origin_local: editingTouristPoint?.origin_local || '',
                                    destiny_local: editingTouristPoint?.destiny_local || '',
                                    date_tour: editingTouristPoint?.date_tour ? formatDate(editingTouristPoint.date_tour) : '',
                                    time_tour: '',
                                    price: editingTouristPoint?.price ? String(editingTouristPoint.price) : '',
                                    seatsAvailable: editingTouristPoint?.seatsAvailable ? String(editingTouristPoint.seatsAvailable) : '',
                                    type: editingTouristPoint?.type || '',
                                    carId: '',
                                    touristPointId: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
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
                                        id: editingTouristPoint?.id || '',
                                        image: editingTouristPoint?.image,
                                    };
                                    if (editingTouristPoint) {
                                        handleUpdateTouristPoint(payload);
                                    } else {
                                        handleCreateTouristPoint(payload);
                                    }
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <View style={styles.form}>
                                        {/* Picker de Carro */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Carro</Text>
                                            <View style={styles.inputContainer}>
                                                <Picker
                                                    selectedValue={values.carId}
                                                    onValueChange={handleChange('carId')}
                                                    style={styles.input}
                                                >
                                                    <Picker.Item label="Selecione um carro" value="" />
                                                    {cars.map((car) => (
                                                        <Picker.Item key={car.id} label={car.model || car.name || car.plate || car.id} value={car.id} />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {touched.carId && errors.carId && (
                                                <Text style={styles.errorText}>{errors.carId}</Text>
                                            )}
                                        </View>
                                        {/* Picker de Ponto Turístico */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Ponto Turístico</Text>
                                            <View style={styles.inputContainer}>
                                                <Picker
                                                    selectedValue={values.touristPointId}
                                                    onValueChange={handleChange('touristPointId')}
                                                    style={styles.input}
                                                >
                                                    <Picker.Item label="Selecione um ponto turístico" value="" />
                                                    {touristPoints.map((tp) => (
                                                        <Picker.Item key={tp.id} label={tp.name || tp.title || tp.id} value={tp.id} />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {touched.touristPointId && errors.touristPointId && (
                                                <Text style={styles.errorText}>{errors.touristPointId}</Text>
                                            )}
                                        </View>
                                        {/* Título */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Título</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Passeio à Praia"
                                                    value={values.title}
                                                    onChangeText={handleChange('title')}
                                                    onBlur={handleBlur('title')}
                                                />
                                            </View>
                                            {touched.title && errors.title && (
                                                <Text style={styles.errorText}>{errors.title}</Text>
                                            )}
                                        </View>
                                        {/* Origem */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Origem</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Salvador"
                                                    value={values.origin_local}
                                                    onChangeText={handleChange('origin_local')}
                                                    onBlur={handleBlur('origin_local')}
                                                />
                                            </View>
                                            {touched.origin_local && errors.origin_local && (
                                                <Text style={styles.errorText}>{errors.origin_local}</Text>
                                            )}
                                        </View>
                                        {/* Destino */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Destino</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Praia do Forte"
                                                    value={values.destiny_local}
                                                    onChangeText={handleChange('destiny_local')}
                                                    onBlur={handleBlur('destiny_local')}
                                                />
                                            </View>
                                            {touched.destiny_local && errors.destiny_local && (
                                                <Text style={styles.errorText}>{errors.destiny_local}</Text>
                                            )}
                                        </View>
                                        {/* Data do passeio */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Data do Passeio</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInputMask
                                                    type={'datetime'}
                                                    options={{ format: 'DD/MM/YYYY' }}
                                                    value={values.date_tour}
                                                    onChangeText={(text) => setFieldValue('date_tour', text)}
                                                    onBlur={handleBlur('date_tour')}
                                                    style={styles.input}
                                                    placeholder="DD/MM/AAAA"
                                                />
                                            </View>
                                            {touched.date_tour && errors.date_tour && (
                                                <Text style={styles.errorText}>{errors.date_tour}</Text>
                                            )}
                                        </View>
                                        {/* Horário do passeio */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Horário do Passeio</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInputMask
                                                    type={'custom'}
                                                    options={{ mask: '99:99' }}
                                                    value={values.time_tour}
                                                    onChangeText={handleChange('time_tour')}
                                                    onBlur={handleBlur('time_tour')}
                                                    style={styles.input}
                                                    placeholder="HH:MM"
                                                />
                                            </View>
                                            {touched.time_tour && errors.time_tour && (
                                                <Text style={styles.errorText}>{errors.time_tour}</Text>
                                            )}
                                        </View>

                                        {/* Preço */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Preço</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: 100.00"
                                                    value={values.price}
                                                    onChangeText={handleChange('price')}
                                                    onBlur={handleBlur('price')}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            {touched.price && errors.price && (
                                                <Text style={styles.errorText}>{errors.price}</Text>
                                            )}
                                        </View>
                                        {/* Vagas disponíveis */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Vagas Disponíveis</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: 10"
                                                    value={values.seatsAvailable}
                                                    onChangeText={handleChange('seatsAvailable')}
                                                    onBlur={handleBlur('seatsAvailable')}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            {touched.seatsAvailable && errors.seatsAvailable && (
                                                <Text style={styles.errorText}>{errors.seatsAvailable}</Text>
                                            )}
                                        </View>
                                        {/* Tipo */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Tipo</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: Turismo"
                                                    value={values.type}
                                                    onChangeText={handleChange('type')}
                                                    onBlur={handleBlur('type')}
                                                />
                                            </View>
                                            {touched.type && errors.type && (
                                                <Text style={styles.errorText}>{errors.type}</Text>
                                            )}
                                        </View>
                                        {/* Imagem */}
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
                                        {/* Botões de ação */}
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

function formatDate(date: Date | string) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

