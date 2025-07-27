'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">Erro interno</h2>
                <p className="text-gray-400 mb-8">
                    Algo deu errado. Tente novamente ou volte para a página inicial.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Tentar novamente
                    </button>
                    <Link
                        href="/"
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Voltar para o início
                    </Link>
                </div>
            </div>
        </div>
    );
} 