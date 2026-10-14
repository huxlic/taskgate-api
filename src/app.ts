import express, {type Express, type NextFunction, type Request, type Response} from 'express';
import {errorHandler, notFoundHandler} from "./common/middleware/error-handler.js";
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app: Express = express()

app.use(express.json());

app.use("/api/v1", userRoutes)
app.use("/api/v1", authRoutes)

app.get("/health", (_req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(200).json({status: "OK"});
	} catch (err) {
		next(err)
	}
});

app.use(notFoundHandler)
app.use(errorHandler)

export default app;