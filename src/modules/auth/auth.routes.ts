import express, {type Router} from "express";
import {createUser, login, requestOtp, verifyEmail} from "./auth.controller.js";
import {validate} from "../../common/middleware/validate.js";
import {loginSchema, registerSchema, requestOtpSchema, verifyEmailSchema} from "./auth.dto.js";
import {cooldown} from "../../common/middleware/cooldown.ts";
import {verifyAccess} from "../../common/middleware/verify-access.ts";
import {rateLimit} from "../../common/middleware/rate-limit.ts";
import {byEmail} from "../../common/utils/redis-helpers.ts";

const router: Router = express.Router();

router.post("/auth/register", validate(registerSchema), createUser)
router.post("/auth/login", validate(loginSchema), login)
router.post("/auth/request-otp", validate(requestOtpSchema), cooldown, rateLimit({
	prefix: 'otp-request-email',
	identify: byEmail
}), requestOtp)
router.post("/auth/verify-otp", validate(verifyEmailSchema), verifyAccess, verifyEmail)

export default router;