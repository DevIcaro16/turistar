import { ValidationError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface TourPackageServiceProps {
    title: string;
    origin_local: string;
    destiny_local: string;
    date_tour: Date;
    startDate?: string | Date;
    endDate?: string | Date;
    price: string;
    seatsAvailable: string;
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
    price?: string;
    seatsAvailable?: string;
    vacancies?: string;
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

        const { title, origin_local, destiny_local, date_tour, price, seatsAvailable, type, carId, touristPointId, driverId, image } = data;

        if (!title || !origin_local || !destiny_local || !date_tour || !price || !seatsAvailable || !type || !carId || !touristPointId || !driverId) {
            throw new ValidationError("Todos os campos obrigatórios devem ser preenchidos!");
        }


        const existingCar = await prisma.car.findFirst({
            where: {
                id: carId,
                driverId: driverId
            }
        });

        if (!existingCar) {
            throw new NotFoundError("Carro não encontrado ou não pertence a este motorista!");
        }


        const existingTouristPoint = await prisma.touristPoint.findUnique({
            where: { id: touristPointId }
        });

        if (!existingTouristPoint) {
            throw new NotFoundError("Ponto turístico não encontrado!");
        }

        if (parseFloat(price) <= 0) {
            throw new ValidationError("Preço deve ser maior que zero!");
        }



        if (parseFloat(seatsAvailable) <= 0 || parseFloat(seatsAvailable) > existingCar.capacity) {
            throw new ValidationError("Número de assentos disponíveis inválido!");
        }

        const tourPackageData: any = {
            title,
            origin_local,
            destiny_local,
            date_tour,
            price: parseFloat(price),
            seatsAvailable: parseFloat(seatsAvailable),
            vacancies: parseFloat(seatsAvailable),
            type,
            carId,
            touristPointId,
            driverId,
        };

        if (image) tourPackageData.image = image;

        const tourPackage = await prisma.tourPackage.create({
            data: tourPackageData,
            include: {
                car: {
                    include: {
                        driver: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                },
                touristPoint: true
            }
        });

        return tourPackage;
    }

    static async updateTourPackage(tourPackageId: string, driverId: string, data: TourPackageUpdateProps) {

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


        const updateData: any = {};

        if (data.origin_local) updateData.origin_local = data.origin_local;
        if (data.destiny_local) updateData.destiny_local = data.destiny_local;
        if (data.date_tour) updateData.date_tour = data.date_tour;

        if (data.price !== undefined) {
            const priceFloat = parseFloat(data.price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    throw new ValidationError("Preço deve ser maior que zero!");
                }
                updateData.price = priceFloat;
            }
        }

        if (data.seatsAvailable !== undefined) {

            const seatsAvailableFormat = parseFloat(data.seatsAvailable)
            if (seatsAvailableFormat) {
                if (seatsAvailableFormat <= 0 || seatsAvailableFormat > existingTourPackage.car.capacity) {
                    throw new ValidationError("Número de assentos disponíveis inválido!");
                }
                updateData.seatsAvailable = seatsAvailableFormat;
                updateData.vacancies = seatsAvailableFormat;
            }
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
                                email: true,
                                image: true
                            }
                        }
                    }
                },
                touristPoint: true
            }
        });

        return tourPackages;
    }

    static async getTourPackagesByDriverAndDate(driverId: string, date: Date) {


        const tourPackages = await prisma.tourPackage.findMany({
            where: {
                driverId: driverId,
                date_tour: date
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

    static async searchTourPackages(filters: TourPackageSearchFilters) {

        const whereClause: any = {};


        if (filters.origin) {
            whereClause.origin_local = {
                contains: filters.origin,
                mode: 'insensitive'
            };
        }


        if (filters.destiny) {
            whereClause.destiny_local = {
                contains: filters.destiny,
                mode: 'insensitive'
            };
        }


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