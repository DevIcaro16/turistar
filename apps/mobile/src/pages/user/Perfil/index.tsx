import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { AuthContext } from '../../../contexts/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../../util/api/api';
import { TextInputMask } from 'react-native-masked-text';
import AlertComponent from '../../../components/AlertComponent';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email Inválido!").required("Email é Obrigatório!"),
    name: Yup.string().required('Nome é obrigatório'),
    phone: Yup.string().required('Telefone é obrigatório'),
});

export default function Perfil() {
    const { user, signOut } = useContext(AuthContext);
    console.log(user);
    const [loading, setLoading] = useState(false);

    // Estado local para o AlertComponent
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [editFields, setEditFields] = useState<boolean>(true);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertTitle, setAlertTitle] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    function toggleEditFields() {
        setEditFields((prev) => !prev);
    }

    function showLocalAlert(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    }

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

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Usuário não autenticado.</Text>
            </View>
        );
    }

    const handleSave = async (values: any) => {
        setLoading(true);
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('email', values.email);
                formData.append('name', values.name);
                formData.append('phone', values.phone);
                formData.append('file', {
                    uri: selectedImage.uri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                } as any);
                await api.put(`/user/${user.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.put(`/user/${user.id}`, {
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
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

    const handlDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/user/${user.id}`);
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
            { cancelable: false } // ← não fecha ao tocar fora no Android
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Deletar Conta',
            'Tem certeza que deseja deletar sua conta? Esta ação não poderá ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: () => handlDelete() }
            ]
        );
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={editFields ? pickImage : undefined} style={styles.avatarCircle}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage.uri }} style={{ width: 90, height: 90, borderRadius: 45 }} />
                        ) : user.image ? (
                            <Image source={{ uri: user.image }} style={{ width: 90, height: 90, borderRadius: 45 }} />
                        ) : (
                            <MaterialIcons name="person" size={64} color="#fff" />
                        )}
                        {editFields && (
                            <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', borderRadius: 12, padding: 4 }}>
                                <MaterialIcons name="photo-camera" size={20} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    {editFields && (
                        <TouchableOpacity onPress={pickImage} style={{ marginTop: 8 }}>
                            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>{selectedImage ? 'Trocar Foto' : 'Escolher Foto'}</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.role}>Usuário comum</Text>
                </View>
                <Formik
                    initialValues={{
                        email: user.email || '',
                        name: user.name || '',
                        phone: user.phone || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                    enableReinitialize
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={styles.infoContainer}>

                            <View style={styles.infoRow}>
                                <MaterialIcons name="email" size={22} color="#007AFF" />
                                <TextInput
                                    style={[styles.infoText, styles.input]}
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    placeholder="Email"
                                    placeholderTextColor="#8E8E93"
                                    editable={editFields}
                                />
                            </View>
                            {touched.email && errors.email && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{errors.email}</Text>
                            )}

                            <View style={styles.infoRow}>
                                <MaterialIcons name="person" size={22} color="#007AFF" />
                                <TextInput
                                    style={[styles.infoText, styles.input]}
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    placeholder="Nome"
                                    placeholderTextColor="#8E8E93"
                                    editable={editFields}
                                />
                            </View>
                            {touched.name && errors.name && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{errors.name}</Text>
                            )}

                            <View style={styles.infoRow}>
                                <MaterialIcons name="phone" size={22} color="#007AFF" />
                                <TextInputMask
                                    type={'cel-phone'}
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                        dddMask: '(99) '
                                    }}
                                    style={styles.input}
                                    placeholder="Digite seu Telefone"
                                    value={values.phone}
                                    maxLength={16}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={editFields}
                                />
                            </View>
                            {touched.phone && errors.phone && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{errors.phone}</Text>
                            )}


                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
                                <TouchableOpacity onPress={() => handleLogOut()} style={styles.btnLogout}>
                                    <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>Sair</Text>
                                </TouchableOpacity>

                                {
                                    !editFields
                                        ? (
                                            <TouchableOpacity onPress={toggleEditFields} style={styles.btnSave} disabled={loading}>
                                                <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>Editar</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={handleSubmit as any} style={styles.btnSave} disabled={loading}>
                                                {loading ? (
                                                    <ActivityIndicator color="#FFF" />
                                                ) : (
                                                    <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>Salvar</Text>
                                                )}
                                            </TouchableOpacity>
                                        )
                                }
                            </View>

                        </View>

                    )}
                </Formik>

                {/* Danger Zone */}
                <View style={styles.dangerZoneContainer}>
                    <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
                    <TouchableOpacity onPress={handleDeleteAccount} style={styles.btnDelete}>
                        <Text style={styles.btnDeleteText}>Deletar Conta</Text>
                    </TouchableOpacity>
                </View>
                <AlertComponent
                    visible={alertVisible}
                    type={alertType}
                    title={alertTitle}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                    autoClose={true}
                    autoCloseTime={3000}
                />
            </View>
        </ScrollView>
    );
}

