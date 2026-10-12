import express, {type Router} from "express";
import {createUser, login, requestOtp, verifyEmail} from "./auth.controller.js";
import {validate} from "../../common/middleware/validate.js";
import {loginSchema, registerSchema} from "./auth.dto.js";

const router: Router = express.Router();

router.post("/api/v1/auth/register", validate(registerSchema), createUser)
router.post("/api/v1/auth/login", validate(loginSchema), login)
router.get("/api/v1/auth/verify-otp/:email/:otp", verifyEmail)
router.get("/api/v1/auth/request-otp/:email", requestOtp)

export default router;