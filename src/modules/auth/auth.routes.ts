import express, {type Router} from "express";
import {createUser} from "./auth.controller.ts";
import {validate} from "../../common/middleware/validate.ts";
import {registerSchema} from "./auth.dto.ts";

const router: Router = express.Router();

router.post("/auth/register", validate(registerSchema), createUser)

export default router;