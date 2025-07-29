"use client";

import React, { useEffect, useState } from 'react';
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/auth';

interface ReservationsChartProps {
    reserves: any[];
}

const ReservationsChart = ({ reserves }: ReservationsChartProps) => {

    const [chartData, setChartData] = useState<any[]>([]);
    const { user, userRole, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        if (reserves && Array.isArray(reserves)) {
            // Agrupar por pacote
            const grouped = reserves.reduce((acc, curr) => {
                const name = curr.tourPackage.title || 'Pacote';
                if (!acc[name]) {
                    acc[name] = 0;
                }
                acc[name] += curr.vacancies_reserved || 0;
                return acc;
            }, {} as Record<string, number>);

            // Formatar para o gráfico
            const formattedData = Object.entries(grouped).map(([name, reservations], index) => ({
                id: index + 1,
                name,
                reservations
            }));

            setChartData(formattedData);
        } else {
            setChartData([]);
        }
    }, [reserves]);

    return (
        <motion.div
            className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
        >
            <h2 className="text-base md:text-lg font-medium mb-4 text-gray-100 text-center md:text-left">
                {
                    userRole === "admin" ? "Reservas por Pacote" : "Minhas Reservas por Pacote"
                }
            </h2>
            <div className="h-64 md:h-80">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke='gray' />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2e2e',
                                    border: '1px solid #4b5563',
                                    borderRadius: '8px',
                                    color: '#f3f4f6'
                                }}
                                itemStyle={{
                                    color: '#e5e7eb'
                                }}
                                formatter={(value, name) => [
                                    value,
                                    name === 'reservations' ? 'Reservas' : name
                                ]}
                            />
                            <Legend />
                            <Bar
                                dataKey="reservations"
                                fill="#10b981"
                                name="Reservas"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Nenhuma Reserva encontrada</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default ReservationsChart; 