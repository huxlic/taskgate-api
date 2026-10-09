import express, {type Router} from "express";
import {createUser, login} from "./auth.controller.ts";
import {validate} from "../../common/middleware/validate.ts";
import {loginSchema, registerSchema} from "./auth.dto.ts";

const router: Router = express.Router();

router.post("/auth/register", validate(registerSchema), createUser)
router.post("/auth/login", validate(loginSchema), login)

export default router;