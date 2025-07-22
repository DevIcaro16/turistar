"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../util/api/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const taxSchema = Yup.object().shape({
    tax: Yup.number()
        .typeError('Digite um número válido')
        .min(0, 'A taxa não pode ser negativa')
        .required('A taxa é obrigatória'),
});

const Configuration = () => {

    const { userRole } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [currentTax, setCurrentTax] = useState<number | null>(null);

    // Mova fetchCurrentTax para o escopo do componente
    const fetchCurrentTax = async () => {
        try {
            const res = await api.get('/admin/metrics/tax-platform', { withCredentials: true });
            if (res.data.platformRevenue !== undefined && res.data.platformRevenue !== null) {
                setCurrentTax(res.data.platformRevenue);
            }
        } catch (err) {
            setCurrentTax(null);
        }
    };

    useEffect(() => {
        fetchCurrentTax();
    }, []);

    if (userRole !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1e1e1e]">
                <span className="text-gray-400 text-lg">Acesso restrito ao administrador.</span>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[#1e1e1e]">
                <Sibebar />
                <div className="flex-1">
                    <Header />
                    <main className="max-w-2xl mx-auto py-12 px-4 lg:px-8">
                        <div className="bg-[#232323] rounded-xl shadow-lg p-8 border border-[#2f2f2f]">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Configuração da Plataforma</h2>
                            <div className="mb-6 text-center">
                                <span className="text-gray-300 text-lg font-medium">Taxa atual da plataforma: </span>
                                <span className="text-[#10b981] text-lg font-bold">{currentTax !== null ? `${currentTax}%` : 'Carregando...'}</span>
                            </div>
                            <Formik
                                initialValues={{ tax: '' }}
                                validationSchema={taxSchema}
                                onSubmit={async (values, { setSubmitting, resetForm }) => {
                                    setLoading(true);
                                    setSuccess('');
                                    setError('');
                                    try {
                                        const res = await api.put('/admin/metrics/configuration', { tax: values.tax }, { withCredentials: true });
                                        if (res.data.success) {
                                            setSuccess('Taxa atualizada com sucesso!');
                                            resetForm();
                                            fetchCurrentTax(); // Agora funciona pois está no escopo
                                        } else {
                                            setError('Erro ao atualizar taxa.');
                                        }
                                    } catch (err: any) {
                                        setError(err.response?.data?.message || 'Erro ao atualizar taxa.');
                                    } finally {
                                        setLoading(false);
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        <div>
                                            <label htmlFor="tax" className="block text-gray-300 font-medium mb-2">Taxa da Plataforma (%)</label>
                                            <Field
                                                id="tax"
                                                name="tax"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-2 rounded-md bg-[#181818] border border-[#333] text-gray-100 placeholder:text-gray-500 focus:border-[#fefefe] focus:ring-[#fefefe]/20"
                                                placeholder="Digite a nova taxa (%)"
                                            />
                                            <ErrorMessage name="tax" component="div" className="text-red-400 text-xs mt-1" />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || isSubmitting}
                                            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading || isSubmitting ? 'Salvando...' : 'Salvar Taxa'}
                                        </button>
                                        {success && <div className="text-green-400 text-center font-medium">{success}</div>}
                                        {error && <div className="text-red-400 text-center font-medium">{error}</div>}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Configuration;
