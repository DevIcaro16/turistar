import { ValidationError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface TourPackageServiceProps {
    origin_local: string;
    destiny_local: string;
    startDate?: Date;
    endDate?: Date;
    price: number;
    seatsAvailable: number;
    type: string;
    carId: string;
    touristPointId: string;
    driverId: string;
};

export class TourPackageService {

    static async register(data: TourPackageServiceProps) {

        const { origin_local, destiny_local, startDate, endDate, price, seatsAvailable, type, carId, touristPointId, driverId } = data;

        if (!origin_local || !destiny_local || !price || !seatsAvailable || !type || !carId || !touristPointId || !driverId) {
            throw new ValidationError("Todos os campos obrigatórios devem ser preenchidos!");
        }

        // Validar se o carro existe e pertence ao motorista
        const existingCar = await prisma.car.findFirst({
            where: {
                id: carId,
                driverId: driverId
            }
        });

        if (!existingCar) {
            throw new NotFoundError("Carro não encontrado ou não pertence a este motorista!");
        }

        // Validar se o ponto turístico existe
        const existingTouristPoint = await prisma.touristPoint.findUnique({
            where: { id: touristPointId }
        });

        if (!existingTouristPoint) {
            throw new NotFoundError("Ponto turístico não encontrado!");
        }

        // Validar preço
        if (price <= 0) {
            throw new ValidationError("Preço deve ser maior que zero!");
        }

        // Validar assentos disponíveis
        if (seatsAvailable <= 0 || seatsAvailable > existingCar.capacity) {
            throw new ValidationError("Número de assentos disponíveis inválido!");
        }

        const tourPackage = await prisma.tourPackage.create({
            data: {
                origin_local,
                destiny_local,
                startDate,
                endDate,
                price,
                seatsAvailable,
                type,
                carId,
                touristPointId
            },
            include: {
                car: {
                    include: {
                        driver: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                touristPoint: true
            }
        });

        return tourPackage;
    }
}