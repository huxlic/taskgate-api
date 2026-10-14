import * as UserService from "../user/user.service.js";
import {compareHash} from "../../common/utils/hash.js";
import {AppError} from "../../common/errors/app-error.js";
import type {User} from "../user/user.types.js";
import {generateOtp} from "../../common/utils/generate-otp.js";
import * as EmailService from "../../infrastructure/email/email.service.js"
import jwt from "jsonwebtoken";
import {config} from "../../config/index.js";
import {deleteEmailOtp, getEmailOtp, saveEmailOtp} from "../../common/utils/redis-helpers.js";

export const createUser = async (data: Omit<User, "id" | "passwordHash" | "verifiedAt" | "createdAt" | "updatedAt">, password: string) => {
	const user = await UserService.create(data, password);
	const otp = generateOtp();
	console.log(otp)
	
	await saveEmailOtp(user.email, otp)
	
	await EmailService.sendVerificationEmail({to: user.email, name: user.firstName, otp, expiresInMinutes: 5})
	
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
	
	const savedOtp = await getEmailOtp(email)
	
	if (!savedOtp) throw new AppError("OTP has expired. Request a new one", 400);
	
	if (otp !== savedOtp) throw new AppError("Invalid OTP", 400);
	await UserService.verify(email);
	await deleteEmailOtp(email)
}

export const requestOtp = async (email: string | undefined) => {
	if (!email) throw new AppError("Email is required", 401)
	
	const user = await UserService.findByEmail(email);
	const otp = generateOtp();
	console.log(otp)
	
	await saveEmailOtp(user.email, otp)
	
	await EmailService.sendVerificationEmail({to: user.email, name: user.firstName, otp, expiresInMinutes: 5});
	
}