import type {NextFunction, Request, Response} from "express";
import * as UserService from "../../modules/user/user.service.js";

export const verifyAccess = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const email: string = req.body.email;
		
		try {
			const user = await UserService.findByEmailDontThrow(email)
			if (user?.verifiedAt) {
				return res.status(400).json({
					status: "failed",
					message: "Already verified."
				})
			}
		} catch (err) {
			console.error("Unable to verify access", err)
		}
		next()
	}
}