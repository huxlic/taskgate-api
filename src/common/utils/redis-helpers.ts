import {client} from "../../infrastructure/cache/redis-client.js";

export const saveEmailOtp = async (email: string, otp: string): Promise<string | null> => {
	return await client.set(`otp:email:${email}`, otp, {
		EX: 60 * 5
	});
}

export const getEmailOtp = async (email: string): Promise<string | null> => {
	return await client.get(`otp:email:${email}`)
}

export const deleteEmailOtp = async (email: string): Promise<number> => {
	return client.del(`otp:email:${email}`)
}

export const setRateLimit = async (email: string) => {
	return client.set(`ratelimit:otp:email:${email}`, 0);
}

export const getRateLimit = async (email: string) => {
	return client.get(`ratelimit:otp:email:${email}`)
}

export const incrRateLimit = async (email: string) => {
	return client.incr(`ratelimit:otp:email:${email}`)
}