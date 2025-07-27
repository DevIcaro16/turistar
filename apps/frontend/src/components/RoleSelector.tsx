'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { User, Car } from 'lucide-react';

interface RoleSelectorProps {
    selectedRole: 'driver' | 'admin';
    onRoleChange: (role: 'driver' | 'admin') => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <Card
                className={`h-36  cursor-pointer transition-all duration-200 hover:scale-105 ${selectedRole === 'admin'
                    ? 'border-white bg-[#232323] shadow-lg'
                    : 'border-gray-600 bg-[#181818] hover:border-gray-400'
                    }`}
                onClick={() => onRoleChange('admin')}
            >
                <CardContent className="p-4 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full ${selectedRole === 'admin'
                            ? 'bg-white text-[#181818]'
                            : 'bg-gray-700 text-gray-300'
                            }`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-sm ${selectedRole === 'admin'
                                ? 'text-white'
                                : 'text-gray-200'
                                }`}>
                                Administrador
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                                Acesso completo
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card
                className={`h-36 cursor-pointer transition-all duration-200 hover:scale-105 ${selectedRole === 'driver'
                    ? 'border-white bg-[#232323] shadow-lg'
                    : 'border-gray-600 bg-[#181818] hover:border-gray-400'
                    }`}
                onClick={() => onRoleChange('driver')}
            >
                <CardContent className="p-4 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full ${selectedRole === 'driver'
                            ? 'bg-white text-[#181818]'
                            : 'bg-gray-700 text-gray-300'
                            }`}>
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-sm ${selectedRole === 'driver'
                                ? 'text-white'
                                : 'text-gray-200'
                                }`}>
                                Motorista
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                                Gestão de viagens
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 