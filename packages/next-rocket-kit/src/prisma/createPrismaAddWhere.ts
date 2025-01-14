export const prismaAddGlobalWhere = <PrismaClient>(
	prisma: PrismaClient,
	where: object,
) => {
	for (const KeyModel in prisma) {
		if (!Object.prototype.hasOwnProperty.call(prisma, KeyModel)) continue;

		if (/[$_]*/i.test(KeyModel)) return;

		// @ts-ignore
		prisma[KeyModel as keyof PrismaClient].findFirst = (
			obj?: Record<"where", any>,
		) => {
			if (obj) {
				obj.where = { ...where, ...obj.where };

				// @ts-ignore
				return prisma[KeyModel as keyof PrismaClient].findFirst(obj);
			}

			// @ts-ignore
			return prisma[KeyModel as keyof PrismaClient].findFirst();
		};

		// @ts-ignore
		prisma[KeyModel as keyof PrismaClient].findFirstOrThrow = (
			obj?: Record<"where", any>,
		) => {
			if (obj) {
				obj.where = { ...where, ...obj.where };

				// @ts-ignore
				return prisma[KeyModel as keyof PrismaClient].findFirstOrThrow(obj);
			}

			// @ts-ignore
			return prisma[KeyModel as keyof PrismaClient].findFirstOrThrow();
		};

		// @ts-ignore
		prisma[KeyModel as keyof PrismaClient].findUnique = (
			obj?: Record<"where", any>,
		) => {
			if (obj) {
				obj.where = { ...where, ...obj.where };

				// @ts-ignore
				return prisma[KeyModel as keyof PrismaClient].findUnique(obj);
			}

			// @ts-ignore
			return prisma[KeyModel as keyof PrismaClient].findUnique();
		};

		// @ts-ignore
		prisma[KeyModel as keyof PrismaClient].findUniqueOrThrow = (
			obj?: Record<"where", any>,
		) => {
			if (obj) {
				obj.where = { ...where, ...obj.where };

				// @ts-ignore
				return prisma[KeyModel as keyof PrismaClient].findUniqueOrThrow(obj);
			}

			// @ts-ignore
			return prisma[KeyModel as keyof PrismaClient].findUniqueOrThrow();
		};

		// @ts-ignore
		prisma[KeyModel as keyof PrismaClient].findMany = (
			obj?: Record<"where", any>,
		) => {
			if (obj) {
				obj.where = { ...where, ...obj.where };

				// @ts-ignore
				return prisma[KeyModel as keyof PrismaClient].findMany(obj);
			}

			// @ts-ignore
			return prisma[KeyModel as keyof PrismaClient].findMany();
		};
	}

	return prisma;
};
