import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/Login', '/SignUp'];

    // Verificar se é uma rota pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Se não for rota pública e não estiver na raiz, permitir acesso
    // O controle de autenticação será feito pelos componentes ProtectedRoute e PublicRoute
    if (!isPublicRoute && pathname !== '/') {
        return NextResponse.next();
    }

    // Para a raiz, permitir acesso (será controlado pelo componente)
    if (pathname === '/') {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 