import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext';
import { AlertProvider } from '../components/AlertProvider';
import './global.css';

export const metadata = {
  title: 'Admin - Turistar',
  description: 'Bem vindo ao Painel admin - Turistar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  )
}
