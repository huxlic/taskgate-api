export const genEmailOtpKey = (email: string): string => {
	return `otp:login:${email}`
}