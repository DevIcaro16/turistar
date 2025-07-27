import React, { useEffect, useState, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../../src/contexts/auth';
import api from '../../../util/api/api';
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime, HomeViewModel } from "./HomeViewModel";
import { TourPackage } from "./HomeModel";



export default function Home() {

    const homeViewModel = HomeViewModel();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, Motorista {homeViewModel.user?.name}!</Text>
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
                    <Text style={styles.statNumber}>R$ {homeViewModel.ganhosHoje.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Ganhos Hoje</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={homeViewModel.goTourPackageManagement}>
                    <MaterialIcons name="money" size={24} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Meus Pacotes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={homeViewModel.goDriverWallet}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Minha Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => homeViewModel.setModalVisible(true)}>
                    <MaterialIcons name="schedule" size={24} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={homeViewModel.handleOpenDashboardPanel}>
                    <MaterialIcons name="assessment" size={24} color="#5856D6" />
                    <Text style={styles.actionButtonText}>Dashboard Web</Text>
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
                            keyExtractor={(item: TourPackage) => item.id}
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
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{item.title}</Text>
                                    <Text style={{ color: '#666', marginBottom: 2 }}>{formatDateTime(item.date_tour)}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Origem: {item.origin_local}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Destino: {item.destiny_local}</Text>
                                    <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {item.price?.toFixed(2)}</Text>
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
