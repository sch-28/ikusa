import PrismaClientPkg from '@prisma/client';

// Prisma doesn't support ES Modules so we have to do this
const PrismaClient = PrismaClientPkg.PrismaClient;
export const prisma = new PrismaClient();