'use client';

import Image from 'next/image'
import React from 'react'
import logo from '../../public/icon.png';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className='bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg'>

            <div className="max-w-8xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">

                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100">
                    DASHBOARD
                </h1>

                <div className="flex items-center ml-80 space-x-3 sm:space-x-6">
                    <Image
                        src={logo}
                        alt='Logo Turistar'
                        width={72}
                        height={50}
                        className='shadow-md cursor-pointer'
                    />

                    <div className="relative">
                        <Bell className='w-7 sm:w-6 h-7 sm:h-6 text-gray-300 cursor-pointer hover:text-white' />
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* <Image
                            src={admin}
                            alt='Admin'
                            width={35}
                            height={35}
                            className='rounded-full border border-gray-600'
                        /> */}
                    </div>

                    <span className="hidden sm:block text-gray-200 fs font-normal">
                        {user?.name || 'Usuário'}
                    </span>

                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:block">Sair</span>
                    </button>

                </div>

            </div>
        </header>
    )
}

export default Header