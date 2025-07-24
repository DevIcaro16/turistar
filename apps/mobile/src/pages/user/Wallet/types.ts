export interface Transaction {
    id: string;
    type: string;
    description: string;
    amount: number;
    createdAt: Date;
}

export interface TransactionTotals {
    DEBIT: { amount: number };
    REVERSAL: { amount: number };
    total: { amount: number };
}

export const TRANSACTION_TYPES = [
    { key: 'REVERSAL', label: 'Estornos', color: '#34C759' },
    { key: 'DEBIT', label: 'Débitos', color: '#FF3B30' },
] as const; 