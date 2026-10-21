import * as UserService from "../user/user.service.js";
import {compareHash} from "../../common/utils/hash.js";
import {AppError} from "../../common/errors/app-error.js";
import type {User} from "../user/user.types.js";
import {generateOtp} from "../../common/utils/generate-otp.js";
import * as EmailService from "../../infrastructure/email/email.service.js"
import jwt from "jsonwebtoken";
import {config} from "../../config/index.js";
import {cooldownKey, emailOtpKey} from "../../common/utils/redis-helpers.js";
import {redis} from "../../infrastructure/cache/redis-client.ts";
import {hashCode} from "../../common/utils/hash-code.ts";

const MAX_ATTEMPTS = 5;
const OTP_TTL_SECONDS = 600;

export const issueOtp = async (user: Pick<User, "email" | "firstName">) => {
	const code = generateOtp();
	const key = emailOtpKey(user.email)
	
	await redis
		.multi()
		.hSet(key, {hash: hashCode(code), attempts: 0})
		.expire(key, OTP_TTL_SECONDS)
		.exec();
	
	EmailService.sendVerificationEmail({
		to: user.email,
		name: user.firstName,
		otp: code,
		expiresInMinutes: OTP_TTL_SECONDS / 60
	}).catch(async (err) => {
		console.error("Failed to send OTP email:", err);
		await redis.del(cooldownKey("otp", user.email));
	});
}

export const createUser = async (data: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string) => {
	const user = await UserService.create(data, password);
	await issueOtp(user);
}

export const login = async (email: string, password: string): Promise<{ token: string, user: User }> => {
	const user = await UserService.findByEmail(email);
	if (!user.verifiedAt) throw new AppError("You are not authorized. Verify your email", 401)
	
	const valid = await compareHash(password, user.passwordHash);
	if (!valid) throw new AppError("Invalid password", 400);
	
	const token = jwt.sign({id: user.id}, config.jwt.secret, {expiresIn: "1h",})
	
	return {token, user};
}

export const verifyEmail = async (email: string, code: string) => {
	const key = emailOtpKey(email)
	const savedHash = await redis.hGet(key, "hash")
	if (!savedHash) {
		await redis.del(key);
		throw new AppError("OTP has expired. Request a new one", 400);
	}
	
	const attempts = await redis.hIncrBy(key, "attempts", 1);
	
	if (attempts > MAX_ATTEMPTS) {
		await redis.del(key);
		throw new AppError("Too many attempts. Request a new code", 429);
	}
	
	if (hashCode(code) !== savedHash) {
		if (attempts === MAX_ATTEMPTS) await redis.del(key);
		throw new AppError("Invalid OTP", 400);
	}
	
	await UserService.verify(email);
	await redis.del(key);
}

export const requestOtp = async (email: string) => {
	const user = await UserService.findByEmailOrNull(email);
	
	if (!user || user.verifiedAt) return;
	await issueOtp(user);
}