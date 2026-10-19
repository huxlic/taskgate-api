import type {NextFunction, Request, Response} from "express"
import {cooldownKey} from "../utils/redis-helpers.js";
import {redis} from "../../infrastructure/cache/redis-client.js";
import * as UserService from "../../modules/user/user.service.js"

export const cooldown = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const email = req.body.email
		try {
			const user = await UserService.findByEmail(email)
			if (user.verifiedAt) {
				return res.status(400).json({
					status: "failed",
					message: "Already verified."
				})
			}
			
			const key = cooldownKey(email)
			const allowed = await redis.set(key, "1", {NX: true, EX: 60})
			
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
}