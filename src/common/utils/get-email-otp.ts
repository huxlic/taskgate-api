import {client} from "../../infrastructure/cache/redis-client.js";

export const getEmailOtp = async (email: string): Promise<string | null> => {
	return await client.get(`email:otp:${email}`)
}