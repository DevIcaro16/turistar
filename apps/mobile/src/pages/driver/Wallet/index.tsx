import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../../util/api/api';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';
import { styles } from './styles';

const COLORS = {
    REVERSAL: '#3B82F6', // azul
    PENDANT: '#F59E42', // laranja
    CREDIT: '#22C55E', // verde
};

const LABELS = {
    REVERSAL: 'Estornos',
    PENDANT: 'Pendentes',
    CREDIT: 'Créditos',
};

const FILTER_OPTIONS = [
    { label: 'Usuário', value: 'user' },
    { label: 'Pacote', value: 'package' },
    { label: 'Data', value: 'date' },
    { label: 'Valor', value: 'amount' },
];

export default function DriverWallet() {
    const { user } = useContext<any>(AuthContext);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totals, setTotals] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [filterType, setFilterType] = useState('user');
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(() => {
            fetchTransactions();
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/transaction/driver/all`);
            console.log(res.data.transactions);
            setTransactions(res.data.transactions || []);
            setTotals(res.data.totals || {});
        } catch (e) {
            setTransactions([]);
            setTotals({});
        } finally {
            setLoading(false);
        }
    };

    // Filtro local
    const filterFn = (tx: any) => {
        if (!filterText) return true;
        const text = filterText.toLowerCase();
        if (filterType === 'user') {
            return tx.Reservation?.user?.name?.toLowerCase().includes(text) || false;
        }
        if (filterType === 'package') {
            return tx.Reservation?.tourPackage?.title?.toLowerCase().includes(text) || false;
        }
        if (filterType === 'date') {
            return formatDate(tx.createdAt).includes(text);
        }
        if (filterType === 'amount') {
            return String(tx.amount).includes(text);
        }
        return true;
    };

    const grouped = {
        REVERSAL: transactions.filter((t) => t.type === 'REVERSAL' && filterFn(t)),
        PENDANT: transactions.filter((t) => t.type === 'PENDANT' && filterFn(t)),
        CREDIT: transactions.filter((t) => t.type === 'CREDIT' && filterFn(t)),
    };

    // Calcular totalizadores por tipo
    function getTotalsFromBackend(type: string) {
        return {
            count: totals[type]?.count || 0,
            amount: totals[type]?.amount || 0
        };
    }
    const totalsReversal = getTotalsFromBackend('REVERSAL');
    const totalsPendant = getTotalsFromBackend('PENDANT');
    const totalsCredit = getTotalsFromBackend('CREDIT');
    const saldoDia = totalsCredit.amount - totalsReversal.amount;

    const openModal = (tx: any) => {
        setSelectedTransaction(tx);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minha Wallet</Text>
            <View style={styles.filterArea}>
                <View style={styles.filterRowCentered}>
                    <Picker
                        selectedValue={filterType}
                        style={styles.picker}
                        onValueChange={setFilterType}
                    >
                        {FILTER_OPTIONS.map((opt) => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder={`Pesquisar por ${FILTER_OPTIONS.find(f => f.value === filterType)?.label}`}
                        value={filterText}
                        onChangeText={setFilterText}
                    />
                    <TouchableOpacity onPress={fetchTransactions} style={styles.refreshBtnCentered}>
                        <MaterialIcons name="refresh" size={28} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView>
                    {(['REVERSAL', 'PENDANT', 'CREDIT'] as const).map((type) => (
                        <View key={type} style={[styles.section, { borderColor: COLORS[type], minHeight: 220 }]}>
                            <Text style={[styles.sectionTitle, { color: COLORS[type] }]}>{LABELS[type]}</Text>
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsText}>Total: {getTotalsFromBackend(type).count}</Text>
                                <Text style={styles.totalsText}>R$ {getTotalsFromBackend(type).amount.toFixed(2)}</Text>
                            </View>
                            <FlatList
                                data={grouped[type]}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 10 }}
                                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação</Text>}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.card, { borderColor: COLORS[type] }]}
                                        onPress={() => openModal(item)}
                                    >
                                        <Text style={styles.cardTitle}>{item.Reservation?.tourPackage?.title || '-'}</Text>
                                        <Text style={styles.cardAmount}>R$ {item.amount.toFixed(2)}</Text>
                                        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    ))}
                    {/* Resumo do dia */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Créditos: </Text>
                            <Text style={styles.summaryCredit}>R$ {totalsCredit.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estornos: </Text>
                            <Text style={styles.summaryReversal}>R$ {totalsReversal.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Pendentes: </Text>
                            <Text style={styles.summaryPendant}>R$ {totalsPendant.amount.toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 48, marginTop: 24 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.summaryTitle}>Saldo do dia</Text>
                                <Text style={styles.summaryValue}>R$ {user?.wallet.toFixed(2) ?? 0}</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.summaryTitle}>Saldo do dia</Text>
                                <Text style={styles.summaryValue}>R$ {user?.wallet.toFixed(2)}</Text>
                            </View> */}
                        </View>
                    </View>
                </ScrollView>
            )}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalhes da Transação</Text>
                        {selectedTransaction && (
                            <>
                                <Text style={styles.modalLabel}>Usuário:</Text>
                                <Text style={styles.modalValue}>{selectedTransaction.Reservation?.user?.name || '-'}</Text>
                                <Text style={styles.modalLabel}>Pacote:</Text>
                                <Text style={styles.modalValue}>{selectedTransaction.Reservation?.tourPackage?.title || '-'}</Text>
                                <Text style={styles.modalLabel}>Data:</Text>
                                <Text style={styles.modalValue}>{formatDateTime(selectedTransaction.createdAt)}</Text>
                                <Text style={styles.modalLabel}>Valor:</Text>
                                <Text style={styles.modalValue}>R$ {selectedTransaction.amount.toFixed(2)}</Text>
                                <Text style={styles.modalLabel}>Tipo:</Text>
                                <Text style={styles.modalValue}>{LABELS[(selectedTransaction.type as keyof typeof LABELS)] || selectedTransaction.type}</Text>
                            </>
                        )}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function formatDate(date: string | Date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateTime(date: string | Date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

