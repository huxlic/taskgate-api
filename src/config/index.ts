import {env} from "./config.js";

export const config = {
	port: env.PORT,
	db: {
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		name: env.DATABASE_NAME,
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT
	},
	smtp: {
		host: env.SMTP_HOST,
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
		from: env.SMTP_FROM,
	},
	jwt: {
		secret: env.JWT_SECRET_KEY,
	}
}