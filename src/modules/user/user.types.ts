export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	passwordHash: string;
	verifiedAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}