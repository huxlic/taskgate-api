import express, {type Router} from "express";
import {createUser, login, requestOtp, verifyEmail} from "./auth.controller.js";
import {validate} from "../../common/middleware/validate.js";
import {loginSchema, registerSchema} from "./auth.dto.js";
import {cooldown} from "../../common/middleware/cooldown.ts";

const router: Router = express.Router();

router.post("/auth/register", validate(registerSchema), createUser)
router.post("/auth/login", validate(loginSchema), login)
router.get("/auth/verify-otp/:email/:otp", verifyEmail)
router.get("/auth/request-otp/:email", cooldown, requestOtp)

export default router;