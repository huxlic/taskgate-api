import type {Request, Response, NextFunction} from "express";
import * as UserService from "../user/user.service.ts"
import {toPublicUser} from "../user/user.mapper.ts";

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

export const login = async (req: Request, res: Response, next: NextFunction) => {

}