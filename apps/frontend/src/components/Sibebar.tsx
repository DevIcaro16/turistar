'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Home,
    Users,
    Car,
    CreditCard,
    Settings,
    HelpCircle,
    User,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../lib/auth';

const Sibebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/Login');
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    if (!mounted) {
        return (
            <aside className="bg-[#1e1e1e] shadow-lg w-64 min-h-screen">
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-100">Menu</h2>
                </div>
            </aside>
        );
    }

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/', roles: ['admin', 'driver'] },
        { name: 'Usuários', icon: Users, path: '/Users', roles: ['admin'] },
        { name: 'Motoristas', icon: Car, path: '/Drivers', roles: ['admin'] },
        { name: 'Transações', icon: CreditCard, path: '/Transactions', roles: ['admin', 'driver'] },
        { name: 'Configurações', icon: Settings, path: '/Configurations', roles: ['admin'] },
        { name: 'Ajuda', icon: HelpCircle, path: '/Help', roles: ['admin', 'driver'] },
        { name: 'Conta', icon: User, path: '/Account', roles: ['admin', 'driver'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <aside className="bg-[#1e1e1e] shadow-lg w-64 min-h-screen">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-100 mb-6">Menu</h2>

                <nav className="space-y-2">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                    ? 'bg-[#333] text-white'
                                    : 'text-gray-300 hover:bg-[#2a2a2a]'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sibebar;