import express, {type Router} from "express";
import {authGuard} from "../../common/middleware/auth-guard.js";
import {getUser, getUserTasks} from "./user.controller.js";

const router: Router = express.Router();

router.get("/api/v1/me", authGuard, getUser);
router.get("/api/v1/me/tasks", authGuard, getUserTasks);

export default router;