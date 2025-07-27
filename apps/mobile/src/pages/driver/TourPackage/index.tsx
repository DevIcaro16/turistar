
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
import { TextInputMask } from 'react-native-masked-text';
import { useTourPackageViewModel } from './TourPackageViewModel';
import { validationSchema, TourPackageData } from './TourPackageModel';

export default function TourPackageManagement() {
    const tourPackageViewModel = useTourPackageViewModel();

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
            <View style={styles.carActions}>
                {
                    item.isFinalised ? (
                        <TouchableOpacity
                            style={[styles.depletedButton]}
                        >
                            <Text style={styles.depletedButtonText}>Finalizado</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => tourPackageViewModel.openEditModal(item)}
                            >
                                <MaterialIcons name="edit" size={20} color="#007AFF" />
                                <Text style={styles.editButtonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => tourPackageViewModel.handleDeleteTourPackage(item)}
                            >
                                <MaterialIcons name="delete" size={20} color="#FF3B30" />
                                <Text style={styles.deleteButtonText}>Excluir</Text>
                            </TouchableOpacity>
                        </>
                    )
                }
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

    if (tourPackageViewModel.loading) {
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
                <TouchableOpacity style={styles.addButton} onPress={tourPackageViewModel.openCreateModal}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={tourPackageViewModel.tourPackages}
                renderItem={renderTourPackageCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={tourPackageViewModel.tourPackages.length === 0 ? styles.emptyList : styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={tourPackageViewModel.refreshing} onRefresh={tourPackageViewModel.onRefresh} />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={tourPackageViewModel.modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={tourPackageViewModel.closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {tourPackageViewModel.editingTourPackage ? 'Editar Pacote de Passeio' : 'Novo Pacote de Passeio'}
                            </Text>
                            <TouchableOpacity
                                onPress={tourPackageViewModel.closeModal}
                            >
                                <MaterialIcons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView

                        >
                            <Formik
                                initialValues={tourPackageViewModel.getInitialValues()}
                                validationSchema={validationSchema}
                                onSubmit={tourPackageViewModel.handleSubmit}
                                enableReinitialize
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
                                                    {tourPackageViewModel.cars.map((car: any) => (
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
                                                    {tourPackageViewModel.touristPoints.map((tp: any) => (
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
                                        <TouchableOpacity style={styles.imagePickerButton} onPress={tourPackageViewModel.pickImage}>
                                            <Text style={styles.imagePickerButtonText}>
                                                {tourPackageViewModel.selectedImage ? 'Trocar Foto' : 'Escolher Foto'}
                                            </Text>
                                        </TouchableOpacity>
                                        {tourPackageViewModel.selectedImage && (
                                            <Image
                                                source={{ uri: tourPackageViewModel.selectedImage.uri }}
                                                style={styles.imagePreview}
                                                resizeMode="cover"
                                            />
                                        )}
                                        {/* Botões de ação */}
                                        <View style={styles.formActions}>
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.cancelButton]}
                                                onPress={tourPackageViewModel.closeModal}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.formButton, styles.submitButton]}
                                                onPress={() => handleSubmit()}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {tourPackageViewModel.editingTourPackage ? 'Atualizar' : 'Criar'}
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
                visible={tourPackageViewModel.alertVisible}
                message={tourPackageViewModel.alertMessage}
                type={tourPackageViewModel.alertType}
                onClose={() => tourPackageViewModel.setAlertVisible(false)}
            />
        </View>
    );
}
