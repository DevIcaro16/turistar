export interface TourPackage {
    id: string;
    title: string;
    date_tour: string;
    origin_local: string;
    destiny_local: string;
    price: number;
}

export interface Transaction {
    id: string;
    type: string;
    amount: number;
    createdAt: string;
}

export interface DriverStats {
    passeiosHojeCont: number;
    ganhosHoje: number;
    passeiosHoje: TourPackage[];
} 