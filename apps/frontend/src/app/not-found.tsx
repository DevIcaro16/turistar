'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-100 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">Página não encontrada</h2>
                <p className="text-gray-400 mb-8">
                    A página que você está procurando não existe ou foi movida.
                </p>
                <Link
                    href="/"
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Voltar para o início
                </Link>
            </div>
        </div>
    );
} 