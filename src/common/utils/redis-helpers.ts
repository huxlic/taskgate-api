export const genEmailOtpKey = (email: string): string => {
	return `otp:login:${email}`
}

export const cooldownKey = (email: string): string => {
	return `otp:cooldown:login:${email}`
}