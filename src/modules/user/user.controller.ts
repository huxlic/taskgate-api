import type {NextFunction, Request, Response} from "express";
import * as UserService from "./user.service.js";
import {toPublicUser} from "./user.mapper.js";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.user?.id;
		const user = await UserService.findUnique(id);
		
		res.status(200).json({
			status: "success",
			message: "User found!",
			data: toPublicUser(user)
		})
	} catch (err) {
		next(err)
	}
}

export const getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.user?.id;
		const user = await UserService.findUnique(id);
		
		res.status(200).json({
			status: "success",
			message: "Tasks found!",
			// data: user.tasks
		})
	} catch (err) {
		next(err)
	}
}