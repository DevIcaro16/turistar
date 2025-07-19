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
    card: {
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    cardText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    reserveButton: {
        marginTop: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    reserveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    btnClose: {
        marginTop: 12,
        backgroundColor: '#FF0000',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
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
    emptyText: {
        textAlign: 'center',
        color: '#8E8E93',
        fontSize: 16,
        marginTop: 32,
    },
}); 