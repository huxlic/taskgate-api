import type {NextFunction, Request, Response} from "express";
import * as UserService from "./user.service.js";
import {toPublicUser} from "./user.mapper.ts";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {password, ...rest} = req.body;
		const user = await UserService.create(rest, password);
		
		res.status(201).json({
			status: "success",
			message: "User created successfully",
			data: toPublicUser(user)
		});
	} catch (err) {
		next(err)
	}
}