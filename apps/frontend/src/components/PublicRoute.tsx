'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-gray-100 text-lg">Carregando...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default PublicRoute; 