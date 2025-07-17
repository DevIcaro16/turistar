import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface modalProps {
    message: string;
};

export default function ModalComponent({ message }: modalProps) {
    return (
        <Modal visible={true} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    areaMoeda: {
        backgroundColor: "#f9f9f9",
        width: "90%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 8
    },
    titulo: {
        fontSize: 16,
        color: "#000",
        fontWeight: '500',
        paddingLeft: 5,
        paddingTop: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});