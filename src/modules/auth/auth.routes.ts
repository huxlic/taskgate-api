import express, {type Router} from "express";
import {createUser, login, verifyOtp} from "./auth.controller.ts";
import {validate} from "../../common/middleware/validate.ts";
import {loginSchema, registerSchema} from "./auth.dto.ts";

const router: Router = express.Router();

router.post("/auth/register", validate(registerSchema), createUser)
router.post("/auth/login", validate(loginSchema), login)
router.get("/auth/verify-otp/:email/:otp", verifyOtp)

export default router;