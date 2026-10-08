import "dotenv/config"
import {z} from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
	DATABASE_USER: z.string().min(1),
	DATABASE_PASSWORD: z.string().min(1),
	DATABASE_NAME: z.string().min(1),
	DATABASE_HOST: z.string().min(1),
	DATABASE_PORT: z.coerce.number().default(3306)
})

export const env = envSchema.parse(process.env);