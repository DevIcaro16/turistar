import { ValidationError, AuthError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";


export class MetricsAdminService {

    static async getAllUsers() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }

    static async getAllDrivers() {
        const allDrivers = await prisma.driver.findMany();
        return allDrivers;
    }

    static async getAllTourPackages() {
        const allTourPackages = await prisma.tourPackage.findMany();
        return allTourPackages;
    }

    static async getAllReserves() {
        const allReserves = await prisma.reservations.findMany();
        return allReserves;
    }

    static async getAllTouristPoints() {
        const allTouristPoints = await prisma.touristPoint.findMany();
        return allTouristPoints;
    }

    static async getPlatformRevenue() {
        const taxConfig = await prisma.configurations.findFirst({
            where: { key: 'tax' }
        });
        return taxConfig?.value || 0;
    }

    static async getAllMetrics() {
        const [users, drivers, tourPackages, reserves, touristPoints, platformRevenue] = await Promise.all([
            this.getAllUsers(),
            this.getAllDrivers(),
            this.getAllTourPackages(),
            this.getAllReserves(),
            this.getAllTouristPoints(),
            this.getPlatformRevenue()
        ]);

        return {
            users: {
                data: users,
                count: users.length
            },
            drivers: {
                data: drivers,
                count: drivers.length
            },
            tourPackages: {
                data: tourPackages,
                count: tourPackages.length
            },
            reserves: {
                data: reserves,
                count: reserves.length
            },
            touristPoints: {
                data: touristPoints,
                count: touristPoints.length
            },
            platformRevenue: {
                value: platformRevenue
            }
        };
    }
}
