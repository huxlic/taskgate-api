export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	passwordHash: string;
	verifiedAt: Date | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}