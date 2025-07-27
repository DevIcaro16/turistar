"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    name: string;
    icon: React.ComponentType<any> | (() => React.ReactElement);
    value: string;
};

const StatCard = ({ name, icon: Icon, value }: StatCardProps) => {
    const renderIcon = () => {
        if (typeof Icon === 'function') {
            // Se for uma função que retorna elemento React
            const IconComponent = Icon as () => React.ReactElement;
            return IconComponent();
        } else {
            // Se for um componente React
            const IconComponent = Icon as React.ComponentType<any>;
            return <IconComponent size={20} className="mr-2" />;
        }
    };

    return (
        <motion.div
            className='bg-[#2e2e2e] min-h-20 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f]'
            whileHover={{ y: -5, boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, .5)" }}
        >
            <div className="px-4 py-5 sm:p-6">
                <span className="flex items-center text-sm font-medium text-gray-300">
                    {renderIcon()}
                    {name}
                </span>
                <p className="mt-1 text-3xl font-semibold text-white">
                    {value}
                </p>
            </div>
        </motion.div>
    )
}
export default StatCard
