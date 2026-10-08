import type {User} from "./user.types.ts";
import {prisma} from "../../infrastructure/database/prisma.ts";

export const create = async (input: Omit<User, "verifiedAt" | "createdAt" | "updatedAt">) => {
	try {
		return await prisma.user.create({
			data: {...input}
		})
	} catch (err) {
		throw err;
	}
}