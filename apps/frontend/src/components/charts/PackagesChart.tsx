"use client";

import React, { useEffect, useState } from 'react';
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface PackagesChartProps {
    packages: any[];
}

const PackagesChart = ({ packages }: PackagesChartProps) => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (packages && Array.isArray(packages)) {
            const formattedData = packages.map((pkg, index) => ({
                id: index + 1,
                name: pkg.title || `Pacote ${index + 1}`,
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
                Meus Pacotes
            </h2>

            <div className="h-64 md:h-80">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke='gray' />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                tick={{ fill: '#9ca3af' }}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tick={{ fill: '#9ca3af' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2e2e2e',
                                    border: '1px solid #4b5563',
                                    borderRadius: '8px',
                                    color: '#f3f4f6'
                                }}
                                formatter={(value, name) => {
                                    if (name === 'price') return [`R$ ${value}`, 'Preço'];
                                    if (name === 'reservations') return [value, 'Reservas'];
                                    if (name === 'status') return [value];
                                    return [value, name];
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="price"
                                fill="#3b82f6"
                                name="Preço (R$)"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="status"
                                fill="#10b981"
                                name="Status"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
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

export default PackagesChart;