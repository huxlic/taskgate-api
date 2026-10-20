import type {Request} from "express"

export const emailOtpKey = (email: string) => `otp:login:${email}`;
export const cooldownKey = (prefix: string, email: string) => `cooldown:${prefix}:${email}`;
export const rateLimitKey = (prefix: string, id: string) => `ratelimit:${prefix}:${id}`;

export const byEmail = (req: Request) => req.body.email;
export const byIp = (req: Request) => req.ip ?? "unknown";