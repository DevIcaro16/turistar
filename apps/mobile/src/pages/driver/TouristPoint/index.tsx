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
import { useTouristPointViewModel } from './TouristPointViewModel';
import { validationSchema, initialFormValues, TouristPoint, TouristPointFormData } from './types';

export default function TouristPointManagement() {
    const touristPointViewModel = useTouristPointViewModel();

    const renderTouristPointCard = ({ item }: { item: TouristPoint }) => (
        <View style={styles.carCard}>
            <View style={styles.carHeader}>
                <MaterialIcons name="place" size={24} color="#007AFF" />
                <Text style={styles.carType}>{item.name}</Text>
            </View>
            <Text style={styles.carModel}>{item.city}, {item.uf}</Text>
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.carCardImage} />
            )}
            <View style={styles.carActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => touristPointViewModel.openEditModal(item)}
                >
                    <MaterialIcons name="edit" size={20} color="#007AFF" />
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => touristPointViewModel.handleDeleteTouristPoint(item)}
                >
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
                {item.latitude && item.longitude && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => touristPointViewModel.openLocation(item)}
                    >
                        <MaterialIcons name="location-on" size={20} color="#34C759" />
                        <Text style={styles.editButtonText}>Localização</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="place" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Nenhum ponto turístico encontrado</Text>
            <Text style={styles.emptySubtitle}>
                Você ainda não possui pontos turísticos cadastrados
            </Text>
        </View>
    );

    if (touristPointViewModel.loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando pontos turísticos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pontos Turísticos</Text>
                <TouchableOpacity style={styles.addButton} onPress={touristPointViewModel.openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={touristPointViewModel.touristPoint}
                renderItem={renderTouristPointCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={touristPointViewModel.touristPoint.length === 0 ? styles.emptyList : styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={touristPointViewModel.refreshing} onRefresh={touristPointViewModel.onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={touristPointViewModel.modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => touristPointViewModel.setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {touristPointViewModel.editingTouristPoint ? 'Editar Ponto Turístico' : 'Novo Ponto Turístico'}
                            </Text>
                            <TouchableOpacity onPress={() => touristPointViewModel.setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        <Formik
                            initialValues={
                                touristPointViewModel.editingTouristPoint
                                    ? {
                                        name: touristPointViewModel.editingTouristPoint.name,
                                        city: touristPointViewModel.editingTouristPoint.city,
                                        uf: touristPointViewModel.editingTouristPoint.uf,
                                    }
                                    : initialFormValues
                            }
                            validationSchema={validationSchema}
                            onSubmit={
                                touristPointViewModel.editingTouristPoint
                                    ? touristPointViewModel.handleUpdateTouristPoint
                                    : touristPointViewModel.handleCreateTouristPoints
                            }
                            enableReinitialize
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <ScrollView style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Nome do Local</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            placeholder="Digite o nome do local"
                                            placeholderTextColor="#8E8E93"
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={styles.errorText}>{String(errors.name)}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Cidade</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={values.city}
                                            onChangeText={handleChange('city')}
                                            onBlur={handleBlur('city')}
                                            placeholder="Digite a cidade"
                                            placeholderTextColor="#8E8E93"
                                        />
                                        {touched.city && errors.city && (
                                            <Text style={styles.errorText}>{String(errors.city)}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Estado</Text>
                                        <Picker
                                            selectedValue={values.uf}
                                            onValueChange={(itemValue) => setFieldValue('uf', itemValue)}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="Selecione um estado" value="" />
                                            <Picker.Item label="AC" value="AC" />
                                            <Picker.Item label="AL" value="AL" />
                                            <Picker.Item label="AP" value="AP" />
                                            <Picker.Item label="AM" value="AM" />
                                            <Picker.Item label="BA" value="BA" />
                                            <Picker.Item label="CE" value="CE" />
                                            <Picker.Item label="DF" value="DF" />
                                            <Picker.Item label="ES" value="ES" />
                                            <Picker.Item label="GO" value="GO" />
                                            <Picker.Item label="MA" value="MA" />
                                            <Picker.Item label="MT" value="MT" />
                                            <Picker.Item label="MS" value="MS" />
                                            <Picker.Item label="MG" value="MG" />
                                            <Picker.Item label="PA" value="PA" />
                                            <Picker.Item label="PB" value="PB" />
                                            <Picker.Item label="PR" value="PR" />
                                            <Picker.Item label="PE" value="PE" />
                                            <Picker.Item label="PI" value="PI" />
                                            <Picker.Item label="RJ" value="RJ" />
                                            <Picker.Item label="RN" value="RN" />
                                            <Picker.Item label="RS" value="RS" />
                                            <Picker.Item label="RO" value="RO" />
                                            <Picker.Item label="RR" value="RR" />
                                            <Picker.Item label="SC" value="SC" />
                                            <Picker.Item label="SP" value="SP" />
                                            <Picker.Item label="SE" value="SE" />
                                            <Picker.Item label="TO" value="TO" />
                                        </Picker>
                                        {touched.uf && errors.uf && (
                                            <Text style={styles.errorText}>{String(errors.uf)}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity style={styles.imagePickerButton} onPress={touristPointViewModel.pickImage}>
                                        <Text style={styles.imagePickerButtonText}>
                                            {touristPointViewModel.selectedImage ? 'Trocar Foto' : 'Escolher Foto'}
                                        </Text>
                                    </TouchableOpacity>
                                    {touristPointViewModel.selectedImage && (
                                        <Image
                                            source={{ uri: touristPointViewModel.selectedImage.uri }}
                                            style={styles.imagePreview}
                                            resizeMode="cover"
                                        />
                                    )}

                                    <View style={styles.formActions}>
                                        <TouchableOpacity
                                            style={[styles.formButton, styles.cancelButton]}
                                            onPress={() => touristPointViewModel.setModalVisible(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.formButton, styles.submitButton]}
                                            onPress={handleSubmit as any}
                                            disabled={touristPointViewModel.loading}
                                        >
                                            {touristPointViewModel.loading ? (
                                                <ActivityIndicator color="#FFF" />
                                            ) : (
                                                <Text style={styles.submitButtonText}>
                                                    {touristPointViewModel.editingTouristPoint ? 'Atualizar' : 'Criar'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>

            <AlertComponent
                title='Aviso'
                visible={touristPointViewModel.alertVisible}
                message={touristPointViewModel.alertMessage}
                type={touristPointViewModel.alertType}
                onClose={() => touristPointViewModel.setAlertVisible(false)}
            />
        </View>
    );
}

