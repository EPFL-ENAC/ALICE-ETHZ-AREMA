import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

// 1. Define a User type that includes the "cars" relation.
const userWithRoleAndStatus = Prisma.validator<Prisma.userArgs>()({
  include: { status: true, role: true },
});

// 2: This type will include many users and all their cars
export type UserWithRoleAndStatus = Prisma.userGetPayload<
  typeof userWithRoleAndStatus
>[];
