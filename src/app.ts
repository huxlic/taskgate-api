import express, {type Express, type Request, type Response} from 'express';
import {errorHandler, notFoundHandler} from "./common/middleware/error-handler.js";
// import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.ts";

const app: Express = express()

app.use(express.json());

// app.use(userRoutes)
app.use(authRoutes)

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({status: "OK"});
});

app.use(notFoundHandler)
app.use(errorHandler)

export default app;