import {PrismaMariaDb} from "@prisma/adapter-mariadb";
import {PrismaClient} from "../../generated/prisma/client.ts";
import {config} from "../../config/index.ts";

const adapter = new PrismaMariaDb({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.name,
	connectionLimit: 5,
})

export const prisma = new PrismaClient({adapter})