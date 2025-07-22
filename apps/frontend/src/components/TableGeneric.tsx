
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Trash2 } from 'lucide-react';
import Modal from './Modal'; // Supondo que o Modal exista

interface DataItem {
    id: string;
    [key: string]: any;
}

interface Column {
    header: string;
    accessor: string;
    isImage?: boolean;
}

interface TableGenericProps {
    data: DataItem[];
    columns: Column[];
    title?: string;
    searchPlaceholder?: string;
    onView: (item: DataItem) => void;
    onDelete: (item: DataItem) => void;
}

const TableGeneric: React.FC<TableGenericProps> = ({
    data,
    columns,
    title = "Registros",
    searchPlaceholder = "Buscar...",
    onView,
    onDelete,
}) => {
    const [search, setSearch] = useState("");

    const filteredData = data.filter(row =>
        Object.values(row).some(val =>
            String(val ?? '').toLowerCase().includes(search.toLowerCase())
        )
    );

    console.log(data);

    return (
        <motion.div
            className='bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] md:mx-0 mb-8'
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
                            {columns.map((col) => (
                                <th key={col.accessor} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{col.header}</th>
                            ))}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className='gap-80'>
                        {filteredData.map((row, idx) => (
                            <tr key={row.id || idx} className={`hover:bg-[#232323] transition${idx !== 0 ? ' border-t-8 border-transparent' : ''}`}>
                                {columns.map((col) => (
                                    <td key={col.accessor} className="px-4 py-4 text-sm text-gray-200 whitespace-nowrap">
                                        {col.isImage ? (
                                            <img src={row[col.accessor] || `https://ui-avatars.com/api/?name=${row.name}&background=2f2f2f&color=fff`} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            row[col.accessor]
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-4 text-sm text-gray-200">
                                    <div className="flex items-center gap-4">
                                        <button
                                            title='visualizar'
                                            onClick={() => onView(row)} className="text-blue-400 hover:text-blue-300">
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            title='deletar'
                                            onClick={() => onDelete(row)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TableGeneric; 