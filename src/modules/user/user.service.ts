import type {User} from "./user.types.js";
import {hashString} from "../../common/utils/hash.js";
import * as UserRepository from "./user.repository.js";
import {ConflictError} from "../../common/errors/conflict-error.js";
import {AppError} from "../../common/errors/app-error.js";

export const create = async (input: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string): Promise<User> => {
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
	if (!user) throw new AppError("Invalid credentials", 404);
	return user;
}

export const findByEmailOrNull = async (email: string): Promise<User | null> => {
	return await UserRepository.getByEmail(email);
}

export const verify = async (email: string): Promise<User> => {
	return await UserRepository.verify(email);
	
}

export const findUnique = async (id: string | undefined): Promise<User> => {
	if (!id) throw new AppError("Invalid ID", 404);
	
	const user = await UserRepository.getUnique(id);
	if (!user) throw new AppError("User not found", 404);
	return user
}