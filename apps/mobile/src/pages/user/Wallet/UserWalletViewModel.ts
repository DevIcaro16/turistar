import { useEffect, useRef, useState } from 'react';
import api from '../../../util/api/api';
import { Transaction, TransactionTotals, TRANSACTION_TYPES } from './UserWalletModel';

export function useUserWalletViewModel() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('DEBIT');
    const [debitTotal, setDebitTotal] = useState(0);
    const [reversalTotal, setReversalTotal] = useState(0);
    const [balance, setBalance] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            await fetchTotalTransactions();
            await fetchTransactions();
        };
        fetchAll();

        intervalRef.current = setInterval(fetchAll, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get('transaction/user/transactions');
            setTransactions(response.data.data.transactions || []);
        } catch (error: any) {
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get('transaction/user/totals');
            // console.log('API totals:', response.data.data);
            setDebitTotal(response.data.data.DEBIT.amount || 0);
            setReversalTotal(response.data.data.REVERSAL.amount || 0);
            setBalance(response.data.data.total.amount || 0);
        } catch (error) {
            setDebitTotal(0);
            setReversalTotal(0);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((t: any) => t.type === selectedType);

    return {
        transactions,
        loading,
        selectedType,
        setSelectedType,
        debitTotal,
        reversalTotal,
        balance,
        filteredTransactions,
        TRANSACTION_TYPES,
    };
} 