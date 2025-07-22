"use client";

import React, { useEffect, useState } from 'react';
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

interface PackageCompleteChartProps {
    packages: any[];
}

const PackagesCompletedChart = ({ packages }: PackageCompleteChartProps) => {

    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (packages && Array.isArray(packages)) {
            const formattedData = packages.map((pkg, index) => ({
                id: index + 1,
                name: pkg.name || `Pacote ${index + 1}`,
                price: pkg.price || 0,
                reservations: pkg.reservations?.length || 0,
                status: pkg.isFinalised ? 'Concluído' : pkg.isRunning ? 'Ativo' : 'Pendente'
            }));

            setChartData(formattedData);
        } else {
            setChartData([]);
        }
    }, [packages]);

    return (

        <motion.div
            className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
        >

            <h2 className="text-base md:text-lg font-medium mb-4 text-gray-100 text-center md:text-left">
                Pacotes Concluidos
            </h2>

            <div className="h-64 md:h-80">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
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
                                    name === 'price' ? `R$ ${value}` : value,
                                    name === 'price' ? 'Preço' : name === 'reservations' ? 'Reservas' : 'Status'
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke='#9c27b0'
                                strokeWidth={3}
                                dot={{ fill: "#9c27b0", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Nenhum pacote encontrado</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default PackagesCompletedChart;