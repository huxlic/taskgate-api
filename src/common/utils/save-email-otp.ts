import {client} from "../../infrastructure/cache/redis-client.js";

export const saveEmailOtp = async (email: string, otp: string): Promise<string | null> => {
	return await client.set(`email:otp:${email}`, otp, {
		EX: 60 * 5
	});
}