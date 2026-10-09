import type {NextFunction, Request, Response} from "express";
import * as UserService from "../user/user.service.js"
import {toPublicUser} from "../user/user.mapper.js";
import * as AuthService from "../auth/auth.service.js";
import {trim} from "../../common/utils/trim.ts";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {password, ...rest} = trim(req.body);
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
	try {
		const {email, password} = trim(req.body);
		const user = await AuthService.login(email, password);
		
		res.status(200).json({
			status: "success",
			message: "User logged in successfully",
			data: toPublicUser(user)
		});
		
	} catch (err) {
		next(err);
	}
}