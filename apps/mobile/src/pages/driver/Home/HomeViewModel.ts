import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../../../src/contexts/auth';
import api from '../../../util/api/api';
import { useContext, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { TourPackage, Transaction, DriverStats } from './HomeModel';
import { config } from '../../../util/config';


export function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function HomeViewModel(): {
    user: any;
    passeiosHojeCont: number;
    ganhosHoje: number;
    passeiosHoje: any[];
    setModalVisible: (visible: boolean) => void;
    modalVisible: boolean;
    handleOpenDashboardPanel: () => void;
    goTourPackageManagement: () => void;
    goDriverWallet: () => void;
} {

    const { user } = useContext(AuthContext);
    const [passeiosHojeCont, setPasseiosHojeCont] = useState<number>(0);
    const [passeiosHoje, setPasseiosHoje] = useState<TourPackage[]>([]);
    const [ganhosHoje, setGanhosHoje] = useState(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const navigator = useNavigation();

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {

            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // yyyy-mm-dd
            const tourRes = await api.get(`/TourPackage/driver/${user?.id}`);
            const passeios = (tourRes.data.tourPackages || []).filter((p: TourPackage) => p.date_tour.startsWith(dateStr));

            setPasseiosHoje(passeios);
            setPasseiosHojeCont(passeios.length);

            const transRes = await api.get(`/transaction/driver/all`);
            const transacoes = transRes.data.transactions || [];
            const ganhos = transacoes
                .filter((t: Transaction) => t.type === 'CREDIT' && t.createdAt.startsWith(dateStr))
                .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
            setGanhosHoje(ganhos);
        } catch (e) {
            setPasseiosHojeCont(0);
            setGanhosHoje(0);
        }
    }

    function handleOpenDashboardPanel() {

        const dashboardWebLinking = config.frontedApi + 'Login';

        Alert.alert(
            'Dashboard',
            'Deseja ser redirecionado para o painel dashboard?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Ir para o Painel', style: 'default', onPress: () => Linking.openURL(dashboardWebLinking)
                }
            ]
        );
    }

    const goTourPackageManagement = () => navigator.navigate('TourPackageManagement' as never);
    const goDriverWallet = () => navigator.navigate('DriverWallet' as never);

    return {
        user,
        passeiosHojeCont,
        ganhosHoje,
        passeiosHoje,
        setModalVisible,
        modalVisible,
        handleOpenDashboardPanel,
        goTourPackageManagement,
        goDriverWallet
    };
} 