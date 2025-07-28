"use client";

import React, { useEffect, useState } from 'react';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import { useAuth, isAuthenticated } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import api from '../../util/api/api';
import { ArrowDownCircle, ArrowUpCircle, Clock, RefreshCcw, DollarSign } from "lucide-react";


export const dynamic = 'force-dynamic';

const AccountPage = () => {
    const { user, loading, isAuthenticated: authStatus } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [cars, setCars] = useState<any[]>([]);
    const [touristPoints, setTouristPoints] = useState<any[]>([]);
    const [tourPackages, setTourPackages] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any>({});
    const [wallet, setWallet] = useState<number>(0.00);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        setMounted(true);

        if (!isAuthenticated()) {
            router.push('/Login');
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            setLoadingData(true);
            try {
                const [carsData, touristPointsData, tourPackagesData, walletData, wallet] = await Promise.all([
                    fetchDriverCars(user.id),
                    fetchDriverTouristPoints(user.id),
                    fetchDriverTourPackages(user.id),
                    fetchDriverTransactions(user.id),
                    fetchDriverWallet(user.id),
                ]);
                setCars(carsData);
                setTouristPoints(touristPointsData || []);
                setTourPackages(tourPackagesData || []);
                setTransactions(walletData || {});
                setWallet(wallet.balance || 0);

            } catch (err) {
                setCars([]);
                setTouristPoints([]);
                setTourPackages([]);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [user?.id]);


    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center">
                <div className="text-gray-100 text-lg">Carregando...</div>
            </div>
        );
    }

    const fetchDriverCars = async (driverId: string) => {
        const res = await api.get(`car/driver/${driverId}`, { withCredentials: true });
        return res.data.cars;
    };

    const fetchDriverTouristPoints = async (driverId: string) => {
        const res = await api.get(`/TouristPoint/driver/${driverId}`, { withCredentials: true });
        return res.data.touristPoints;
    };

    const fetchDriverTourPackages = async (driverId: string) => {
        const res = await api.get(`/TourPackage/driver/${driverId}`, { withCredentials: true });
        return res.data.tourPackages;
    };

    const fetchDriverTransactions = async (driverId: string) => {
        const res = await api.get('transaction/driver/totals', { withCredentials: true });

        return res.data.totals;
    };

    const fetchDriverWallet = async (driverId: string) => {
        const res = await api.get('/driver/metrics/all', { withCredentials: true });
        return res.data.metrics.wallet;
    };

    function formatDateTime(date: string) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hour}:${minute}`;
    }


    if (!authStatus) {
        return null;
    }


    const walletSummary = [
        {
            key: 'CREDIT',
            label: 'Crédito',
            color: 'bg-green-900/30 border-green-600',
            icon: <ArrowDownCircle className="w-7 h-7 text-green-400" />,
            value: transactions?.CREDIT?.amount || 0,
            count: transactions?.CREDIT?.count || 0,
        },
        {
            key: 'DEBIT',
            label: 'Débito',
            color: 'bg-red-900/30 border-red-600',
            icon: <ArrowUpCircle className="w-7 h-7 text-red-400" />,
            value: transactions?.DEBIT?.amount || 0,
            count: transactions?.DEBIT?.count || 0,
        },
        {
            key: 'PENDANT',
            label: 'Pendente',
            color: 'bg-yellow-900/30 border-yellow-600',
            icon: <Clock className="w-7 h-7 text-yellow-400" />,
            value: transactions?.PENDANT?.amount || 0,
            count: transactions?.PENDANT?.count || 0,
        },
        {
            key: 'REVERSAL',
            label: 'Estornado',
            color: 'bg-blue-900/30 border-blue-600',
            icon: <RefreshCcw className="w-7 h-7 text-blue-400" />,
            value: transactions?.REVERSAL?.amount || 0,
            count: transactions?.REVERSAL?.count || 0,
        },








    ];

    return (
        <div className='flex min-h-screen bg-[#1e1e1e]'>
            <Sibebar />
            <div className="flex-1">
                <Header />
                <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row gap-8 mb-10">
                        {/* Driver Info Card */}
                        <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6 border border-[#2f2f2f]">
                            <img
                                src={user?.image || '/default-avatar.png'}
                                alt="Driver"
                                className="w-32 h-32 rounded-full object-cover border-4 border-[#3b82f6] shadow-md mb-4 md:mb-0"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-100 mb-2">{user?.name}</h2>
                                <p className="text-gray-400 mb-1"><span className="font-semibold text-gray-300">E-mail:</span> {user?.email}</p>
                                <p className="text-gray-400 mb-1"><span className="font-semibold text-gray-300">Telefone:</span> {user?.phone}</p>
                                <p className="text-gray-400 mb-1"><span className="font-semibold text-gray-300">Tipo:</span> Motorista</p>
                                <p className="text-gray-400 mb-1"><span className="font-semibold text-gray-300">ID:</span> {user?.id}</p>
                            </div>
                        </div>
                        {/* Wallet Card */}
                        {
                            loadingData ? (
                                <p className="text-gray-400">Carregando...</p>
                            ) : (
                                <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-8 flex flex-col justify-center border border-[#2f2f2f]">
                                    <h2 className="text-xl font-bold text-gray-100 mb-4">Carteira</h2>
                                    {
                                        wallet ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                                {walletSummary.map((item) => (
                                                    <div
                                                        key={item.key}
                                                        className={`flex flex-col items-center justify-center rounded-xl border p-4 ${item.color} shadow transition`}
                                                    >
                                                        <div className="mb-2">{item.icon}</div>
                                                        <div className="text-lg font-bold text-gray-100 text-sm">{item.label}</div>
                                                        <div className="text-2xl font-extrabold text-gray-100 mt-1 text-sm">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                        <div className="text-xs text-gray-400 mt-1">{item.count} transaç{item.count === 1 ? 'ão' : 'ões'}</div>
                                                    </div>
                                                ))}

                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-400 mb-2">Nada encontrado</p>
                                            </>
                                        )
                                    }
                                    <div className="flex flex-col items-center justify-center mt-4 min-w-full">
                                        <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-xl shadow-lg px-8 py-6 border-2 border-green-700 flex flex-col items-center w-full max-w-3xl mx-auto">
                                            <span className="text-gray-100 text-lg font-semibold mb-2 tracking-wide">SALDO ATUAL</span>
                                            <span className="text-4xl font-extrabold text-white drop-shadow-lg mb-1">R$ {wallet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        {/* Cars Card */}
                        <div className="bg-[#232323] rounded-xl shadow-lg p-6 border border-[#2f2f2f]">
                            <h3 className="text-lg font-bold text-gray-100 mb-4">Carros Vinculados</h3>
                            {loadingData ? (
                                <p className="text-gray-400">Carregando...</p>
                            ) : cars.length === 0 ? (
                                <p className="text-gray-400">Nenhum carro vinculado.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cars.map(car => (
                                        <li key={car.id} className="text-gray-200 flex items-center gap-3 border-b border-[#333] pb-2 last:border-b-0 last:pb-0">
                                            <img src={car.image || '/default-entity.png'} alt={car.model} className="w-24 h-24 rounded object-cover border border-[#444]" />
                                            <div>
                                                <span className="font-semibold">{car.model}</span><br />
                                                <span className="text-xs text-gray-400">Placa: {car.plate || car.licensePlate} | Capacidade: {car.capacity}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* Tourist Points Card */}
                        <div className="bg-[#232323] rounded-xl shadow-lg p-6 border border-[#2f2f2f]">
                            <h3 className="text-lg font-bold text-gray-100 mb-4">Pontos Turísticos Vinculados</h3>
                            {loadingData ? (
                                <p className="text-gray-400">Carregando...</p>
                            ) : touristPoints.length === 0 ? (
                                <p className="text-gray-400">Nenhum ponto turístico vinculado.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {touristPoints.map(tp => (
                                        <li key={tp.id} className="text-gray-200 flex items-center gap-3 border-b border-[#333] pb-2 last:border-b-0 last:pb-0">
                                            <img src={tp.image || '/default-entity.png'} alt={tp.name} className="w-24 h-24 rounded object-cover border border-[#444]" />
                                            <div>
                                                <span className="font-semibold">{tp.name}</span><br />
                                                <span className="text-xs text-gray-400">Cidade: {tp.city}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* Tour Packages Card */}
                        <div className="bg-[#232323] rounded-xl shadow-lg p-6 border border-[#2f2f2f] flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-100 mb-4">Pacotes de Passeio</h3>
                                {loadingData ? (
                                    <p className="text-gray-400">Carregando...</p>
                                ) : tourPackages.length === 0 ? (
                                    <p className="text-gray-400">Nenhum pacote vinculado.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {tourPackages.map(tp => (
                                            <li key={tp.id} className="text-gray-200 flex items-center gap-3 border-b border-[#333] pb-2 last:border-b-0 last:pb-0">
                                                <img src={tp.image || '/default-entity.png'} alt={tp.title} className="w-24 h-24 rounded object-cover border border-[#444]" />
                                                <div>
                                                    <span className="font-semibold">{tp.title}</span><br />
                                                    <span className="text-xs text-gray-400">Data: {formatDateTime(tp.date_tour || tp.date)} | Valor: R$ {tp.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Danger Zone */}
                            <div className="mt-8">
                                <div className="bg-red-900/10 border border-red-700 rounded-lg p-4 text-center">
                                    <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                                    <p className="text-red-300 mb-4">Esta ação é irreversível. Ao deletar sua conta, todos os seus dados serão permanentemente removidos.</p>
                                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition">Deletar Conta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountPage;