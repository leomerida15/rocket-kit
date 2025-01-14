export interface PrismaClientCustom {
	new (...art: any): any;
}

export interface Global<PrismaClient> {
	prisma: PrismaClient;
}

export interface onPrismaParamsOptios {
	whereGlobal: object;
}

export interface onPrismaReturn<PrismaClient> {
	prisma: PrismaClient;
}
