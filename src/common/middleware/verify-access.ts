import type {NextFunction, Request, Response} from "express";
import * as UserService from "../../modules/user/user.service.js";

export const verifyAccess = async (req: Request, res: Response, next: NextFunction) => {
	const email: string = req.body.email;
	
	try {
		const user = await UserService.findByEmailOrNull(email)
		if (user?.verifiedAt) {
			return res.status(400).json({
				status: "failed",
				message: "Already verified. You probably shouldn't be here, but..."
			})
		}
	} catch (err) {
		console.error("Unable to verify access", err)
	}
	next()
}