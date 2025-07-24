import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import { useUserWalletViewModel } from './UserWalletViewModel';

export default function UserWallet() {
    const walletViewModel = useUserWalletViewModel();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Extrato</Text>
            <View style={styles.balanceContainer}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Total gasto</Text>
                    <Text style={[styles.balanceValue, { color: '#FF3B30' }]}>R$ {walletViewModel.debitTotal.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Total estornado</Text>
                    <Text style={[styles.balanceValue, { color: '#34C759' }]}>R$ {walletViewModel.reversalTotal.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.balanceLabel}>Saldo Total</Text>
                    <Text style={[styles.balanceValue, { color: '#007AFF' }]}>R$ {walletViewModel.balance.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.tabsContainer}>
                {walletViewModel.TRANSACTION_TYPES.map(type => (
                    <TouchableOpacity
                        key={type.key}
                        style={[styles.tabButton, walletViewModel.selectedType === type.key && { backgroundColor: type.color }]}
                        onPress={() => walletViewModel.setSelectedType(type.key)}
                    >
                        <Text style={[styles.tabButtonText, walletViewModel.selectedType === type.key && { color: '#fff', fontWeight: 'bold' }]}>{type.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {walletViewModel.loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={walletViewModel.filteredTransactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionCard}>
                            <Text style={[styles.transactionType, { color: walletViewModel.TRANSACTION_TYPES.find(t => t.key === item.type)?.color }]}> {walletViewModel.TRANSACTION_TYPES.find(t => t.key === item.type)?.label} </Text>
                            <Text style={styles.transactionDesc}>{item.description}</Text>
                            <Text style={styles.transactionAmount}>R$ {item.amount.toFixed(2)}</Text>
                            <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
                    contentContainerStyle={walletViewModel.filteredTransactions.length === 0 ? styles.emptyList : styles.listContainer}
                />
            )}
        </View>
    );
} 