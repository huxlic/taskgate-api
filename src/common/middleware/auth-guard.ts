import type {NextFunction, Request, Response} from "express";
import {AppError} from "../errors/app-error.ts";
import jwt from "jsonwebtoken";
import {config} from "../../config/index.ts";

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new AppError("Authorization header is required", 401);
	
	const token = authHeader.split(" ")[1];
	if (!token) throw new AppError("Authorization token is required", 401);
	
	try {
		const payload = jwt.verify(token, config.jwt.secret)
		if (typeof payload !== "object") throw new AppError("Invalid authorization token", 401);
		
		const id = payload.id;
		if (!id) throw new AppError("Invalid authorization token", 401);
		
		req.user = id;
		next()
		
	} catch (err: any) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new AppError("Session has expired", 401);
		}
		throw new AppError("Authorization token is required", 401);
	}
}