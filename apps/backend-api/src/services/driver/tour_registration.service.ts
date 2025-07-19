import { TransactionType } from "@prisma/client";
import { NotFoundError, ValidationError } from "../../../../../packages/error-handle";
import prisma from "../../../../../packages/libs/prisma";

interface TourRegistrationServiceProps {
    tourPackageId: string,
    driverId: string,
};

export class TourRegistrationService {

    static async start(data: TourRegistrationServiceProps) {

        const { driverId, tourPackageId } = data;

        if (typeof driverId !== 'string' || driverId.length !== 24) {
            throw new ValidationError("ID do usuário inválido!");
        }

        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            throw new ValidationError("ID do pacote do passeio inválido!");
        }

        const driverExisting = await prisma.driver.findFirst({
            where: {
                id: driverId
            }
        });

        if (!driverExisting) throw new NotFoundError("Motorista não existente!");

        const tourPackageExisting = await prisma.tourPackage.findFirst({
            where: {
                id: tourPackageId
            }
        });


        if (!tourPackageExisting) throw new NotFoundError("Pacote de passeio não existente!");

        // if (tourPackageExisting.endDate !== null) {
        //     throw new NotFoundError("O passeio já foi finalizado!");
        // }

        //UPDATE NO PACKAGE
        await prisma.tourPackage.update({
            where: {
                id: tourPackageExisting.id
            },
            data: {
                startDate: new Date(),
                isRunning: true
            }
        });

        return true;

    }

    static async end(data: TourRegistrationServiceProps) {

        const tax = Number(process.env.TAX) ?? 0;

        const { driverId, tourPackageId } = data;

        if (typeof driverId !== 'string' || driverId.length !== 24) {
            throw new ValidationError("ID do Motorista inválido!");
        }

        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            throw new ValidationError("ID do pacote do passeio inválido!");
        }

        const driverExisting = await prisma.driver.findFirst({
            where: {
                id: driverId
            }
        });

        if (!driverExisting) throw new NotFoundError("Motorista não existente!");

        const tourPackageExisting = await prisma.tourPackage.findFirst({
            where: {
                id: tourPackageId
            }
        });


        if (!tourPackageExisting) throw new NotFoundError("Pacote de passeio não existente!");


        //UPDATE NO TOUR PACKAGE

        if (tourPackageExisting.startDate === null) {
            throw new ValidationError("O passeio ainda não foi iniciado!");
        }

        if (tourPackageExisting.isFinalised) {
            throw new ValidationError("O passeio já foi finalizado!");
        }

        await prisma.tourPackage.update({
            where: {
                id: tourPackageExisting.id
            },
            data: {
                endDate: new Date(),
                isRunning: false,
                isFinalised: true
            }
        });

        // 1. Buscar todos os IDs de reservas do pacote
        const reservations = await prisma.reservations.findMany({
            where: { tourPackageId },
            select: { id: true }
        });
        const reservationIds = reservations.map(r => r.id);

        // 2. Atualizar todas as transactions dessas reservas
        await prisma.transactions.updateMany({
            data: { type: TransactionType.CREDIT },
            where: {
                ReservationId: { in: reservationIds },
                type: TransactionType.PENDANT
            }
        });

        // 3. Somar o valor das transações CREDIT dessas reservas
        const creditTransactions = await prisma.transactions.findMany({
            where: {
                ReservationId: { in: reservationIds },
                type: TransactionType.CREDIT
            },
            select: { amount: true }
        });
        const totalCredit = creditTransactions.reduce((sum, t) => sum + t.amount, 0);

        const totalCreditDesc = totalCredit - (totalCredit * tax); //Desconto da taxa da plataforma.

        // 4. Atualizar a wallet do driver
        await prisma.driver.update({
            where: { id: driverId },
            data: {
                wallet: {
                    increment: totalCreditDesc
                }
            }
        });


        return true;

    }

};