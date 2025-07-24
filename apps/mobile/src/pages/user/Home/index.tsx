import React from "react";
import { Text, View, TouchableOpacity, ScrollView, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";
import { useHomeViewModel, formatDateTime } from "./HomeViewModel";

export default function Home() {
    const homeViewModel = useHomeViewModel();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, Usuário {homeViewModel.user?.name}!</Text>
                <Text style={styles.subtitleText}>Gerencie seus passeios turísticos</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <MaterialIcons name="directions-car" size={32} color="#007AFF" />
                    <Text style={styles.statNumber}>{homeViewModel.passeiosHojeCont}</Text>
                    <Text style={styles.statLabel}>Passeios Hoje</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialIcons name="attach-money" size={32} color="#4CAF50" />
                    <Text style={styles.statNumber}>R$ {homeViewModel.saldoHoje.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Gastos Hoje</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={homeViewModel.goToMyTours}>
                    <MaterialIcons name="money" size={24} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Meus Passeios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={homeViewModel.goToWallet}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Minha Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => homeViewModel.setModalVisible(true)}>
                    <MaterialIcons name="schedule" size={24} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Agenda</Text>
                </TouchableOpacity>

            </View>

            <Modal
                visible={homeViewModel.modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => homeViewModel.setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agenda de Hoje</Text>
                        <FlatList
                            data={homeViewModel.passeiosHoje}
                            keyExtractor={(item: any) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            ListEmptyComponent={<Text style={{ color: '#999', fontStyle: 'italic', marginTop: 10 }}>Nenhum passeio hoje</Text>}
                            renderItem={({ item }) => (
                                <View style={{
                                    width: 220,
                                    marginRight: 12,
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    padding: 12,
                                    backgroundColor: '#fff',
                                    borderColor: '#007AFF',
                                    elevation: 2,
                                }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{item.tourPackage.title}</Text>
                                    <Text style={{ color: '#666', marginBottom: 2 }}>{formatDateTime(item.tourPackage.date_tour)}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Origem: {item.tourPackage.origin_local}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Destino: {item.tourPackage.destiny_local}</Text>
                                    <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {item.tourPackage.price?.toFixed(2)}</Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.closeBtn} onPress={() => homeViewModel.setModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}