import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import api from '../../../util/api/api';

const TRANSACTION_TYPES = [
    { key: 'REVERSAL', label: 'Estornos', color: '#34C759' },
    { key: 'DEBIT', label: 'Débitos', color: '#FF3B30' },
];

interface TransactionsProps {
    id: string;
    type: string;
    description: string;
    amount: number;
    createdAt: Date;
};

export default function UserWallet() {
    const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('DEBIT');
    const [debitTotal, setDebitTotal] = useState(0);
    const [reversalTotal, setReversalTotal] = useState(0);
    const [balance, setBalance] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            await fetchTotalTransactions();
            await fetchTransactions();
        };
        fetchAll();

        intervalRef.current = setInterval(fetchAll, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);


    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get('transaction/user/transactions');
            setTransactions(response.data.data.transactions || []);
        } catch (error: any) {
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get('transaction/user/totals');
            console.log('API totals:', response.data.data);
            setDebitTotal(response.data.data.DEBIT.amount || 0);
            setReversalTotal(response.data.data.REVERSAL.amount || 0);
            setBalance(response.data.data.total.amount || 0);
        } catch (error) {
            setDebitTotal(0);
            setReversalTotal(0);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((t: any) => t.type === selectedType);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Extrato</Text>
            <View style={styles.balanceContainer}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Total gasto</Text>
                    <Text style={[styles.balanceValue, { color: '#FF3B30' }]}>R$ {debitTotal.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Total estornado</Text>
                    <Text style={[styles.balanceValue, { color: '#34C759' }]}>R$ {reversalTotal.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Saldo Total</Text>
                    <Text style={[styles.balanceValue, { color: '#007AFF' }]}>R$ {balance.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.tabsContainer}>
                {TRANSACTION_TYPES.map(type => (
                    <TouchableOpacity
                        key={type.key}
                        style={[styles.tabButton, selectedType === type.key && { backgroundColor: type.color }]}
                        onPress={() => setSelectedType(type.key)}
                    >
                        <Text style={[styles.tabButtonText, selectedType === type.key && { color: '#fff', fontWeight: 'bold' }]}>{type.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionCard}>
                            <Text style={[styles.transactionType, { color: TRANSACTION_TYPES.find(t => t.key === item.type)?.color }]}> {TRANSACTION_TYPES.find(t => t.key === item.type)?.label} </Text>
                            <Text style={styles.transactionDesc}>{item.description}</Text>
                            <Text style={styles.transactionAmount}>R$ {item.amount.toFixed(2)}</Text>
                            <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
                    contentContainerStyle={filteredTransactions.length === 0 ? styles.emptyList : styles.listContainer}
                />
            )}
        </View>
    );
} 