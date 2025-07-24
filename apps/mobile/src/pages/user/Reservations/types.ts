export interface ReservationData {
    id: string;
    amount: number;
    vacancies_reserved: number;
    confirmed: boolean;
    canceled: boolean;
    createdAt: string;
    tourPackage: {
        id: string;
        title: string;
        origin_local: string;
        destiny_local: string;
        date_tour: string;
        price: number;
        car: {
            type: string;
            model: string;
            image?: string;
            driver?: { name: string; image?: string };
        };
    };
}

export type ConfirmAction = 'confirm' | 'cancel'; 