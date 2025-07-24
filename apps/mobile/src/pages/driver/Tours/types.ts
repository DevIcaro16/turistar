export interface TourData {
    id: string;
    title: string;
    image?: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string | Date;
    startDate: Date;
    endDate: Date;
    price: number;
    seatsAvailable: number;
    vacancies: number;
    type: string;
    isRunning: boolean;
    isFinalised: boolean;
    carId: string;
    touristPointId: string;
    car?: {
        model: string;
        plate: string;
    };
    touristPoint?: {
        name: string;
    };
}

export interface TourStatus {
    color: string;
    text: string;
} 