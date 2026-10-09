import type {User} from "./user.types.js";
import {hashString} from "../../common/utils/hash.ts";
import * as UserRepository from "./user.repository.js";
import {ConflictError} from "../../common/errors/conflict-error.ts";
import {AppError} from "../../common/errors/app-error.ts";

export const create = async (input: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string) => {
	const passwordHash = await hashString(password);
	
	try {
		return await UserRepository.create({...input, passwordHash});
	} catch (err) {
		if (err instanceof ConflictError) {
			throw new AppError("Email already exist. Log in instead.", 409);
		}
		throw err;
	}
}

export const findByEmail = async (email: string): Promise<User> => {
	const user = await UserRepository.getByEmail(email);
	if (!user) throw new AppError("User not found", 404);
	return user;
}