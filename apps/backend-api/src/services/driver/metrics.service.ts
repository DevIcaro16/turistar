import { ValidationError, AuthError, NotFoundError } from '../../../../../packages/error-handle';
import prisma from "../../../../../packages/libs/prisma";

export class MetricsDriverService {

    static async getDriverTourPackages(driverId: string) {
        const tourPackages = await prisma.tourPackage.findMany({
            where: {
                driverId: driverId
            }
        });
        return tourPackages;
    }

    static async getDriverReserves(driverId: string) {
        const reserves = await prisma.reservations.findMany({
            where: {
                tourPackage: {
                    driverId: driverId
                }
            },
            include: {
                tourPackage: true
            }
        });
        return reserves;
    }

    static async getDriverTouristPoints(driverId: string) {
        const touristPoints = await prisma.touristPoint.findMany({
            where: {
                tourPackages: {
                    some: {
                        driverId: driverId
                    }
                }
            }
        });
        return touristPoints;
    }

    static async getDriverWallet(driverId: string) {
        const driver = await prisma.driver.findFirst({
            where: {
                id: driverId
            },
            select: {
                wallet: true
            }
        });

        if (!driver) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        return driver.wallet;
    }

    static async getDriverTransactions(driverId: string) {
        const transactions = await prisma.transactions.findMany({
            where: {
                Reservation: {
                    tourPackage: {
                        driverId: driverId
                    }
                }
            },
            include: {
                user: true
            }
        });
        return transactions;
    }

    static async getDriverMetrics(driverId: string) {
        const [tourPackages, reserves, touristPoints, wallet, transactions] = await Promise.all([
            this.getDriverTourPackages(driverId),
            this.getDriverReserves(driverId),
            this.getDriverTouristPoints(driverId),
            this.getDriverWallet(driverId),
            this.getDriverTransactions(driverId)
        ]);

        const completedTours = tourPackages.filter(tp => tp.isFinalised);
        const activeTours = tourPackages.filter(tp => tp.isRunning && !tp.isFinalised);
        const totalEarnings = transactions
            .filter(t => t.type === 'CREDIT')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            tourPackages: {
                data: tourPackages,
                count: tourPackages,
                completed: completedTours,
                active: activeTours
            },
            reserves: {
                data: reserves,
                count: reserves.length
            },
            touristPoints: {
                data: touristPoints,
                count: touristPoints.length
            },
            wallet: {
                balance: wallet,
                totalEarnings: totalEarnings
            },
            transactions: {
                data: transactions,
                count: transactions.length
            }
        };
    }
} 