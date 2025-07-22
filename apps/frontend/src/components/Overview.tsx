"use client";

import React from 'react'

import { FileText, LineChart, MapPin, Receipt, UserCheck, Users, Wallet, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import { useMetrics } from '../hooks/useMetrics';
import { useDriverMetrics } from '../hooks/useDriverMetrics';
import PackagesChart from './charts/PackagesChart';
import PackagesCompletedChart from './charts/PackagesCompleted';
import ReservationsChart from './charts/ReservationsChart';
import PackagesPizzaChart from './charts/PackagesPizzaChart';
import { useAuth } from '../contexts/AuthContext';

const Overview = () => {

    const { user, userRole, isAuthenticated, loading: authLoading } = useAuth();



    const { metrics: adminMetrics, loading: adminLoading, error: adminError, formatCurrency: adminFormatCurrency } = useMetrics();
    const { metrics: driverMetrics, loading: driverLoading, error: driverError, formatCurrency: driverFormatCurrency } = useDriverMetrics();

    const loading = userRole === 'admin' ? adminLoading : driverLoading;
    const error = userRole === 'admin' ? adminError : driverError;
    const formatCurrency = userRole === 'admin' ? adminFormatCurrency : driverFormatCurrency;

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

    const tourPackagesCount = driverMetrics.tourPackages?.data.length || 0;
    const completedCount = driverMetrics.tourPackages?.data?.filter(pkg => pkg.isFinalised)?.length || 0;
    const activeCount = driverMetrics.tourPackages?.data?.filter(pkg => pkg.isRunning && !pkg.isFinalised)?.length || 0;
    const reservesFilter = driverMetrics.reserves?.data?.filter(pkg => !pkg.canceled) || [];
    const reservesFilterAdmin = adminMetrics.reserves?.data?.filter(pkg => !pkg.canceled) || [];
    console.log(reservesFilterAdmin);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
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
                                name="Usuários"
                                icon={Users}
                                value={adminMetrics.users?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Motoristas"
                                icon={UserCheck}
                                value={adminMetrics.drivers?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Pacotes de Passeio"
                                icon={FileText}
                                value={adminMetrics.tourPackages?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Reservas"
                                icon={Receipt}
                                value={adminMetrics.reserves?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Pontos Turísticos"
                                icon={MapPin}
                                value={adminMetrics.touristPoints?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Faturamento"
                                icon={LineChart}
                                value={formatCurrency(adminMetrics.platformRevenue?.value || 0)}
                            />
                        </>
                    ) : userRole === "driver" ? (
                        // Métricas do Driver
                        <>
                            <StatCard
                                name="Meus Pacotes"
                                icon={FileText}
                                value={tourPackagesCount.toString() || "0"}
                            />
                            <StatCard
                                name="Pacotes Concluídos"
                                icon={TrendingUp}
                                value={completedCount.toString()}
                            />
                            <StatCard
                                name="Pacotes Ativos"
                                icon={UserCheck}
                                value={activeCount.toString()}
                            />
                            <StatCard
                                name="Minhas Reservas"
                                icon={Receipt}
                                value={driverMetrics.reserves?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Pontos Turísticos"
                                icon={MapPin}
                                value={driverMetrics.touristPoints?.count?.toString() || "0"}
                            />
                            <StatCard
                                name="Saldo da Carteira"
                                icon={Wallet}
                                value={formatCurrency(driverMetrics.wallet?.balance || 0)}
                            />
                        </>
                    ) : (
                        // Métricas para outros usuários (se necessário)
                        <>
                            <StatCard
                                name="Pacotes de Passeio"
                                icon={FileText}
                                value="0"
                            />
                            <StatCard
                                name="Reservas"
                                icon={Receipt}
                                value="0"
                            />
                            <StatCard
                                name="Pontos Turísticos"
                                icon={MapPin}
                                value="0"
                            />
                        </>
                    )}
                </motion.div>


                {userRole === "admin" && adminMetrics.tourPackages?.data && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PackagesChart
                            packages={adminMetrics.tourPackages.data}
                        />
                        <PackagesPizzaChart
                            packages={adminMetrics.tourPackages.data}
                        />
                        <ReservationsChart
                            reserves={reservesFilterAdmin}
                        />
                    </div>
                )}

                {userRole === "driver" && driverMetrics.tourPackages?.data && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PackagesChart
                            packages={driverMetrics.tourPackages.data}
                        />
                        <PackagesPizzaChart
                            packages={driverMetrics.tourPackages.data}
                        />
                        <ReservationsChart
                            reserves={reservesFilter}
                        />
                    </div>
                )}



            </main>
        </div>
    )
}

export default Overview