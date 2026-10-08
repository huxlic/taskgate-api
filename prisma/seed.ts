import {prisma} from "../src/infrastructure/database/prisma";

async function main() {
	const user = await prisma.user.upsert({
		where: {
			email: "johndoe@gmail.com"
		},
		update: {
			firstName: "Johnny",
			lastName: "Doe"
		},
		create: {
			id: "gfydywqysqywsgws7gy32t7e23te2e",
			email: "johndoe@gmail.com",
			firstName: "John",
			lastName: "Doe",
			passwordHash: "$2b$10$7Q1J8Z1Z1Z1Z1Z1Z1Z1Z1OeW5eW5eW5eW5eW5eW5eW5eW5eW5eW5e",
		}
	});
	console.log("Created user:", user);
}
main()
