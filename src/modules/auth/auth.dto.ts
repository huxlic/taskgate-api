import {z} from "zod";

export const registerSchema = z.object({
	firstName: z.string().min(1, {message: "First name is required"}),
	lastName: z.string().min(1, {message: "Last name is required"}),
	email: z.email({message: "Invalid email address"}).max(200),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
		.max(20, { message: 'Password cannot exceed 20 characters' })
		.regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
		.regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
		.regex(/[0-9]/, { message: 'Must contain at least one number' })
		.regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character' })
})