import "dotenv/config"
import {z} from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
	DATABASE_USER: z.string().min(1),
	DATABASE_PASSWORD: z.string().min(1),
	DATABASE_NAME: z.string().min(1),
	DATABASE_HOST: z.string().min(1),
	DATABASE_PORT: z.coerce.number().default(3306),
	SMTP_HOST: z.string().min(2),
	SMTP_USER: z.email(),
	SMTP_PASS: z.string().min(10),
	SMTP_FROM: z.string().min(4)
})

export const env = envSchema.parse(process.env);