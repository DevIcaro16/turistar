"use client";

import React from 'react'

import { FileText, ArrowDownLeft, ArrowUpRight, Clock, RotateCcw, Users, Table } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/StatCard';
import { useMetrics } from '../../hooks/useMetrics';
import { useDriverMetrics } from '../../hooks/useDriverMetrics';
import TableComponent from '../../components/TableComponent';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import TableTransactions from '../../components/TableTransactions';

const Transactions = () => {
    const { user, userRole, isAuthenticated, loading: authLoading } = useAuth();

    // Só renderiza após autenticação estar pronta
    if (authLoading) {
        return (
            <div className='flex-1 flex items-center justify-center min-h-screen bg-[#1e1e1e]'>
                <span className="text-gray-400 text-lg">Carregando autenticação...</span>
            </div>
        );
    }


    const { metrics: adminMetrics, loading: adminLoading, error: adminError, formatCurrency: adminFormatCurrency } = useMetrics();
    const { metrics: driverMetrics, loading: driverLoading, error: driverError, formatCurrency: driverFormatCurrency } = useDriverMetrics();

    const loading = userRole === 'admin' ? adminLoading : driverLoading;
    const error = userRole === 'admin' ? adminError : driverError;
    const formatCurrency = userRole === 'admin' ? adminFormatCurrency : driverFormatCurrency;

    // Para admin, você pode filtrar os tipos se já tiver os dados, ou usar endpoints específicos
    const adminTransactions = adminMetrics.transactions?.data || [];
    const adminTransactionsDebit = adminTransactions.filter(tr => tr.type === "DEBIT");
    const adminTransactionsCredit = adminTransactions.filter(tr => tr.type === "CREDIT");
    const adminTransactionsPendant = adminTransactions.filter(tr => tr.type === "PENDANT");
    const adminTransactionsReversal = adminTransactions.filter(tr => tr.type === "REVERSAL");

    const transactionsDriver = driverMetrics.transactions?.data || [];
    const transactionsPendant = driverMetrics.transactions?.data?.filter(tr => tr.type === "PENDANT") || [];
    const transactionsDebit = driverMetrics.transactions?.data?.filter(tr => tr.type === "DEBIT") || [];
    const transactionsCredit = driverMetrics.transactions?.data?.filter(tr => tr.type === "CREDIT") || [];
    const transactionsReversal = driverMetrics.transactions?.data?.filter(tr => tr.type === "REVERSAL") || [];

    if (loading) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#2e2e2e] min-h-20 rounded-xl animate-pulse">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                                    <div className="h-8 bg-gray-500 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex-1 overflow-auto relative z-10'>
                <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400">Erro: {error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className='flex min-h-screen bg-[#1e1e1e]'>
                <Sibebar />
                <div className="flex-1">
                    <Header />
                    <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">

                        <motion.div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5 }}
                        >
                            {userRole === "admin" ? (
                                // Métricas do Admin
                                <>
                                    <StatCard
                                        name="Total de Transações"
                                        icon={Table}
                                        value={adminMetrics.transactions?.count?.toString() || "0"}
                                    />
                                    <StatCard
                                        name="Transações - DÉBITOS"
                                        icon={() => <ArrowDownLeft color="#ef4444" />} // vermelho
                                        value={adminTransactionsDebit.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - CRÉDITOS"
                                        icon={() => <ArrowUpRight color="#22c55e" />} // verde
                                        value={adminTransactionsCredit.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - PENDENTES"
                                        icon={() => <Clock color="#eab308" />} // amarelo
                                        value={adminTransactionsPendant.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - ESTORNOS"
                                        icon={() => <RotateCcw color="#60a5fa" />} // azul
                                        value={adminTransactionsReversal.length.toString()}
                                    />
                                </>
                            ) : userRole === "driver" ? (
                                // Métricas do Driver
                                <>
                                    <StatCard
                                        name="Total de Transações"
                                        icon={Table}
                                        value={driverMetrics.transactions?.count?.toString() || "0"}
                                    />
                                    <StatCard
                                        name="Transações - CRÉDITOS"
                                        icon={() => <ArrowUpRight color="green" />} // verde
                                        value={transactionsCredit.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - DÉBITOS"
                                        icon={() => <ArrowDownLeft color="#ef4444" />} // vermelho
                                        value={transactionsDebit.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - PENDENTES"
                                        icon={() => <Clock color="#eab308" />} // amarelo
                                        value={transactionsPendant.length.toString()}
                                    />
                                    <StatCard
                                        name="Transações - ESTORNOS"
                                        icon={() => <RotateCcw color="#60a5fa" />} // azul
                                        value={transactionsReversal.length.toString()}
                                    />
                                </>
                            ) : (
                                <>
                                    <StatCard
                                        name="Pacotes de Passeio"
                                        icon={FileText}
                                        value="0"
                                    />
                                </>
                            )}
                        </motion.div>

                        {
                            userRole === "admin" ? (
                                <TableTransactions
                                    data={adminTransactions}
                                    isAdmin={true}
                                />
                            ) : (
                                <TableTransactions
                                    data={transactionsDriver}
                                />
                            )
                        }

                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default Transactions;