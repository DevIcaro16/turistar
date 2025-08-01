import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
    },
    filterArea: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    },
    filterRowCentered: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 8,
    },
    picker: {
        flex: 1,
        height: 80,
        minWidth: 100,
        maxWidth: 140
    },
    input: {
        flex: 2,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginLeft: 2,
        backgroundColor: '#f9f9f9',
        minWidth: 120,
        maxWidth: 200,

    },
    refreshBtnCentered: {
        marginLeft: 8,
        marginTop: 4,
        alignSelf: 'center',
        padding: 6,
    },
    section: {
        marginBottom: 28,
        borderWidth: 2,
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#f5f5f5',
        minHeight: 220,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        width: 180,
        marginRight: 12,
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '85%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalLabel: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    modalValue: {
        marginBottom: 4,
    },
    closeBtn: {
        marginTop: 18,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    totalsText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
    },
    summaryCard: {
        marginTop: 18,
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007AFF',
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#22C55E',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 2,
    },
    summaryLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
    },
    summaryCredit: {
        color: '#22C55E',
        fontWeight: 'bold',
    },
    summaryReversal: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    summaryPendant: {
        color: '#F59E42',
        fontWeight: 'bold',
    },
}); 