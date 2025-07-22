import { TransportType } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface CarRegistrationProps {
    image?: any;
    type: string;
    model: string;
    capacity: string;
    driverId: string;
};

interface CarUpdateProps {
    image?: string;
    type?: string;
    model?: string;
    capacity?: string;
}

export class CarService {

    static async register(data: CarRegistrationProps) {

        const { image, type, model, capacity, driverId } = data;

        if (!type || !model || !capacity || !driverId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        const capacityInt = parseInt(capacity);

        const typeUpper = type.toUpperCase() as TransportType;

        if (!Object.values(TransportType).includes(typeUpper)) {
            throw new ValidationError("Tipo de transporte inválido!");
        }

        const driverExisting = await prisma.driver.findFirst({
            where: {
                id: driverId
            }
        });

        if (!driverExisting) {
            throw new NotFoundError("Motorista não consta na base de dados!");
        }

        const dataCreateCar: any = {
            type: typeUpper,
            model,
            capacity: capacityInt,
            driverId
        };

        if (image !== null) {
            dataCreateCar.image = image;
        }

        const car = await prisma.car.create({
            data: dataCreateCar
        });

        return car;
    }

    static async updateCar(carId: string, driverId: string, data: CarUpdateProps) {
        // Verificar se o carro existe e pertence ao motorista
        const existingCar = await prisma.car.findFirst({
            where: {
                id: carId,
                driverId: driverId
            }
        });

        if (!existingCar) {
            throw new NotFoundError("Carro não encontrado ou não pertence a este motorista!");
        }

        const updateData: any = {};


        if (data.type) {
            const typeUpper = data.type.toUpperCase() as TransportType;
            if (!Object.values(TransportType).includes(typeUpper)) {
                throw new ValidationError("Tipo de transporte inválido!");
            }
            updateData.type = typeUpper;
        }

        // Adicionar outros campos se fornecidos
        if (data.model) {
            updateData.model = data.model;
        }

        if (data.capacity) {
            const capacityInt = parseInt(data.capacity);
            if (capacityInt <= 0 || capacityInt > 50) {
                throw new ValidationError("Capacidade deve ser entre 1 e 50!");
            }
            updateData.capacity = capacityInt;
        }

        const updatedCar = await prisma.car.update({
            where: { id: carId },
            data: updateData,
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return updatedCar;
    }

    static async deleteCar(carId: string, driverId: string) {
        // Verificar se o carro existe e pertence ao motorista
        const existingCar = await prisma.car.findFirst({
            where: {
                id: carId,
                driverId: driverId
            }
        });

        if (!existingCar) {
            throw new NotFoundError("Carro não encontrado ou não pertence a este motorista!");
        }

        // Deletar o carro
        await prisma.car.delete({
            where: { id: carId }
        });

        return { message: "Carro deletado com sucesso!" };
    }

    static async getCarById(carId: string, driverId: string) {
        const car = await prisma.car.findFirst({
            where: {
                id: carId,
                driverId: driverId
            },
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!car) {
            throw new NotFoundError("Carro não encontrado ou não pertence a este motorista!");
        }

        return car;
    }

    static async getCarsByDriver(driverId: string) {
        // Verificar se o motorista existe
        const driver = await prisma.driver.findUnique({
            where: { id: driverId }
        });

        if (!driver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        const cars = await prisma.car.findMany({
            where: { driverId: driverId },
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return cars;
    }

    static async getAllCars() {
        const cars = await prisma.car.findMany({
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return cars;
    }
}