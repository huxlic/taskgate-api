import app from "./app.ts";
import {config} from "./config/index.ts";
import {prisma} from "./infrastructure/database/prisma.ts";

const PORT = config.port;

const startServer = async () => {
	try {
		await prisma.$connect();
		await prisma.$queryRaw`SELECT 1`;
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