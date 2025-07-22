import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface TableColumn {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode; // opcional para customização
}

interface TableComponentProps {
    columns: TableColumn[];
    data: any[];
    title?: string;
    searchPlaceholder?: string;
}

const TableComponent: React.FC<TableComponentProps> = ({
    columns,
    data,
    title = "Tabela",
    searchPlaceholder = "Buscar..."
}) => {
    const [search, setSearch] = useState("");

    // Filtro simples por texto
    const filteredData = data.filter(row =>
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
    );

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
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#232323] transition">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2 text-sm text-gray-200">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TableComponent;