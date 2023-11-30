"use strict";
// import express from "express";
// import cors from "cors";
//
// import {logFinishMiddleware, logReceivingMiddleware} from "./middlewares/loggerHandler";
// import {errorsHandler} from "./middlewares/errorHandler";
// import {healthCheckMiddleware} from "./middlewares/healthCheckHandler";
// const port = process.env.PORT
//
//
//
// const botRouter = require("./routers/botRouter");
// const userRouter = require("./routers/userRouter");
// const registrationRouter = require("./routers/registerationRouter");
// const activityRouter = require("./routers/activityRouter");
// const studyPlanRouter = require("./routers/studyPlanRouter");
// const roleRouter = require("./routers/roleRouter");
//
// export const app = express();
// app.use(cors());
// app.use(express.json());
//
// app.use("/", logFinishMiddleware, logReceivingMiddleware);
//
// app.use("/api/v1/bot", botRouter);
// app.use("/api/v1", registrationRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/activities", activityRouter);
// app.use("/api/v1/plans", studyPlanRouter);
// app.use("/api/v1/roles", roleRouter);
//
//
// app.use("/", healthCheckMiddleware);
// app.use(errorsHandler);
//
//
// app.listen(port, async () => {
//     // await connectDb()
//     console.log('Server connected, port:', port)
// })
// import express from "express";
// import cors from "cors";
//
// import {logFinishMiddleware, logReceivingMiddleware} from "./middlewares/loggerHandler";
// import {errorsHandler} from "./middlewares/errorHandler";
// import {healthCheckMiddleware} from "./middlewares/healthCheckHandler";
// const port = process.env.PORT
//
//
//
// const botRouter = require("./routers/botRouter");
// const userRouter = require("./routers/userRouter");
// const registrationRouter = require("./routers/registerationRouter");
// const activityRouter = require("./routers/activityRouter");
// const studyPlanRouter = require("./routers/studyPlanRouter");
// const roleRouter = require("./routers/roleRouter");
//
// export const app = express();
// app.use(cors());
// app.use(express.json());
//
// app.use("/", logFinishMiddleware, logReceivingMiddleware);
//
// app.use("/api/v1/bot", botRouter);
// app.use("/api/v1", registrationRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/activities", activityRouter);
// app.use("/api/v1/plans", studyPlanRouter);
// app.use("/api/v1/roles", roleRouter);
//
//
// app.use("/", healthCheckMiddleware);
// app.use(errorsHandler);
//
//
// app.listen(port, async () => {
//     // await connectDb()
//     console.log('Server connected, port:', port)
// })
//
