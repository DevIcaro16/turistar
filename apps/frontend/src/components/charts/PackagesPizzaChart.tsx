"use client";

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PackagesPizzaChartProps {
    packages: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e42'];

const PackagesPizzaChart = ({ packages }: PackagesPizzaChartProps) => {
    // Calcula os status dos pacotes
    const pieData = useMemo(() => {
        const finished = packages.filter(pkg => pkg.isFinalised).length;
        const running = packages.filter(pkg => pkg.isRunning && !pkg.isFinalised).length;
        const notStarted = packages.filter(pkg => !pkg.isRunning && !pkg.isFinalised).length;
        return [
            { name: 'Finalizados', value: finished },
            { name: 'Rodando', value: running },
            { name: 'Não Iniciados', value: notStarted }
        ];
    }, [packages]);

    return (
        <motion.div
            className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
        >
            <h2 className="text-base md:text-lg font-medium mb-4 text-gray-100 text-center md:text-left">
                Status dos Pacotes
            </h2>
            <div className="h-64 md:h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#2e2e2e',
                                border: '1px solid #4b5563',
                                borderRadius: '8px',
                                color: '#f3f4f6'
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PackagesPizzaChart;
