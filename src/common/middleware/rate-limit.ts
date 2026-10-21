import type {NextFunction, Request, Response} from "express";
import {redis} from "../../infrastructure/cache/redis-client.js";
import {rateLimitKey} from "../utils/redis-helpers.ts";

interface Options {
	prefix: string;
	identify: (req: Request) => string;
}

const SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('TTL', KEYS[1])
return { current, ttl }
`;

const LIMIT = 3;
const WINDOW_SECONDS = 600;

export const rateLimit = ({prefix, identify}: Options) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const id = identify(req);
		if (!id) return res.status(400).json({status: "failed", message: "Missing identifier"});
		
		const key = rateLimitKey(prefix, id);
		
		try {
			const [count, ttl] = (await redis.eval(SCRIPT, {
				keys: [key],
				arguments: [String(WINDOW_SECONDS)]
			})) as [number, number]
			
			if (count > LIMIT) {
				const wait = Math.max(ttl, 1);
				res.setHeader("Retry-After", String(wait));
				return res.status(429).json({
					status: "failed",
					message: `Too many requests. Try again in ${wait}s`,
				});
			}
		} catch (err) {
			console.error('Rate limiter failed:', err);
		}
		
		next();
	}
}