'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1e1e1e]">
        <Header />
        <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-[#232323] rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-4">
              Bem-vindo ao Dashboard
            </h1>
            <p className="text-gray-300 mb-4">
              Olá, {user?.name}! Você está logado como {user?.role}.
            </p>
            <p className="text-gray-400 text-sm">
              Use o botão "Sair" no cabeçalho para fazer logout.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
