"use client";

import React from 'react';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';

const HelpPage = () => {

    return (
        <ProtectedRoute>
            <div className='flex min-h-screen bg-[#1e1e1e]'>
                <Sibebar />
                <div className="flex-1">
                    <Header />
                    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818] py-12 px-4">
                        <div className="bg-[#232323] rounded-xl shadow-lg p-8 md:p-12 max-w-2xl w-full border border-[#2f2f2f] mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 text-center">Central de Ajuda</h1>
                            <p className="text-gray-300 text-lg text-center mb-6">
                                Bem-vindo à central de informações e suporte da <span className="text-[#3b82f6] font-semibold">Passeios Turísticos Turistar</span>.<br />
                                Aqui você encontra nossos canais de atendimento e informações úteis para tirar dúvidas, resolver problemas ou falar com nosso time.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Canal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-[#20232a] transition">
                                            <td className="px-6 py-4 text-gray-200 font-medium">Telefone</td>
                                            <td className="px-6 py-4 text-gray-100">(11) 4002-8922</td>
                                        </tr>
                                        <tr className="hover:bg-[#20232a] transition">
                                            <td className="px-6 py-4 text-gray-200 font-medium">WhatsApp</td>
                                            <td className="px-6 py-4 text-gray-100">(11) 98888-7777</td>
                                        </tr>
                                        <tr className="hover:bg-[#20232a] transition">
                                            <td className="px-6 py-4 text-gray-200 font-medium">E-mail</td>
                                            <td className="px-6 py-4 text-gray-100">suporte.turistarturismo@gmail.com</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-[#232323] rounded-xl shadow-lg p-8 md:p-10 max-w-2xl w-full border border-[#2f2f2f]">
                            <h2 className="text-2xl font-semibold text-gray-100 mb-3 text-center">Sobre a Turistar</h2>
                            <p className="text-gray-300 text-base text-center">
                                A <span className="text-[#3b82f6] font-semibold">Passeios Turísticos Turistar</span> é referência em experiências turísticas personalizadas, conectando viajantes a roteiros incríveis e motoristas qualificados. Nosso compromisso é garantir segurança, conforto e atendimento de excelência em cada passeio.<br /><br />
                                Precisa de ajuda? Entre em contato por um de nossos canais acima. Nosso time está pronto para te atender!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default HelpPage;
