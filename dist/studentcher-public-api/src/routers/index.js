"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationRouter_1 = __importDefault(require("./registrationRouter"));
// import webAppRouter from "./webAppRouter";
// import dashboardRouter from "./dashboardRouter";
// import interviewerRouter from './interviewerRouter';
const usersRouter_1 = __importDefault(require("./usersRouter"));
const studyPlanRouter_1 = __importDefault(require("./studyPlanRouter"));
const activitiesRouter_1 = __importDefault(require("./activitiesRouter"));
const quizzesRouter_1 = __importDefault(require("./quizzesRouter"));
const routers = (0, express_1.Router)();
routers.use(registrationRouter_1.default);
// routers.use("/app", webAppRouter);
// routers.use("/dashboard", dashboardRouter);
// routers.use('/interviewer', interviewerRouter);
routers.use("/users", usersRouter_1.default);
routers.use("/plans", studyPlanRouter_1.default);
routers.use("/activities", activitiesRouter_1.default);
routers.use("/quizzes", quizzesRouter_1.default);
exports.default = routers;
//# sourceMappingURL=index.js.map