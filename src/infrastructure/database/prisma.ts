import {PrismaMariaDb} from "@prisma/adapter-mariadb";
import {PrismaClient} from "../../generated/prisma/client.js";
import {config} from "../../config/index.js";

const adapter = new PrismaMariaDb({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.name,
	connectionLimit: 5,
})

export const prisma = new PrismaClient({adapter})