import { ValidationError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

interface TouristPointServiceProps {
    name: string;
    city: string;
    uf: string;
    driverId: string;
    latitude?: string;
    longitude?: string;
};

interface TouristPointUpdateProps {
    name?: string;
    city?: string;
    uf?: string;
    latitude?: string;
    longitude?: string;
}

export class TouristPointService {

    static async register(data: TouristPointServiceProps) {

        const { name, city, uf, driverId, latitude, longitude } = data;

        if (!name || !city || !uf || !driverId) {
            throw new ValidationError("Todos os campos devem ser preenchidos!");
        }

        // Validando o objid do mongo
        if (typeof driverId !== 'string' || driverId.length !== 24) {
            throw new ValidationError("ID do motorista inválido!");
        }

        if (latitude !== undefined) {
            const lat = parseFloat(latitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                throw new ValidationError("Latitude inválida. Deve estar entre -90 e 90.");
            }
        }

        if (longitude !== undefined) {
            const lng = parseFloat(longitude);
            if (isNaN(lng) || lng < -180 || lng > 180) {
                throw new ValidationError("Longitude inválida. Deve estar entre -180 e 180.");
            }
        }

        const touristPoint = await prisma.touristPoint.create({
            data: {
                name,
                city,
                uf,
                latitude,
                longitude,
                driverId
            }
        });

        return touristPoint;
    }

    static async updateTouristPoint(touristPointId: string, driverId: string, data: TouristPointUpdateProps) {
        // Verificar se o ponto turístico existe e pertence ao motorista
        const existingTouristPoint = await prisma.touristPoint.findFirst({
            where: {
                id: touristPointId,
                driverId: driverId
            }
        });

        if (!existingTouristPoint) {
            throw new NotFoundError("Ponto turístico não encontrado ou não pertence a este motorista!");
        }

        // Preparar dados para atualização
        const updateData: any = {};

        // Adicionar campos se fornecidos
        if (data.name) updateData.name = data.name;
        if (data.city) updateData.city = data.city;
        if (data.uf) updateData.uf = data.uf;

        // Validar e adicionar latitude se fornecida
        if (data.latitude !== undefined) {
            const lat = parseFloat(data.latitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                throw new ValidationError("Latitude inválida. Deve estar entre -90 e 90.");
            }
            updateData.latitude = data.latitude;
        }

        // Validar e adicionar longitude se fornecida
        if (data.longitude !== undefined) {
            const lng = parseFloat(data.longitude);
            if (isNaN(lng) || lng < -180 || lng > 180) {
                throw new ValidationError("Longitude inválida. Deve estar entre -180 e 180.");
            }
            updateData.longitude = data.longitude;
        }

        const updatedTouristPoint = await prisma.touristPoint.update({
            where: { id: touristPointId },
            data: updateData,
            include: {
                Driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return updatedTouristPoint;
    }

    static async deleteTouristPoint(touristPointId: string, driverId: string) {
        // Verificar se o ponto turístico existe e pertence ao motorista
        const existingTouristPoint = await prisma.touristPoint.findFirst({
            where: {
                id: touristPointId,
                driverId: driverId
            }
        });

        if (!existingTouristPoint) {
            throw new NotFoundError("Ponto turístico não encontrado ou não pertence a este motorista!");
        }

        // Verificar se há pacotes turísticos associados
        const associatedPackages = await prisma.tourPackage.findMany({
            where: { touristPointId: touristPointId }
        });

        if (associatedPackages.length > 0) {
            throw new ValidationError("Não é possível deletar o ponto turístico pois existem pacotes turísticos associados!");
        }

        // Deletar o ponto turístico
        await prisma.touristPoint.delete({
            where: { id: touristPointId }
        });

        return { message: "Ponto turístico deletado com sucesso!" };
    }

    static async getTouristPointById(touristPointId: string, driverId: string) {
        const touristPoint = await prisma.touristPoint.findFirst({
            where: {
                id: touristPointId,
                driverId: driverId
            },
            include: {
                Driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!touristPoint) {
            throw new NotFoundError("Ponto turístico não encontrado ou não pertence a este motorista!");
        }

        return touristPoint;
    }

    static async getTouristPointsByDriver(driverId: string) {
        // Verificar se o motorista existe
        const driver = await prisma.driver.findUnique({
            where: { id: driverId }
        });

        if (!driver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        const touristPoints = await prisma.touristPoint.findMany({
            where: { driverId: driverId },
            include: {
                Driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return touristPoints;
    }

    static async getAllTouristPoints() {
        const touristPoints = await prisma.touristPoint.findMany({
            include: {
                Driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return touristPoints;
    }
}