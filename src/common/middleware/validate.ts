import type {ZodType} from "zod";
import type {NextFunction, Request, Response} from "express";
import {AppError} from "../errors/app-error.js";

export const validate = (schema: ZodType) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		
		if (!result.success) {
			const message = result.error.issues.map(issue => issue.message).join(", ");
			throw new AppError(message, 400)
		}
		
		req.body = result.data;
		next();
	}
}