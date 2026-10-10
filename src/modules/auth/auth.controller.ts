import type {NextFunction, Request, Response} from "express";
import {toPublicUser} from "../user/user.mapper.js";
import * as AuthService from "../auth/auth.service.js";
import {trim} from "../../common/utils/trim.ts";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {password, ...rest} = trim(req.body);
		await AuthService.createUser(rest, password);
		
		res.status(201).json({
			status: "success",
			message: "OTP has been sent to your email for verification"
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

export const verifyEmail = async (req: Request<{email: string, otp: string}>, res: Response, next: NextFunction) => {
	try {
		const {email, otp} = req.params;
		
		await AuthService.verifyEmail(email, otp)
		
		res.status(200).json({
			status: "success",
			message: "Email has been verified. Proceed to login",
		})
		
	} catch (err) {
		next(err);
	}
}