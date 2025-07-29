"use client";

import React, { useEffect, useState } from 'react';
import TableGeneric from '../../components/TableGeneric';
import Modal from '../../components/Modal';
import api from '../../util/api/api';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';
import { useAlertContext } from '../../components/AlertProvider';

interface Driver {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
}

const DriversPage = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedItem, setSelectedItem] = useState<Driver | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showSuccess, showError } = useAlertContext();

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get('/admin/metrics/drivers', { withCredentials: true });
                setDrivers(response.data.drivers);
            } catch (error) {
                showError('Erro ao buscar motoristas', 'Falha ao carregar a lista de motoristas. Tente novamente.');
                console.error("Failed to fetch drivers:", error);
            }
        };
        fetchDrivers();
    }, [showError]);

    const handleView = (item: Driver) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item: Driver) => {
        if (window.confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
            try {
                // await api.delete(`/admin/drivers/${item.id}`);
                setDrivers(drivers.filter(d => d.id !== item.id));
                showSuccess('Motorista excluído', `${item.name} foi excluído com sucesso!`);
            } catch (error) {
                showError('Erro ao excluir motorista', 'Falha ao excluir o motorista. Tente novamente.');
                console.error("Failed to delete driver:", error);
            }
        }
    };

    const columns = [
        { header: 'Image', accessor: 'image', isImage: true },
        { header: 'ID', accessor: 'id' },
        { header: 'Nome', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
    ];

    return (
        <div className='flex min-h-screen bg-[#1e1e1e]'>
            <Sibebar />
            <div className="flex-1">
                <Header />
                <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                    <TableGeneric
                        data={drivers}
                        columns={columns}
                        title="Motoristas"
                        searchPlaceholder="Buscar por nome, email..."
                        onView={(item) => handleView(item as Driver)}
                        onDelete={(item) => handleDelete(item as Driver)}
                    />
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalhes do Motorista">
                        {selectedItem && (
                            <div className="text-white flex flex-col items-center">
                                <img src={selectedItem.image || `https://ui-avatars.com/api/?name=${selectedItem.name}&background=1e1e1e&color=fff`} alt={selectedItem.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                                <p><strong>ID:</strong> {selectedItem.id}</p>
                                <p><strong>Nome:</strong> {selectedItem.name}</p>
                                <p><strong>Email:</strong> {selectedItem.email}</p>
                                <p><strong>Tipo de transporte:</strong> {selectedItem.transport_type}</p>
                            </div>
                        )}
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default DriversPage;
