import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import DriverWalletViewModel, { formatDate, formatDateTime } from './DriverWalletViewModel';
import { COLORS, LABELS } from './DriverWalletModel';
import { AuthContext } from 'apps/mobile/src/contexts/auth';
import { useContext } from 'react';

export default function DriverWallet() {

    const { user } = useContext<any>(AuthContext);
    const driverWalletViewModel = DriverWalletViewModel();

    // Debug
    console.log('Wallet no componente DriverWallet:', user?.wallet);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minha Wallet</Text>
            <View style={styles.filterArea}>
                <View style={styles.filterRowCentered}>
                    <Picker
                        selectedValue={driverWalletViewModel.filterType}
                        style={styles.picker}
                        onValueChange={driverWalletViewModel.setFilterType}
                    >
                        {driverWalletViewModel.FILTER_OPTIONS.map((opt) => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder={`Pesquisar por ${driverWalletViewModel.FILTER_OPTIONS.find(f => f.value === driverWalletViewModel.filterType)?.label}`}
                        value={driverWalletViewModel.filterText}
                        onChangeText={driverWalletViewModel.setFilterText}
                    />
                    <TouchableOpacity onPress={driverWalletViewModel.fetchTransactions} style={styles.refreshBtnCentered}>
                        <MaterialIcons name="refresh" size={28} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </View>
            {driverWalletViewModel.loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView>
                    {(['REVERSAL', 'PENDANT', 'CREDIT'] as const).map((type) => (
                        <View key={type} style={[styles.section, { borderColor: COLORS[type], minHeight: 220 }]}>
                            <Text style={[styles.sectionTitle, { color: COLORS[type] }]}>{LABELS[type]}</Text>
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsText}>Total: {driverWalletViewModel.getTotalsFromBackend(type).count}</Text>
                                <Text style={styles.totalsText}>R$ {driverWalletViewModel.getTotalsFromBackend(type).amount.toFixed(2)}</Text>
                            </View>
                            <FlatList
                                data={driverWalletViewModel.grouped[type]}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 10 }}
                                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação</Text>}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.card, { borderColor: COLORS[type] }]}
                                        onPress={() => driverWalletViewModel.openModal(item)}
                                    >
                                        <Text style={styles.cardTitle}>{item.Reservation?.tourPackage?.title || '-'}</Text>
                                        <Text style={styles.cardAmount}>R$ {(item.amount ?? 0).toFixed(2)}</Text>
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
                            <Text style={styles.summaryCredit}>R$ {(driverWalletViewModel.totalsCredit.amount ?? 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estornos: </Text>
                            <Text style={styles.summaryReversal}>R$ {(driverWalletViewModel.totalsReversal.amount ?? 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Pendentes: </Text>
                            <Text style={styles.summaryPendant}>R$ {(driverWalletViewModel.totalsPendant.amount ?? 0).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 48, marginTop: 24 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.summaryTitle}>Saldo do dia</Text>
                                <Text style={styles.summaryValue}>
                                    {user?.wallet !== undefined ? `R$ ${user.wallet.toFixed(2)}` : 'Carregando...'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
            <Modal
                visible={driverWalletViewModel.modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => driverWalletViewModel.setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalhes da Transação</Text>
                        {driverWalletViewModel.selectedTransaction && (
                            <>
                                <Text style={styles.modalLabel}>Usuário:</Text>
                                <Text style={styles.modalValue}>{driverWalletViewModel.selectedTransaction.Reservation?.user?.name || '-'}</Text>
                                <Text style={styles.modalLabel}>Pacote:</Text>
                                <Text style={styles.modalValue}>{driverWalletViewModel.selectedTransaction.Reservation?.tourPackage?.title || '-'}</Text>
                                <Text style={styles.modalLabel}>Data:</Text>
                                <Text style={styles.modalValue}>{formatDateTime(driverWalletViewModel.selectedTransaction.createdAt)}</Text>
                                <Text style={styles.modalLabel}>Valor:</Text>
                                <Text style={styles.modalValue}>R$ {driverWalletViewModel.selectedTransaction.amount.toFixed(2)}</Text>
                                <Text style={styles.modalLabel}>Tipo:</Text>
                                <Text style={styles.modalValue}>{LABELS[(driverWalletViewModel.selectedTransaction.type as keyof typeof LABELS)] || driverWalletViewModel.selectedTransaction.type}</Text>
                            </>
                        )}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => driverWalletViewModel.setModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}