import {z} from "zod";

export const registerSchema = z.object({
	firstName: z.string().min(1, {message: "First name is required"}).trim(),
	lastName: z.string().min(1, {message: "Last name is required"}).trim(),
	email: z.email({message: "Invalid email address"}).trim().toLowerCase().max(200),
	password: z.string().min(8, {message: 'Password must be at least 8 characters long'})
		.max(20, {message: 'Password cannot exceed 20 characters'})
		.regex(/[A-Z]/, {message: 'Must contain at least one uppercase letter'})
		.regex(/[a-z]/, {message: 'Must contain at least one lowercase letter'})
		.regex(/\d/, {message: 'Must contain at least one number'})
		.regex(/[^A-Za-z0-9]/, {message: 'Must contain at least one special character'})
})

export const loginSchema = z.object({
	email: z.email({message: "Invalid email address"}).trim().toLowerCase().max(200),
	password: z.string().min(8, {message: "Password cannot be less than 8 characters"}).max(20, {message: "Password cannot be more than 20 characters"})
})

export const requestOtpSchema = z.object({
	email: z.email({message: "Invalid email address"}).trim().toLowerCase().max(200),
})

export const verifyEmailSchema = z.object({
	email: z.email({message: "Invalid email address"}).trim().toLowerCase().max(200),
	code: z.string().min(1, {message: "Invalid OTP"}).max(6, {message: "Invalid OTP"})
})