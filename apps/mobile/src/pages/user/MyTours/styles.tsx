import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 16,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 16,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8E8E93',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
    },
    tourCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    tourHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tourTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    tourRoute: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    tourDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    tourPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    driverLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    driverName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '70%',
        minHeight: 340,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        paddingBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    closeButton: {
        fontSize: 24,
        color: '#8E8E93',
        fontWeight: 'bold',
    },
    modalBody: {
        flex: 1,
    },
    detailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 12,
    },
    detailRoute: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    detailDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    detailPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    detailVagas: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    driverDetail: {
        marginBottom: 16,
    },
    driverDetailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    driverDetailName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 