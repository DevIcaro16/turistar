"use client";

import React, { useState, useEffect } from 'react';

import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import { useAuth } from '../../lib/auth';
import api from '../../util/api/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAlertContext } from '../../components/AlertProvider';

const taxSchema = Yup.object().shape({
    tax: Yup.number()
        .typeError('Digite um número válido')
        .min(0, 'A taxa não pode ser negativa')
        .required('A taxa é obrigatória'),
});

const Configuration = () => {
    const [mounted, setMounted] = useState(false);
    const { userRole } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentTax, setCurrentTax] = useState<number | null>(null);
    const { showSuccess, showError } = useAlertContext();

    const fetchCurrentTax = async () => {
        try {
            const res = await api.get('/admin/metrics/tax-platform', { withCredentials: true });
            if (res.data.platformRevenue !== undefined && res.data.platformRevenue !== null) {
                setCurrentTax(res.data.platformRevenue);
            }
        } catch (err) {
            showError('Erro ao carregar taxa', 'Falha ao carregar a taxa atual da plataforma.');
            setCurrentTax(null);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchCurrentTax();
        }
    }, [mounted]);

    // Durante SSR, renderizar um loading
    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center">
                <div className="text-gray-100 text-lg">Carregando...</div>
            </div>
        );
    }

    if (mounted && userRole !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1e1e1e]">
                <span className="text-gray-400 text-lg">Acesso restrito ao administrador.</span>
            </div>
        );
    }

    return (
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
                                try {
                                    const res = await api.put('/admin/metrics/configuration', { tax: values.tax }, { withCredentials: true });
                                    if (res.data.success) {
                                        showSuccess('Taxa atualizada com sucesso!', 'A taxa da plataforma foi atualizada.');
                                        resetForm();
                                        fetchCurrentTax();
                                    } else {
                                        showError('Erro ao atualizar taxa', 'Falha ao atualizar a taxa da plataforma.');
                                    }
                                } catch (err: any) {
                                    const errorMessage = err.response?.data?.message || 'Erro ao atualizar taxa.';
                                    showError('Erro ao atualizar taxa', errorMessage);
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
                                </Form>
                            )}
                        </Formik>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Configuration;
