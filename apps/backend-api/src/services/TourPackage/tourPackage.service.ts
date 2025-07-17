import { ValidationError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface TourPackageServiceProps {
    origin_local: string;
    destiny_local: string;
    date_tour: Date;
    startDate?: string | Date;
    endDate?: string | Date;
    price: number;
    seatsAvailable: number;
    type: string;
    carId: string;
    touristPointId: string;
    driverId: string;
    image?: string;
};

interface TourPackageUpdateProps {
    origin_local?: string;
    destiny_local?: string;
    date_tour?: Date;
    price?: number;
    seatsAvailable?: number;
    type?: string;
    image?: string;
}

interface TourPackageSearchFilters {
    origin?: string;
    destiny?: string;
    transportType?: string;
}

export class TourPackageService {

    static async register(data: TourPackageServiceProps) {

        const { origin_local, destiny_local, date_tour, price, seatsAvailable, type, carId, touristPointId, driverId, image } = data;

        if (!origin_local || !destiny_local || !date_tour || !price || !seatsAvailable || !type || !carId || !touristPointId || !driverId) {
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

        if (price <= 0) {
            throw new ValidationError("Preço deve ser maior que zero!");
        }

        // Validar os assentos disponíveis
        if (seatsAvailable <= 0 || seatsAvailable > existingCar.capacity) {
            throw new ValidationError("Número de assentos disponíveis inválido!");
        }

        const tourPackageData: any = {
            origin_local,
            destiny_local,
            date_tour,
            price,
            seatsAvailable,
            vacancies: seatsAvailable,
            type,
            carId,
            touristPointId
        };

        if (image) tourPackageData.image = image;

        const tourPackage = await prisma.tourPackage.create({
            data: tourPackageData,
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

    static async updateTourPackage(tourPackageId: string, driverId: string, data: TourPackageUpdateProps) {
        // Verificar se o pacote turístico existe e pertence ao motorista
        const existingTourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: tourPackageId,
                car: {
                    driverId: driverId
                }
            },
            include: {
                car: true
            }
        });

        if (!existingTourPackage) {
            throw new NotFoundError("Pacote turístico não encontrado ou não pertence a este motorista!");
        }

        // Preparar dados para atualização
        const updateData: any = {};

        if (data.origin_local) updateData.origin_local = data.origin_local;
        if (data.destiny_local) updateData.destiny_local = data.destiny_local;
        if (data.date_tour) updateData.date_tour = data.date_tour;
        if (data.price) {
            if (data.price <= 0) {
                throw new ValidationError("Preço deve ser maior que zero!");
            }
            updateData.price = data.price;
        }
        if (data.seatsAvailable) {
            if (data.seatsAvailable <= 0 || data.seatsAvailable > existingTourPackage.car.capacity) {
                throw new ValidationError("Número de assentos disponíveis inválido!");
            }
            updateData.seatsAvailable = data.seatsAvailable;
        }
        if (data.type) updateData.type = data.type;
        if (data.image) updateData.image = data.image;

        const updatedTourPackage = await prisma.tourPackage.update({
            where: { id: tourPackageId },
            data: updateData,
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

        return updatedTourPackage;
    }

    static async deleteTourPackage(tourPackageId: string, driverId: string) {
        // Verificar se o pacote turístico existe e pertence ao motorista
        const existingTourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: tourPackageId,
                car: {
                    driverId: driverId
                }
            }
        });

        if (!existingTourPackage) {
            throw new NotFoundError("Pacote turístico não encontrado ou não pertence a este motorista!");
        }

        // Deletar o pacote turístico
        await prisma.tourPackage.delete({
            where: { id: tourPackageId }
        });

        return { message: "Pacote turístico deletado com sucesso!" };
    }

    static async getTourPackageById(tourPackageId: string) {
        const tourPackage = await prisma.tourPackage.findUnique({
            where: { id: tourPackageId },
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

        if (!tourPackage) {
            throw new NotFoundError("Pacote turístico não encontrado!");
        }

        return tourPackage;
    }

    static async getTourPackagesByDriver(driverId: string) {
        // Verificar se o motorista existe
        const driver = await prisma.driver.findUnique({
            where: { id: driverId }
        });

        if (!driver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        const tourPackages = await prisma.tourPackage.findMany({
            where: {
                car: {
                    driverId: driverId
                }
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

        return tourPackages;
    }

    static async getAllTourPackages() {
        const tourPackages = await prisma.tourPackage.findMany({
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

        return tourPackages;
    }

    static async searchTourPackages(filters: TourPackageSearchFilters) {

        const whereClause: any = {};

        // Filtrar por origem
        if (filters.origin) {
            whereClause.origin_local = {
                contains: filters.origin,
                mode: 'insensitive'
            };
        }

        // Filtrar por destino
        if (filters.destiny) {
            whereClause.destiny_local = {
                contains: filters.destiny,
                mode: 'insensitive'
            };
        }

        // Filtrar por tipo de transporte
        if (filters.transportType) {
            whereClause.car = {
                type: filters.transportType.toUpperCase()
            };
        }

        const tourPackages = await prisma.tourPackage.findMany({
            where: whereClause,
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

        return tourPackages;
    }
}