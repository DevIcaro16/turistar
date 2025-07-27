import api from '../../../util/api/api';
import { AuthContext } from '../../../contexts/auth';
import { useContext, useEffect, useState } from "react";
import { FILTER_OPTIONS } from './DriverWalletModel';

export function formatDate(date: string | Date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

export function formatDateTime(date: string | Date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export default function DriverWalletViewModel() {

    const { user } = useContext<any>(AuthContext);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totals, setTotals] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [filterType, setFilterType] = useState('user');
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(() => {
            fetchTransactions();
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/transaction/driver/all`);
            // console.log(res.data.transactions);
            setTransactions(res.data.transactions || []);
            setTotals(res.data.totals || {});
        } catch (e) {
            setTransactions([]);
            setTotals({});
        } finally {
            setLoading(false);
        }
    };


    const filterFn = (tx: any) => {
        if (!filterText) return true;
        const text = filterText.toLowerCase();
        if (filterType === 'user') {
            return tx.Reservation?.user?.name?.toLowerCase().includes(text) || false;
        }
        if (filterType === 'package') {
            return tx.Reservation?.tourPackage?.title?.toLowerCase().includes(text) || false;
        }
        if (filterType === 'date') {
            return formatDateTime(tx.createdAt).includes(text);
        }
        if (filterType === 'amount') {
            return String(tx.amount).includes(text);
        }
        return true;
    };

    const grouped = {
        REVERSAL: transactions.filter((t) => t.type === 'REVERSAL' && filterFn(t)),
        PENDANT: transactions.filter((t) => t.type === 'PENDANT' && filterFn(t)),
        CREDIT: transactions.filter((t) => t.type === 'CREDIT' && filterFn(t)),
    };

    // Calcular totalizadores por tipo
    function getTotalsFromBackend(type: string) {
        return {
            count: totals[type]?.count || 0,
            amount: totals[type]?.amount || 0
        };
    }
    const totalsReversal = getTotalsFromBackend('REVERSAL');
    const totalsPendant = getTotalsFromBackend('PENDANT');
    const totalsCredit = getTotalsFromBackend('CREDIT');
    const saldoDia = totalsCredit.amount - totalsReversal.amount;

    const openModal = (tx: any) => {
        setSelectedTransaction(tx);
        setModalVisible(true);
    };


    return {
        user,
        filterType,
        setFilterType,
        FILTER_OPTIONS,
        filterText,
        setFilterText,
        fetchTransactions,
        loading,
        totalsCredit,
        totalsPendant,
        totalsReversal,
        modalVisible,
        setModalVisible,
        transactions,
        setTransactions,
        getTotalsFromBackend,
        grouped,
        selectedTransaction,
        openModal,
    }
}