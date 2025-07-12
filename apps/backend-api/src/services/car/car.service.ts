import { TransportType } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface CarRegistrationProps {
    type: string;
    model: string;
    capacity: number;
    driverId: string;
};

interface CarUpdateProps {
    type?: string;
    model?: string;
    capacity?: number;
}

export class CarService {

    static async register(data: CarRegistrationProps) {

        const { type, model, capacity, driverId } = data;

        if (!type || !model || !capacity || !driverId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        let typeUpper = type.toUpperCase() as TransportType;

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

        const car = await prisma.car.create({
            data: {
                type: typeUpper,
                model,
                capacity,
                driverId
            }
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

        // Preparar dados para atualização
        const updateData: any = {};

        // Validar e converter tipo de transporte se fornecido
        if (data.type) {
            let typeUpper = data.type.toUpperCase() as TransportType;
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
            if (data.capacity <= 0 || data.capacity > 50) {
                throw new ValidationError("Capacidade deve ser entre 1 e 50!");
            }
            updateData.capacity = data.capacity;
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