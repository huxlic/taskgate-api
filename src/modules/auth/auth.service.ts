import * as UserService from "../user/user.service.ts";
import {compareHash} from "../../common/utils/hash.ts";
import {AppError} from "../../common/errors/app-error.ts";
import type {User} from "../user/user.types.ts";

export const login = async (email: string, password: string): Promise<User> => {
	try {
		const user = await UserService.findByEmail(email);
		
		const valid = await compareHash(password, user.passwordHash);
		if (!valid) throw new AppError("Invalid password", 400);
		
		return user;
	} catch (err) {
		throw err;
	}
}