import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../contexts/auth';
import api from '../../../util/api/api';
import { transportTypesPicker } from '../../../util/types/transportTypes';
import { ProfileFormData } from './PerfilModel';

export function PerfilViewModel(): {
    user: any;
    loading: boolean;
    editFields: boolean;
    alertVisible: boolean;
    alertType: 'success' | 'error' | 'warning' | 'info';
    alertTitle: string;
    alertMessage: string;
    selectedImage: any;
    toggleEditFields: () => void;
    showLocalAlert: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
    getTransportIcon: (type: string) => string;
    pickImage: () => Promise<void>;
    handleSave: (values: ProfileFormData) => Promise<void>;
    handleDelete: () => Promise<void>;
    handleLogOut: () => void;
    handleDeleteAccount: () => void;
    setAlertVisible: (visible: boolean) => void;
} {

    const { user, signOut } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [editFields, setEditFields] = useState<boolean>(true);
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertTitle, setAlertTitle] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const toggleEditFields = () => {
        setEditFields((prev) => !prev);
    };

    const showLocalAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const getTransportIcon = (type: string) => {
        switch (type) {
            case 'CAR':
                return 'directions-car';
            case 'MOTORCYCLE':
                return 'motorcycle';
            case 'VAN':
                return 'local-shipping';
            case 'BUS':
                return 'directions-bus';
            case 'TRUCK':
                return 'local-shipping';
            default:
                return 'directions-car';
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

    const handleSave = async (values: ProfileFormData) => {
        setLoading(true);
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('email', values.email);
                formData.append('name', values.name);
                formData.append('phone', values.phone);
                formData.append('transportType', values.transport_type);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.put(`/driver/${user?.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.put(`/driver/${user?.id}`, {
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    transportType: values.transport_type,
                });
            }
            showLocalAlert('success', 'Perfil atualizado!', 'As informações foram salvas.');
        } catch (error: any) {
            showLocalAlert('error', 'Erro', error.response?.data?.message || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
            setEditFields(false);
            setSelectedImage(null);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/driver/${user?.id}`);
            showLocalAlert('info', 'Conta deletada!', 'Sua conta foi removida com sucesso!');
            signOut();
        } catch (error: any) {
            showLocalAlert('error', 'Erro', error.response?.data?.message || 'Erro ao deletar conta');
        } finally {
            setLoading(false);
        }
    };

    const handleLogOut = async () => {
        Alert.alert(
            'Confirmar ação',
            'Deseja realmente sair do app?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancelado'),
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    onPress: () => signOut(),
                },
            ],
            { cancelable: false }
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Deletar Conta',
            'Tem certeza que deseja deletar sua conta? Esta ação não poderá ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: () => handleDelete() }
            ]
        );
    };

    return {
        // State
        user,
        loading,
        editFields,
        alertVisible,
        alertType,
        alertTitle,
        alertMessage,
        selectedImage,

        // Methods
        toggleEditFields,
        showLocalAlert,
        getTransportIcon,
        pickImage,
        handleSave,
        handleDelete,
        handleLogOut,
        handleDeleteAccount,
        setAlertVisible,
    };
} 