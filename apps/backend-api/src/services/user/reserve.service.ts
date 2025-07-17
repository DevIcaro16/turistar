import { TransactionType } from "@prisma/client";
import { NotFoundError, ValidationError } from "../../../../../packages/error-handle";
import prisma from "../../../../../packages/libs/prisma";

interface ReserveServiceRegisterProps {
    userId: string,
    tourPackageId: string,
    vacancies_reserved: number,
    amount: number
};

interface ReserveServiceConfirmProps {
    userId: string,
    ReserveId: string,
};

interface ReserveServiceCancelProps {
    userId: string,
    ReserveId: string,
};

export class ReserveService {

    static async register(data: ReserveServiceRegisterProps) {

        const { userId, tourPackageId, vacancies_reserved, amount } = data;

        if (typeof userId !== 'string' || userId.length !== 24) {
            throw new ValidationError("ID do usuário inválido!");
        }

        if (typeof tourPackageId !== 'string' || tourPackageId.length !== 24) {
            throw new ValidationError("ID do pacote do passeio inválido!");
        }

        const userExisting = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (!userExisting) throw new NotFoundError("Usuário não existente!");

        const tourPackageExisting = await prisma.tourPackage.findFirst({
            where: {
                id: tourPackageId
            }
        });


        if (!tourPackageExisting) throw new NotFoundError("Pacote de passeio não existente!");

        if (tourPackageExisting.vacancies === 0) throw new NotFoundError("Sem vagas disponiveis!");

        if (vacancies_reserved > tourPackageExisting.vacancies) {
            throw new NotFoundError("Número de reservas superior ao número de vagas disponiveis!");
        }

        //SE TEM VALOR DISPONIVEL PARA RESERVA
        if (userExisting.wallet < amount) {
            throw new ValidationError("Carteira Virtual inferior ao valor total das reservas!");
        }

        //RESERVA
        const reservation = await prisma.reservations.create({
            data: {
                amount,
                vacancies_reserved,
                confirmed: false,
                userId,
                tourPackageId
            }
        });

        //UPDATE NAS VAGAS DO TOUR PACKAGE

        await prisma.tourPackage.update({
            where: {
                id: tourPackageExisting.id
            },
            data: {
                vacancies: {
                    decrement: reservation.vacancies_reserved
                }
            }
        });


        //CRIAÇÃO DA TRANSACAO

        await prisma.transactions.create({
            data: {
                amount,
                type: TransactionType.DEBIT,
                description: 'Reserva do pacote de passeio: ' + tourPackageExisting.title,
                userId,
                ReservationId: reservation.id
            }
        });

        return reservation;

    }

    static async confirm(data: ReserveServiceConfirmProps) {

        const { userId, ReserveId } = data;

        if (typeof userId !== 'string' || userId.length !== 24) {
            throw new ValidationError("ID do usuário inválido!");
        }

        if (typeof ReserveId !== 'string' || ReserveId.length !== 24) {
            throw new ValidationError("ID da Reserva inválido!");
        }

        const userExisting = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (!userExisting) throw new NotFoundError("Usuário não existente!");

        const reserveIdExisting = await prisma.reservations.findFirst({
            where: {
                id: ReserveId
            },
            include: {
                tourPackage: true
            }
        });

        if (!reserveIdExisting) throw new NotFoundError("Reserva não existente!");

        // Verificar se a reserva já foi confirmada
        if (reserveIdExisting.confirmed) {
            throw new ValidationError("Esta reserva já foi confirmada!");
        }

        // Verificar se a data da viagem já não passou
        const currentDate = new Date();
        if (reserveIdExisting.tourPackage.date_tour <= currentDate) {
            throw new ValidationError("Não é possível confirmar uma reserva para uma viagem que já passou!");
        }

        // Verificar se o usuário ainda tem saldo suficiente
        if (userExisting.wallet < reserveIdExisting.amount) {
            throw new ValidationError("Saldo insuficiente na carteira virtual para confirmar esta reserva!");
        }

        //UPDATES

        await prisma.reservations.update({
            data: {
                confirmed: true
            },
            where: {
                id: reserveIdExisting.id
            }
        });

        await prisma.user.update({
            data: {
                wallet: {
                    decrement: reserveIdExisting.amount
                }
            },
            where: {
                id: reserveIdExisting.userId
            }
        });

        const tourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: reserveIdExisting.tourPackageId
            }
        });

        //VALOR RETIDO, PENDENTE
        await prisma.transactions.create({
            data: {
                amount: reserveIdExisting.amount,
                type: TransactionType.PENDANT,
                description: `Reserva confirmada do usuário ${userExisting.name} no valor de R$ ${reserveIdExisting.amount}`,
                driverId: tourPackage?.driverId,
                ReservationId: reserveIdExisting.id
            }
        });

    }

    static async cancel(data: ReserveServiceCancelProps) {

        const { userId, ReserveId } = data;

        if (typeof userId !== 'string' || userId.length !== 24) {
            throw new ValidationError("ID do usuário inválido!");
        }

        if (typeof ReserveId !== 'string' || ReserveId.length !== 24) {
            throw new ValidationError("ID da Reserva inválido!");
        }

        const userExisting = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (!userExisting) throw new NotFoundError("Usuário não existente!");

        const reserveIdExisting = await prisma.reservations.findFirst({
            where: {
                id: ReserveId
            },
            include: {
                tourPackage: true
            }
        });

        if (!reserveIdExisting) throw new NotFoundError("Reserva não existente!");

        if (reserveIdExisting.canceled) {
            throw new ValidationError("Não é possível cancelar uma reserva já cancelada!");
        }

        // Verificar se a data da viagem já não passou
        const currentDate = new Date();
        if (reserveIdExisting.tourPackage.date_tour <= currentDate) {
            throw new ValidationError("Não é possível cancelar uma reserva para uma viagem que já passou!");
        }

        //UPDATES - Cancelar a reserva
        await prisma.reservations.update({
            data: {
                confirmed: false,
                canceled: true

            },
            where: {
                id: reserveIdExisting.id
            }
        });

        // Devolver vagas para o tour package
        await prisma.tourPackage.update({
            where: {
                id: reserveIdExisting.tourPackageId
            },
            data: {
                vacancies: {
                    increment: reserveIdExisting.vacancies_reserved
                }
            }
        });

        // Devolver dinheiro para a wallet do usuário
        await prisma.user.update({
            data: {
                wallet: {
                    increment: reserveIdExisting.amount
                }
            },
            where: {
                id: reserveIdExisting.userId
            }
        });

        const tourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: reserveIdExisting.tourPackageId
            }
        });

        // Criar transação de reversão
        await prisma.transactions.create({
            data: {
                amount: reserveIdExisting.amount,
                type: TransactionType.REVERSAL,
                description: `Cancelamento de reserva do usuário ${userExisting.name} no valor de R$ ${reserveIdExisting.amount}`,
                userId: reserveIdExisting.userId,
                ReservationId: reserveIdExisting.id
            }
        });

    }
};