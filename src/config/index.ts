import {env} from "./config.js";

export const config = {
	port: env.PORT,
	db: {
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		name: env.DATABASE_NAME,
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT
	}
}