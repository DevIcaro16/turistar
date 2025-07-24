export interface Tour {
    id: string;
    tourPackage: {
        title: string;
        date_tour: string;
        origin_local: string;
        destiny_local: string;
        price: number;
    };
    canceled: boolean;
}

export interface Stats {
    passeiosHojeCont: number;
    passeiosHoje: Tour[];
    saldoHoje: number;
} 