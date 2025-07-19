import { TransactionType } from "@prisma/client";
import { NotFoundError, ValidationError } from "../../../../../packages/error-handle";
import prisma from "../../../../../packages/libs/prisma";

interface TransactionServiceGetByTypeProps {
    type: TransactionType;
    userId?: string;
    driverId?: string;
}

interface TransactionServiceGetByUserProps {
    userId: string;
    type?: TransactionType;
}

interface TransactionServiceGetByDriverProps {
    driverId: string;
    type?: TransactionType;
}

interface TransactionServiceGetTotalsProps {
    userId?: string;
    driverId?: string;
}

export class TransactionService {

    static async getByType(data: TransactionServiceGetByTypeProps) {
        const { type, userId, driverId } = data;

        if (!Object.values(TransactionType).includes(type)) {
            throw new ValidationError("Tipo de transação inválido!");
        }

        const whereClause: any = {
            type: type
        };

        if (userId) {
            whereClause.userId = userId;
        }

        if (driverId) {
            whereClause.driverId = driverId;
        }

        const transactions = await prisma.transactions.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                Reservation: {
                    include: {
                        tourPackage: {
                            select: {
                                title: true,
                                origin_local: true,
                                destiny_local: true,
                                date_tour: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calcular totalizadores
        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalCount = transactions.length;

        return {
            transactions,
            totals: {
                amount: totalAmount,
                count: totalCount
            }
        };
    }

    static async getByUser(data: TransactionServiceGetByUserProps) {
        const { userId, type } = data;

        if (typeof userId !== 'string' || userId.length !== 24) {
            throw new ValidationError("ID do usuário inválido!");
        }

        const userExisting = await prisma.user.findFirst({
            where: { id: userId }
        });

        if (!userExisting) {
            throw new NotFoundError("Usuário não encontrado!");
        }

        const whereClause: any = {
            userId: userId
        };

        if (type) {
            if (!Object.values(TransactionType).includes(type)) {
                throw new ValidationError("Tipo de transação inválido!");
            }
            whereClause.type = type;
        }

        const transactions = await prisma.transactions.findMany({
            where: whereClause,
            include: {
                Reservation: {
                    include: {
                        tourPackage: {
                            select: {
                                title: true,
                                origin_local: true,
                                destiny_local: true,
                                date_tour: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calcular totalizadores por tipo
        const totals = {
            DEBIT: { amount: 0, count: 0 },
            CREDIT: { amount: 0, count: 0 },
            REVERSAL: { amount: 0, count: 0 },
            PENDANT: { amount: 0, count: 0 },
            total: { amount: 0, count: 0 }
        };

        transactions.forEach(transaction => {
            totals[transaction.type].amount += transaction.amount;
            totals[transaction.type].count += 1;
            totals.total.amount += transaction.amount;
            totals.total.count += 1;
        });

        return {
            transactions,
            totals
        };
    }

    static async getByDriver(data: TransactionServiceGetByDriverProps) {
        const { driverId, type } = data;

        if (typeof driverId !== 'string' || driverId.length !== 24) {
            throw new ValidationError("ID do motorista inválido!");
        }

        const driverExisting = await prisma.driver.findFirst({
            where: { id: driverId }
        });

        if (!driverExisting) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        const whereClause: any = {
            driverId: driverId
        };

        if (type) {
            if (!Object.values(TransactionType).includes(type)) {
                throw new ValidationError("Tipo de transação inválido!");
            }
            whereClause.type = type;
        }

        const transactions = await prisma.transactions.findMany({
            where: whereClause,
            include: {
                Reservation: {
                    include: {
                        tourPackage: {
                            select: {
                                title: true,
                                origin_local: true,
                                destiny_local: true,
                                date_tour: true
                            }
                        },
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calcular totalizadores por tipo
        const totals = {
            DEBIT: { amount: 0, count: 0 },
            CREDIT: { amount: 0, count: 0 },
            REVERSAL: { amount: 0, count: 0 },
            PENDANT: { amount: 0, count: 0 },
            total: { amount: 0, count: 0 }
        };

        transactions.forEach(transaction => {
            totals[transaction.type].amount += transaction.amount;
            totals[transaction.type].count += 1;
            totals.total.amount += transaction.amount;
            totals.total.count += 1;
        });

        return {
            transactions,
            totals
        };
    }

    static async getAllByDriver(data: TransactionServiceGetByDriverProps) {

        const { driverId } = data;

        if (typeof driverId !== 'string' || driverId.length !== 24) {
            throw new ValidationError("ID do motorista inválido!");
        }

        const driverExisting = await prisma.driver.findFirst({
            where: { id: driverId }
        });

        if (!driverExisting) {
            throw new NotFoundError("Motorista não encontrado!");
        }

        const transactions = await prisma.transactions.findMany({
            where: {
                driverId: driverId
            },
            include: {
                Reservation: {
                    include: {
                        tourPackage: {
                            select: {
                                title: true,
                                origin_local: true,
                                destiny_local: true,
                                date_tour: true
                            }
                        },
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });


        return transactions;
    }

    static async getTotals(data: TransactionServiceGetTotalsProps) {
        const { userId, driverId } = data;

        const whereClause: any = {};

        if (userId) {
            if (typeof userId !== 'string' || userId.length !== 24) {
                throw new ValidationError("ID do usuário inválido!");
            }
            whereClause.userId = userId;
        }

        if (driverId) {
            if (typeof driverId !== 'string' || driverId.length !== 24) {
                throw new ValidationError("ID do motorista inválido!");
            }
            whereClause.driverId = driverId;
        }

        const transactions = await prisma.transactions.findMany({
            where: whereClause,
            select: {
                type: true,
                amount: true
            }
        });

        // Calcular totalizadores por tipo
        const totals = {
            DEBIT: { amount: 0, count: 0 },
            CREDIT: { amount: 0, count: 0 },
            REVERSAL: { amount: 0, count: 0 },
            PENDANT: { amount: 0, count: 0 },
            total: { amount: 0, count: 0 }
        };

        transactions.forEach(transaction => {
            totals[transaction.type].amount += transaction.amount;
            totals[transaction.type].count += 1;
            if (transaction.type === "DEBIT") {

                totals.total.amount -= transaction.amount;
            }
            if (transaction.type === "CREDIT" || transaction.type === "REVERSAL") {

                totals.total.amount += transaction.amount;
            }


            totals.total.count += 1;
        });

        return totals;
    }

    static async getAllTransactions() {
        const transactions = await prisma.transactions.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                Reservation: {
                    include: {
                        tourPackage: {
                            select: {
                                title: true,
                                origin_local: true,
                                destiny_local: true,
                                date_tour: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calcular totalizadores
        const totals = {
            DEBIT: { amount: 0, count: 0 },
            CREDIT: { amount: 0, count: 0 },
            REVERSAL: { amount: 0, count: 0 },
            PENDANT: { amount: 0, count: 0 },
            total: { amount: 0, count: 0 }
        };

        transactions.forEach(transaction => {
            totals[transaction.type].amount += transaction.amount;
            totals[transaction.type].count += 1;
            totals.total.amount += transaction.amount;
            totals.total.count += 1;
        });

        return {
            transactions,
            totals
        };
    }
}
