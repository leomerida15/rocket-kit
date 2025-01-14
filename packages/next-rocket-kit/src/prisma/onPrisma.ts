import { onPrismaParamsOptios, Global } from "./types";
import { prismaAddGlobalWhere } from "./createPrismaAddWhere";

export const onPrisma = <PrismaClient>(
	PrismaClientNative: new () => PrismaClient,
	options?: onPrismaParamsOptios,
) => {
	if (options?.whereGlobal) {
		const prisma = prismaAddGlobalWhere(
			new PrismaClientNative(),
			options?.whereGlobal,
		);

		if (prisma) {
			(global as unknown as Global<PrismaClient>).prisma = prisma;

			return { prisma: (global as unknown as Global<PrismaClient>).prisma };
		}
	}

	(global as unknown as Global<PrismaClient>).prisma = new PrismaClientNative();

	return { prisma: (global as unknown as Global<PrismaClient>).prisma };
};
