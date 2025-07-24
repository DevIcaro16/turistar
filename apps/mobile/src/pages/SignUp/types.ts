export type typeUser = 'user' | 'driver';

export interface FormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    TransportType: string;
}

export const transportOptions = [
    { label: 'Selecione um tipo', value: '' },
    { label: 'Buggy', value: 'BUGGY' },
    { label: 'Lancha', value: 'LANCHA' },
    { label: '4x4', value: 'FOUR_BY_FOUR' }
];
