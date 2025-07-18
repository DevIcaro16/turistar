import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    carHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    carType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    carModel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    carCapacity: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    carInfo: {
        fontSize: 14,
        color: '#999',
        marginBottom: 2,
    },
    carActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
    },
    startButton: {
        backgroundColor: '#f8fff9',
        borderColor: '#28a745',
    },
    startButtonText: {
        color: '#28a745',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    finishButton: {
        backgroundColor: '#fff8f8',
        borderColor: '#dc3545',
    },
    finishButtonText: {
        color: '#dc3545',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    editButton: {
        backgroundColor: '#f8f9ff',
        borderColor: '#007AFF',
    },
    editButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    deleteButton: {
        backgroundColor: '#fff8f8',
        borderColor: '#FF3B30',
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        padding: 16,
    },
    detailGroup: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    formButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    cancelButtonText: {
        color: '#6c757d',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
}); 