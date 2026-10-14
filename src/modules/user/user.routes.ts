import express, {type Router} from "express";
import {authGuard} from "../../common/middleware/auth-guard.js";
import {getUser, getUserTasks} from "./user.controller.js";

const router: Router = express.Router();

router.get("/me", authGuard, getUser);
router.get("/me/tasks", authGuard, getUserTasks);

export default router;