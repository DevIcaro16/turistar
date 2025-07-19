import React, { useEffect, useState, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../../src/contexts/auth';
import api from '../../../util/api/api';
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export default function Home() {
    const { user } = useContext(AuthContext);
    const [passeiosHojeCont, setPasseiosHojeCont] = useState(0);
    const [passeiosHoje, setPasseiosHoje] = useState<any[]>([]); // array!
    const [ganhosHoje, setGanhosHoje] = useState(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const navigator = useNavigation();

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            // Buscar pacotes do dia
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // yyyy-mm-dd
            const tourRes = await api.get(`/TourPackage/driver/${user?.id}`);
            const passeios = (tourRes.data.tourPackages || []).filter((p: any) => p.date_tour.startsWith(dateStr));

            setPasseiosHoje(passeios);
            setPasseiosHojeCont(passeios.length);

            // Buscar ganhos do dia
            const transRes = await api.get(`/transaction/driver/all`);
            const transacoes = transRes.data.transactions || [];
            const ganhos = transacoes
                .filter((t: any) => t.type === 'CREDIT' && t.createdAt.startsWith(dateStr))
                .reduce((sum: number, t: any) => sum + t.amount, 0);
            setGanhosHoje(ganhos);
        } catch (e) {
            setPasseiosHojeCont(0);
            setGanhosHoje(0);
        }
    }

    function handleOpenDashboardPanel() {
        Alert.alert(
            'Dashboard',
            'Deseja ser redirecionado para o painel dashboard?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Ir para o Painel', style: 'default', onPress: () => Linking.openURL('http://192.168.15.3:3000/Login')
                }
            ]
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, Motorista {user?.name}!</Text>
                <Text style={styles.subtitleText}>Gerencie seus passeios turísticos</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <MaterialIcons name="directions-car" size={32} color="#007AFF" />
                    <Text style={styles.statNumber}>{passeiosHojeCont}</Text>
                    <Text style={styles.statLabel}>Passeios Hoje</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialIcons name="attach-money" size={32} color="#4CAF50" />
                    <Text style={styles.statNumber}>R$ {ganhosHoje.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Ganhos Hoje</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigator.navigate('TourPackageManagement' as never)}>
                    <MaterialIcons name="money" size={24} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Meus Pacotes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigator.navigate('DriverWallet' as never)}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Minha Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="schedule" size={24} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleOpenDashboardPanel}>
                    <MaterialIcons name="assessment" size={24} color="#5856D6" />
                    <Text style={styles.actionButtonText}>Dashboard Web</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agenda de Hoje</Text>
                        <FlatList
                            data={passeiosHoje}
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
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{item.title}</Text>
                                    <Text style={{ color: '#666', marginBottom: 2 }}>{formatDateTime(item.date_tour)}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Origem: {item.origin_local}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Destino: {item.destiny_local}</Text>
                                    <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {item.price?.toFixed(2)}</Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
