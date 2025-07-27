import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { Formik } from 'formik';
import { TextInputMask } from 'react-native-masked-text';
import AlertComponent from '../../../components/AlertComponent';
import { Picker } from '@react-native-picker/picker';
import { transportTypesPicker } from '../../../util/types/transportTypes';
import { PerfilViewModel } from './PerfilViewModel';
import { validationSchema, initialFormValues, ProfileFormData } from './PerfilModel';

export default function Perfil() {
    const perfilViewModel = PerfilViewModel();

    if (!perfilViewModel.user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Usuário não autenticado.</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={perfilViewModel.editFields ? perfilViewModel.pickImage : undefined} style={styles.avatarCircle}>
                        {perfilViewModel.selectedImage ? (
                            <Image source={{ uri: perfilViewModel.selectedImage.uri }} style={{ width: 90, height: 90, borderRadius: 45 }} />
                        ) : perfilViewModel.user.image ? (
                            <Image source={{ uri: perfilViewModel.user.image }} style={{ width: 90, height: 90, borderRadius: 45 }} />
                        ) : (
                            <MaterialIcons name="person" size={64} color="#fff" />
                        )}
                        {perfilViewModel.editFields && (
                            <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', borderRadius: 12, padding: 4 }}>
                                <MaterialIcons name="photo-camera" size={20} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    {perfilViewModel.editFields && (
                        <TouchableOpacity onPress={perfilViewModel.pickImage} style={{ marginTop: 8 }}>
                            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>{perfilViewModel.selectedImage ? 'Trocar Foto' : 'Escolher Foto'}</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.name}>{perfilViewModel.user.name}</Text>
                    <Text style={styles.role}>Motorista</Text>
                </View>
                <Formik
                    initialValues={{
                        email: perfilViewModel.user.email || '',
                        name: perfilViewModel.user.name || '',
                        phone: perfilViewModel.user.phone || '',
                        transport_type: perfilViewModel.user.transport_type || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={perfilViewModel.handleSave}
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
                                    editable={perfilViewModel.editFields}
                                />
                            </View>
                            {touched.email && errors.email && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{String(errors.email)}</Text>
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
                                    editable={perfilViewModel.editFields}
                                />
                            </View>
                            {touched.name && errors.name && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{String(errors.name)}</Text>
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
                                    editable={perfilViewModel.editFields}
                                />
                            </View>
                            {touched.phone && errors.phone && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{String(errors.phone)}</Text>
                            )}

                            <View style={styles.infoRow}>
                                <MaterialIcons name={perfilViewModel.getTransportIcon(values.transport_type) as any} size={22} color="#007AFF" />
                                {perfilViewModel.editFields ? (
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={values.transport_type}
                                            onValueChange={(itemValue) => setFieldValue('transport_type', itemValue)}
                                            style={styles.picker}
                                            enabled={perfilViewModel.editFields}
                                        >
                                            {transportTypesPicker.map((type) => (
                                                <Picker.Item key={type.value} label={type.label} value={type.value} />
                                            ))}
                                        </Picker>
                                    </View>
                                ) : (
                                    <Text style={styles.infoText}>
                                        {transportTypesPicker.find(t => t.value === values.transport_type)?.label || 'Não informado'}
                                    </Text>
                                )}
                            </View>

                            {touched.transport_type && errors.transport_type && (
                                <Text style={{ color: 'red', marginLeft: 34, marginTop: -12, marginBottom: 12 }}>{String(errors.transport_type)}</Text>
                            )}

                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
                                <TouchableOpacity onPress={() => perfilViewModel.handleLogOut()} style={styles.btnLogout}>
                                    <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>Sair</Text>
                                </TouchableOpacity>

                                {
                                    !perfilViewModel.editFields
                                        ? (
                                            <TouchableOpacity onPress={perfilViewModel.toggleEditFields} style={styles.btnSave} disabled={perfilViewModel.loading}>
                                                <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>Editar</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={handleSubmit as any} style={styles.btnSave} disabled={perfilViewModel.loading}>
                                                {perfilViewModel.loading ? (
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
                    <TouchableOpacity onPress={perfilViewModel.handleDeleteAccount} style={styles.btnDelete}>
                        <Text style={styles.btnDeleteText}>Deletar Conta</Text>
                    </TouchableOpacity>
                </View>
                <AlertComponent
                    visible={perfilViewModel.alertVisible}
                    type={perfilViewModel.alertType}
                    title={perfilViewModel.alertTitle}
                    message={perfilViewModel.alertMessage}
                    onClose={() => perfilViewModel.setAlertVisible(false)}
                    autoClose={true}
                    autoCloseTime={3000}
                />
            </View>
        </ScrollView>
    );
}

