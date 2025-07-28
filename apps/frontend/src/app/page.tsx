'use client';

import React, { useState, useEffect } from 'react';
import Sibebar from '../components/Sibebar';
import Header from '../components/Header';
import { useAuth, isAuthenticated } from '../lib/auth';
import { useRouter } from 'next/navigation';
import Overview from '../components/Overview';


export const dynamic = 'force-dynamic';

const HomePage = () => {
  const { user, loading, isAuthenticated: authStatus } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push('/Login');
    }
  }, [router]);


  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center">
        <div className="text-gray-100 text-lg">Carregando...</div>
      </div>
    );
  }


  if (!authStatus) {
    return null;
  }

  return (
    <div className='flex min-h-screen bg-[#1e1e1e]'>
      <Sibebar />
      <div className="flex-1">
        <Header />
        <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
          <Overview />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
