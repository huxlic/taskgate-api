export interface MailInput {
	to: string;
	subject: string;
	html: string;
	text: string;
}

export interface SendVerificationEmailInput {
	to: string;
	name: string;
	otp: string;
	expiresInMinutes: number;
	currentYear?: number;
}