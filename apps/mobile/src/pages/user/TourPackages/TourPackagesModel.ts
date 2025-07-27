export interface TourPackageData {
    id: string;
    title: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string;
    price: number;
    vacancies: number;
    type: string;
    car: {
        type: string;
        model: string;
        image?: string;
        driver?: {
            name: string;
            image?: string
        }
    };
}

export interface CarType {
    value: string;
    label: string;
}

export interface PendingReservation {
    pkg: TourPackageData;
    quantity: number;
} 