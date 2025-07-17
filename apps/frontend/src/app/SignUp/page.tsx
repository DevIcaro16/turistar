'use client';

import React, { useState } from 'react';
import PublicRoute from '../../components/PublicRoute';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [role, setRole] = useState<'driver' | 'admin'>('admin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, loadingAuth } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validações básicas
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            // Simular cadastro - na implementação real, você faria uma chamada para a API
            // Por enquanto, vamos apenas fazer login com as credenciais fornecidas
            await login(formData.email, formData.password, role);
        } catch (error) {
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center">
                <div className="bg-[#232323] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Criar Conta</h2>

                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'driver' | 'admin')}
                            className="px-4 py-2 rounded bg-[#181818] text-gray-100 border border-[#333] focus:outline-none focus:border-[#00e6a7]"
                            required
                            title="Tipo de usuário"
                            aria-label="Selecione o tipo de usuário"
                        >
                            <option value="admin">Administrador</option>
                            <option value="driver">Motorista</option>
                        </select>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            className="px-4 py-2 rounded bg-[#181818] text-gray-100 border border-[#333] focus:outline-none focus:border-[#00e6a7]"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            className="px-4 py-2 rounded bg-[#181818] text-gray-100 border border-[#333] focus:outline-none focus:border-[#00e6a7]"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                            className="px-4 py-2 rounded bg-[#181818] text-gray-100 border border-[#333] focus:outline-none focus:border-[#00e6a7]"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar senha"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="px-4 py-2 rounded bg-[#181818] text-gray-100 border border-[#333] focus:outline-none focus:border-[#00e6a7]"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || loadingAuth}
                            className="bg-[#00e6a7] text-[#181818] font-semibold py-2 rounded hover:bg-[#00b383] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || loadingAuth ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Já tem uma conta?{' '}
                            <Link href="/Login" className="text-[#00e6a7] hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
};

export default SignUp; 