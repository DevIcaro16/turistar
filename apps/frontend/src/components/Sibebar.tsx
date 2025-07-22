import React, { useContext, useEffect, useState } from 'react';
import {
    LineChart,
    Users,
    UserCheck,
    Receipt,
    FileText,
    HelpCircle,
    Settings,
    Menu, // Adicionado o ícone de ajuda
} from "lucide-react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

interface Icons {
    icon: string;
    name: string;
    href: string;
};

const iconsDriver = [
    { icon: LineChart, name: 'Gráficos', href: '/' },
    { icon: Receipt, name: 'Transações', href: '/Transactions' },
    { icon: FileText, name: 'Sua Conta', href: '/Account' },
    { icon: HelpCircle, name: 'Ajuda', href: '/Help' },
];

const iconsAdmin = [
    { icon: LineChart, name: 'Gráficos', href: '/' },
    { icon: Users, name: 'Usuários', href: '/Users' },
    { icon: UserCheck, name: 'Motoristas', href: '/Drivers' },
    { icon: Receipt, name: 'Transações', href: '/Transactions' },
    { icon: Settings, name: 'Configurações', href: '/Configurations' },
];


const Sibebar = () => {


    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
    const [sideBarItems, setSideBarItems] = useState<any[]>([]);
    const pathname = usePathname();

    const { user, userRole } = useAuth();

    useEffect(() => {
        if (userRole === "driver") setSideBarItems(iconsDriver);
        if (userRole === "admin") setSideBarItems(iconsAdmin);
    }, []);

    return (
        <div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSideBarOpen ? "w-64" : "w-20"}`}>

            <div className="h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]">

                <button
                    title='Menu'
                    onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                    className='p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer'
                >
                    <Menu />
                </button>

                <nav className="mt-8 flex-grow">
                    {sideBarItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <div className={`flex items-center p-4 text-sm font-medium rounded-md hover:bg-[#2f2f2f] transition-colors mb-2 ${pathname === item.href ? "bg-[#2f2f2f]" : ""}`}>
                                <item.icon className="mr-2 w-5 h-5" style={{ minWidth: "20px" }} />
                                {
                                    isSideBarOpen && (
                                        item.name
                                    )
                                }
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sibebar;