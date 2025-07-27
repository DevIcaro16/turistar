import { useEffect, useState, useContext, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../../contexts/auth';
import api from '../../../util/api/api';
import { Tour } from './HomeModel';

export function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function useHomeViewModel(): {
    user: any;
    passeiosHojeCont: number;
    passeiosHoje: Tour[];
    saldoHoje: number;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    goToMyTours: () => void;
    goToWallet: () => void;
} {
    const { user } = useContext(AuthContext);
    const [passeiosHojeCont, setPasseiosHojeCont] = useState(0);
    const [passeiosHoje, setPasseiosHoje] = useState<Tour[]>([]);
    const [saldoHoje, setSaldoHoje] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const navigator = useNavigation();

    useEffect(() => {
        fetchStats();
        intervalRef.current = setInterval(fetchStats, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    async function fetchStats() {
        try {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // yyyy-mm-dd
            const tourRes = await api.get(`/user/reservations`);
            const passeios = (
                tourRes.data.reservations || []
            )
                .filter(
                    (p: any) =>
                        new Date(p.tourPackage.date_tour).toISOString().split('T')[0] === dateStr &&
                        p.canceled === false
                )

            // console.log(passeios);

            setPasseiosHoje(passeios);
            setPasseiosHojeCont(passeios.length);

            const transRes = await api.get(`/transaction/user/totals`);
            const transacoes = transRes.data.data || [];
            const ganhos = transacoes.total.amount
            setSaldoHoje(ganhos);
        } catch (e) {
            setPasseiosHojeCont(0);
            setSaldoHoje(0);
        }
    }

    const goToMyTours = () => navigator.navigate('MyTours' as never);
    const goToWallet = () => navigator.navigate('Wallter' as never);

    return {
        user,
        passeiosHojeCont,
        passeiosHoje,
        saldoHoje,
        modalVisible,
        setModalVisible,
        goToMyTours,
        goToWallet,
    };
} 