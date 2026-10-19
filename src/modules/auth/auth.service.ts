import * as UserService from "../user/user.service.js";
import {compareHash} from "../../common/utils/hash.js";
import {AppError} from "../../common/errors/app-error.js";
import type {User} from "../user/user.types.js";
import {generateOtp} from "../../common/utils/generate-otp.js";
import * as EmailService from "../../infrastructure/email/email.service.js"
import jwt from "jsonwebtoken";
import {config} from "../../config/index.js";
import {genEmailOtpKey} from "../../common/utils/redis-helpers.js";
import {redis} from "../../infrastructure/cache/redis-client.ts";
import {hashCode} from "../../common/utils/hash-code.ts";

export const createUser = async (data: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string) => {
	const user = await UserService.create(data, password);
	const code = generateOtp();
	const key = genEmailOtpKey(user.email)
	
	await redis
		.multi()
		.hSet(key, {hash: code, attempts: 0})
		.expire(key, 600)
		.exec();
	
	
	await EmailService.sendVerificationEmail({to: user.email, name: user.firstName, otp: code, expiresInMinutes: 5})
	
}

export const login = async (email: string, password: string): Promise<{ token: string, user: User }> => {
	const user = await UserService.findByEmail(email);
	if (!user.verifiedAt) throw new AppError("You are not authorized. Verify your email", 401)
	
	const valid = await compareHash(password, user.passwordHash);
	if (!valid) throw new AppError("Invalid password", 400);
	
	const token = jwt.sign({id: user.id}, config.jwt.secret, {expiresIn: "1h",})
	
	return {token, user};
}

export const verifyEmail = async (email: string, otp: string) => {
	if (!email) throw new AppError("Email is required", 400)
	
	const user = await UserService.findByEmail(email)
	if (user.verifiedAt) throw new AppError("Already verified", 409)
	
	const savedOtp = await redis.hGet(genEmailOtpKey(email), "hash")
	
	if (!savedOtp) throw new AppError("OTP has expired. Request a new one", 400);
	
	if (hashCode(otp) !== savedOtp) throw new AppError("Invalid OTP", 400);
	await UserService.verify(email);
	const key = genEmailOtpKey(email)
	await redis.del(key);
}

export const requestOtp = async (email: string) => {
	const user = await UserService.findByEmail(email);
	
	const code = generateOtp();
	const key = genEmailOtpKey(email)
	
	await redis
		.multi()
		.hSet(key, {hash: hashCode(code), attempts: 0})
		.expire(key, 600)
		.exec();
	
	await EmailService.sendVerificationEmail({to: user.email, name: user.firstName, otp: code, expiresInMinutes: 5});
}