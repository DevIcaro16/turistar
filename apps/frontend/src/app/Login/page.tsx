'use client';

import React, { useState } from 'react';
import PublicRoute from '../../components/PublicRoute';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import RoleSelector from '../../components/RoleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AlertCircle, Mail, Lock } from 'lucide-react';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'driver' | 'admin'>('admin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, loadingAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password, role);
        } catch (error) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#232323] to-[#1a1a1a] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Turistar</h1>
                        <p className="text-gray-400 text-sm">Sistema de Gestão de Turismo</p>
                    </div>

                    <Card className="bg-[#232323]/80 backdrop-blur-sm border-[#333] shadow-2xl">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-bold text-gray-100 text-center">
                                Bem-vindo de volta
                            </CardTitle>
                            <p className="text-gray-400 text-sm text-center">
                                Faça login para acessar sua conta
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Role Selector */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-200">
                                        Tipo de conta
                                    </Label>
                                    <RoleSelector selectedRole={role} onRoleChange={setRole} />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                                        E-mail
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            className="pl-10 bg-[#181818] border-[#333] text-gray-100 placeholder:text-gray-500 focus:border-[#fefefe] focus:ring-[#fefefe]/20"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                                        Senha
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            className="pl-10 bg-[#181818] border-[#333] text-gray-100 placeholder:text-gray-500 focus:border-[#fefefe] focus:ring-[#fefefe]/20"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={loading || loadingAuth}
                                    className="w-full bg-[#fff] hover:bg-gray-400  text-[#181818] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    {loading || loadingAuth ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#181818] border-t-transparent rounded-full animate-spin"></div>
                                            Entrando...
                                        </div>
                                    ) : (
                                        'Entrar no sistema'
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links */}
                            <div className="space-y-4 pt-4 border-t border-[#333]">

                                <div className="text-center">
                                    <p className="text-gray-400 text-sm">
                                        Não tem uma conta?{' '}
                                        <Link
                                            href="/SignUp"
                                            className="text-[#fefefe] hover:text-[#fefefe] font-medium transition-colors"
                                        >
                                            Cadastre-se
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicRoute>
    );
};

export default Login;