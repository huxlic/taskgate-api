import type {NextFunction, Request, Response} from "express"
import {cooldownKey} from "../utils/redis-helpers.js";
import {redis} from "../../infrastructure/cache/redis-client.js";

export const cooldown = async (req: Request, res: Response, next: NextFunction) => {
	const email = req.body.email;
	
	try {
		const key = cooldownKey("otp", email)
		const allowed = await redis.set(key, "1", {EX: 60, condition: "NX"})
		
		if (!allowed) {
			const wait = Math.max(await redis.ttl(key), 1);
			
			res.setHeader("Retry-After", String(wait))
			return res.status(429).json({
				status: "failed",
				message: `Please wait ${wait}s before requesting another code`
			});
		}
	} catch (err) {
		console.error("Cooldown failed:", err);
	}
	next()
}