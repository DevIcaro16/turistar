import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AuthContext } from '../../../../src/contexts/auth';

export default function Home() {

    const { user } = useContext(AuthContext);;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, Motorista {user?.name}!</Text>
                <Text style={styles.subtitleText}>Gerencie seus passeios turísticos</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <MaterialIcons name="directions-car" size={32} color="#007AFF" />
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Passeios Hoje</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialIcons name="attach-money" size={32} color="#4CAF50" />
                    <Text style={styles.statNumber}>R$ 450</Text>
                    <Text style={styles.statLabel}>Ganhos Hoje</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="play-circle-outline" size={24} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Iniciar Passeio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="stop" size={24} color="#FF3B30" />
                    <Text style={styles.actionButtonText}>Finalizar Passeio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="schedule" size={24} color="#FF9500" />
                    <Text style={styles.actionButtonText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="assessment" size={24} color="#5856D6" />
                    <Text style={styles.actionButtonText}>Relatórios</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

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
});