import app from "./app.js";
import {config} from "./config/index.js";
import {prisma} from "./infrastructure/database/prisma.js";
import {connectRedis} from "./infrastructure/cache/redis-client.js";

const PORT = config.port;

const startServer = async () => {
	try {
		await prisma.$connect();
		await prisma.$queryRaw`SELECT 1`;
		await connectRedis();
		
		app.listen(PORT, () => {
			console.log(`App listening on port ${PORT}`)
		})
	} catch (err) {
		console.error("Failed to start the server", err);
		await prisma.$disconnect();
		process.exit(1)
	}
}

await startServer();