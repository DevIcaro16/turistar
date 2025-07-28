import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    createdAt: string;
    [key: string]: any;
    user: {
        name: string;
    }
}

interface TableTransactionsProps {
    data: Transaction[];
    title?: string;
    searchPlaceholder?: string;
    isAdmin?: boolean;
}

const typeColors: Record<string, string> = {
    CREDIT: 'text-green-400 bg-green-900/20',
    DEBIT: 'text-red-400 bg-red-900/20',
    PENDANT: 'text-yellow-400 bg-yellow-900/20',
    REVERSAL: 'text-blue-400 bg-blue-900/20',
};

const typeLabels: Record<string, string> = {
    CREDIT: 'Crédito',
    DEBIT: 'Débito',
    PENDANT: 'Pendente',
    REVERSAL: 'Estorno',
};

const TableTransactions: React.FC<TableTransactionsProps> = ({
    data,
    title = "Transações",
    searchPlaceholder = "Buscar...",
    isAdmin = false,
}) => {
    const [search, setSearch] = useState("");

    const filteredData = data.filter(row =>
        Object.values(row).some(val => String(val ?? '').toLowerCase().includes(search.toLowerCase()))
    );

    // console.log(data);

    return (
        <motion.div
            className='bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] max-2 md:mx-0 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2, duration: .5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
                <h2 className="text-lg md:text-xl font-semibold text-gray-100 text-center md:text-left">
                    {title}
                </h2>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='bg-[#2f2f2f] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64
                            focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm'
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>
            <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuário</th>
                            {isAdmin && (
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Motorista</th>
                            )}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                        </tr>
                    </thead>
                    <tbody className='gap-80'>
                        {filteredData.map((row, idx) => (
                            <tr key={row.id || idx} className={`hover:bg-[#232323] transition${idx !== 0 ? ' border-t-8 border-transparent' : ''}`}>
                                <td className="px-4 py-4 text-sm text-gray-200">{row.id}</td>
                                <td className="px-4 py-2 text-sm">
                                    <span className={`px-2 py-1 font-semibold ${typeColors[row.type] || 'text-gray-300'} rounded-md inline-block`}>
                                        {typeLabels[row.type] || row.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-100">R$ {Number(row.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2 text-sm text-gray-100">{row.user?.name}</td>
                                {isAdmin && (
                                    <td className="px-4 py-2 text-sm text-gray-100">{row.driver?.name || '-'}</td>
                                )}
                                <td className="px-4 py-2 text-sm text-gray-400">{new Date(row.createdAt).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TableTransactions; 