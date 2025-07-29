'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelector from '../../components/RoleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SignInSchema } from '../../schemas/schema-yup';
import { login, isAuthenticated } from '../../lib/auth';
import { useAlertContext } from '../../components/AlertProvider';

// Forçar página dinâmica
export const dynamic = 'force-dynamic';

const Login = () => {
    const router = useRouter();
    const { showSuccess, showError } = useAlertContext();
    const [role, setRole] = useState<'driver' | 'admin'>('admin');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Se já está autenticado, redirecionar para home
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [router]);

    // Durante SSR, renderizar um loading
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#232323] to-[#1a1a1a] flex flex-col items-center justify-center p-4">
                <div className="text-gray-100 text-lg">Carregando...</div>
            </div>
        );
    }

    return (
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

                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={SignInSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                setError('');
                                setLoading(true);
                                try {
                                    const result = await login(values.email, values.password, role);

                                    if (result.success) {
                                        showSuccess('Login realizado com sucesso!', 'Bem-vindo ao sistema Turistar.');
                                        router.push('/');
                                    } else {
                                        const errorMessage = result.error || 'Erro ao fazer login';
                                        setError(errorMessage);
                                        showError('Erro no login', errorMessage);
                                    }
                                } catch (err) {
                                    const errorMessage = 'Erro ao fazer login. Tente novamente.';
                                    setError(errorMessage);
                                    showError('Erro no login', errorMessage);
                                } finally {
                                    setSubmitting(false);
                                    setLoading(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-200">
                                            Tipo de conta
                                        </Label>
                                        <RoleSelector selectedRole={role} onRoleChange={setRole} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                                            E-mail
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Field
                                                as={Input}
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="pl-10 bg-[#181818] border-[#333] text-gray-100 placeholder:text-gray-500 focus:border-[#fefefe] focus:ring-[#fefefe]/20"
                                            />
                                        </div>
                                        <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                                            Senha
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Field
                                                as={Input}
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 bg-[#181818] border-[#333] text-gray-100 placeholder:text-gray-500 focus:border-[#fefefe] focus:ring-[#fefefe]/20"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1" />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="w-full bg-[#fff] hover:bg-gray-400  text-[#181818] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        size="lg"
                                    >
                                        {isSubmitting || loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-[#181818] border-t-transparent rounded-full animate-spin"></div>
                                                Entrando...
                                            </div>
                                        ) : (
                                            'Entrar no sistema'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        {/* Footer Links */}
                        <div className="space-y-4 pt-4 border-t border-[#333]">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">
                                    {/* Não tem uma conta?{' '} */}
                                    {/* <Link
                                        href="/SignUp"
                                        className="text-[#fefefe] hover:text-[#fefefe] font-medium transition-colors"
                                    >
                                        Cadastre-se
                                    </Link> */}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;