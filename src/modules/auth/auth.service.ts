import * as UserService from "../user/user.service.ts";
import {compareHash} from "../../common/utils/hash.ts";
import {AppError} from "../../common/errors/app-error.ts";
import type {User} from "../user/user.types.ts";
import {client} from "../../infrastructure/cache/redis-client.ts";
import {generateOtp} from "../../common/utils/generate-otp.ts";

export const createUser = async (data: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string) => {
	try {
		const user = await UserService.create(data, password);
		const otp = generateOtp();
		
		await client.set(`email:otp:${user.email}`, otp, {
			EX: 60 * 5
		});
		console.log(otp)
		
	} catch (err) {
		throw err;
	}
	
}

export const login = async (email: string, password: string): Promise<User> => {
	try {
		const user = await UserService.findByEmail(email);
		if (!user.verifiedAt) throw new AppError("You are not authorized. Verify your email", 401)
		
		const valid = await compareHash(password, user.passwordHash);
		if (!valid) throw new AppError("Invalid password", 400);
		
		return user;
	} catch (err) {
		throw err;
	}
}

export const verifyOtp = async (email: string, otp: string) => {
	try {
		if (!email) throw new AppError("Email is required", 401)
		
		const user = await UserService.findByEmail(email)
		if (!user) throw new AppError("User with the email does not exist", 404)
		
		const savedOtp = await client.get(`email:otp:${user.email}`);
		if (!savedOtp) throw new AppError("OTP has expired. Request a new one", 400);
		
		if (otp !== savedOtp) throw new AppError("Invalid OTP", 400);
		await client.destroy()
		
	} catch (err) {
		throw err;
	}
}