"use client";

import React, { useEffect, useState } from 'react';
import TableGeneric from '../../components/TableGeneric';
import Modal from '../../components/Modal';
import api from '../../util/api/api';
import { ToastContainer, toast } from 'react-toastify';
import Sibebar from '../../components/Sibebar';
import Header from '../../components/Header';


interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/metrics/users', { withCredentials: true });
                setUsers(response.data.users);
            } catch (error) {
                toast.error("Falha ao buscar usuários.");
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleView = (item: User) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item: User) => {
        if (window.confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
            try {
                // await api.delete(`/admin/users/${item.id}`);
                setUsers(users.filter(u => u.id !== item.id));
                toast.success("Usuário excluído com sucesso!");
            } catch (error) {
                toast.error("Falha ao excluir usuário.");
                console.error("Failed to delete user:", error);
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
                    <ToastContainer />
                    <TableGeneric
                        data={users}
                        columns={columns}
                        title="Usuários"
                        searchPlaceholder="Buscar por nome, email..."
                        onView={(item) => handleView(item as User)}
                        onDelete={(item) => handleDelete(item as User)}
                    />
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalhes do Usuário">
                        {selectedItem && (
                            <div className="text-white flex flex-col items-center">
                                <img src={selectedItem.image || `https://ui-avatars.com/api/?name=${selectedItem.name}&background=1e1e1e&color=fff`} alt={selectedItem.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                                <p><strong>ID:</strong> {selectedItem.id}</p>
                                <p><strong>Nome:</strong> {selectedItem.name}</p>
                                <p><strong>Email:</strong> {selectedItem.email}</p>
                            </div>
                        )}
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default UsersPage;
