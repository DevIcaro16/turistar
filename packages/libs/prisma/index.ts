import { PrismaClient } from "@prisma/client";

declare global {
    var prismadb: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    if (global.prismadb) {
        prisma = global.prismadb;
    } else {
        prisma = new PrismaClient();
        global.prismadb = prisma;
    }
} else {
    prisma = new PrismaClient();
}

export default prisma;