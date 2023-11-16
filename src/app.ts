import express, {Express} from "express";
import cors from "cors";

import {logFinishMiddleware, logReceivingMiddleware, errorsHandler, healthCheckMiddleware} from "./studentcher-shared-utils";

import appRoutersHandler from "./routers";
import logger from "./helpers/Logger";
const app: Express = express();

app.use(cors());
app.use(express.json());



app.use("/api", logFinishMiddleware(logger), logReceivingMiddleware(logger));

app.use("/api/v1", appRoutersHandler)

app.use("/", healthCheckMiddleware);

app.use(errorsHandler(logger));

export default app;
