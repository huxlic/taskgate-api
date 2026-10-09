import app from "./app.js";
import {config} from "./config/index.js";
import {prisma} from "./infrastructure/database/prisma.js";
import {client} from "./infrastructure/cache/redis-client.ts";

const PORT = config.port;

const startServer = async () => {
	try {
		await prisma.$connect();
		await prisma.$queryRaw`SELECT 1`;
		await client.connect();
		
		app.listen(PORT, () => {
			console.log(`App listening on port ${PORT}`)
		})
	} catch (err) {
		console.error("Failed to start the server", err);
		await prisma.$disconnect();
		process.exit(1)
	}
}

startServer();