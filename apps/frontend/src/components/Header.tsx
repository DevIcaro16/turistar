'use client';

import React, { useState, useEffect } from 'react';
import logo from '../../public/icon.png';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
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
            <header className="bg-[#1e1e1e] shadow-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src={logo.src} alt="Logo" className="h-8 w-auto" />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-[#1e1e1e] shadow-sm border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <img src={logo.src} alt="Logo" className="h-8 w-auto" />
                    </div>

                    <div className="flex items-center space-x-4">
                        <button title='notifications' className="p-2 rounded-full text-gray-400 hover:text-gray-300">
                            <Bell className="h-6 w-6" />
                        </button>

                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-sm">
                                    <p className="text-gray-100 font-medium">{user.name}</p>
                                    <p className="text-gray-400">{user.role}</p>
                                </div>
                                <button
                                    title='logout'
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-gray-400 hover:text-gray-300"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;