'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import Sibebar from '../components/Sibebar';
import Overview from '../components/Overview';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Só renderiza após autenticação estar pronta
  if (authLoading) {
    return (
      <div className='flex-1 flex items-center justify-center min-h-screen bg-[#1e1e1e]'>
        <span className="text-gray-400 text-lg">Carregando autenticação...</span>
      </div>
    );
  }


  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#1e1e1e]">
        <Sibebar />
        <div className="flex-1">
          <Header />
          <Overview />
        </div>
      </div>
    </ProtectedRoute>
  );
}
