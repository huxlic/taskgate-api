import express, {type Express, type Request, type Response} from 'express';
import {errorHandler, notFoundHandler} from "./common/middleware/error-handler.ts";

const app: Express = express()

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({status: "OK"});
});

app.use(notFoundHandler)
app.use(errorHandler)

export default app;