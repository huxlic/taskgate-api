import type {User} from "./user.types.js";
import {prisma} from "../../infrastructure/database/prisma.js";
import {ConflictError} from "../../common/errors/conflict-error.js";
import {Prisma} from "../../generated/prisma/client.js";

export const create = async (data: Omit<User, "id" | "verifiedAt" | "createdAt" | "updatedAt">): Promise<User> => {
	try {
		return await prisma.user.create({data})
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
			throw new ConflictError("Email already exists");
		}
		throw err;
	}
}

export const getByEmail = async (email: string): Promise<User | null> => {
	return await prisma.user.findUnique({where: {email}});
}