import React, { useEffect, useState, useContext, useRef } from "react";
import { Text, View, TouchableOpacity, ScrollView, Linking, Alert, Modal } from "react-native";
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
    const [saldoHoje, setSaldoHoje] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const navigator = useNavigation();

    useEffect(() => {
        fetchStats();
        intervalRef.current = setInterval(fetchStats, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    async function fetchStats() {
        try {

            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // yyyy-mm-dd
            const tourRes = await api.get(`/user/reservations`);
            // console.log(tourRes.data.reservations);
            const passeios = (
                tourRes.data.reservations || []
            )
                .filter(
                    (p: any) =>
                        new Date(p.tourPackage.date_tour).toISOString().split('T')[0] === dateStr &&
                        p.canceled === false
                )

            console.log(passeios);
            setPasseiosHoje(passeios);
            setPasseiosHojeCont(passeios.length);

            const transRes = await api.get(`/transaction/user/totals`);
            const transacoes = transRes.data.data || [];
            const ganhos = transacoes.total.amount
            setSaldoHoje(ganhos);
        } catch (e) {
            setPasseiosHojeCont(0);
            setSaldoHoje(0);
        }
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, Usuário {user?.name}!</Text>
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
                    <Text style={styles.statNumber}>R$ {saldoHoje.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Gastos Hoje</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigator.navigate('MyTours' as never)}>
                    <MaterialIcons name="money" size={24} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Meus Passeios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigator.navigate('Wallter' as never)}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Minha Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="schedule" size={24} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Agenda</Text>
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
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{item.tourPackage.title}</Text>
                                    <Text style={{ color: '#666', marginBottom: 2 }}>{formatDateTime(item.tourPackage.date_tour)}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Origem: {item.tourPackage.origin_local}</Text>
                                    <Text style={{ color: '#888', marginBottom: 2 }}>Destino: {item.tourPackage.destiny_local}</Text>
                                    <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {item.tourPackage.price?.toFixed(2)}</Text>
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