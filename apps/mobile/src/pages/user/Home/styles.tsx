import { StyleSheet } from "react-native";

export
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F2F2F7',
        },
        header: {
            backgroundColor: '#007AFF',
            padding: 20,
            paddingTop: 40,
            paddingBottom: 30,
        },
        welcomeText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 5,
        },
        subtitleText: {
            fontSize: 16,
            color: '#fff',
            opacity: 0.9,
        },
        statsContainer: {
            flexDirection: 'row',
            padding: 20,
            gap: 15,
        },
        statCard: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        statNumber: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1C1C1E',
            marginTop: 8,
        },
        statLabel: {
            fontSize: 12,
            color: '#8E8E93',
            marginTop: 4,
            textAlign: 'center',
        },
        actionsContainer: {
            padding: 20,
            gap: 15,
        },
        actionButton: {
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        actionButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1C1C1E',
            marginLeft: 15,
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
    }); 