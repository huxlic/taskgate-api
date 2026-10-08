import type {NextFunction, Request, Response} from "express";
import {AppError} from "../errors/app-error.ts";
import {ZodError} from "zod";

export const notFoundHandler = () => {
	throw new AppError("Seems you got lost", 404);
}

export const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) return next(err);
	
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			status: "failed",
			message: err.message,
		})
	}
	
	console.error(err);
	res.status(500).json({
		status: "failed",
		message: "Something went wrong",
	})
}