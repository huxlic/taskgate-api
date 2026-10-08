import type {User} from "./user.types.ts";
import {prisma} from "../../infrastructure/database/prisma.ts";
import {ConflictError} from "../../common/errors/conflict-error.ts";
import {Prisma} from "../../generated/prisma/client.ts";

export const create = async (data: Omit<User, "id" | "verifiedAt" | "createdAt" | "updatedAt">) => {
	try {
		return await prisma.user.create({data})
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
			throw new ConflictError("Email already exists");
		}
		throw err;
	}
}