import express, {type Router} from "express";
import {createUser} from "./user.controller.ts";

const router: Router = express.Router();

router.post("/register", createUser);

export default router;