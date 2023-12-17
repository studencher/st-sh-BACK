import {Router} from "express";
import registrationRouter  from "./registrationRouter";
// import webAppRouter from "./webAppRouter";
// import dashboardRouter from "./dashboardRouter";
import interviewerRouter from './interviewerRouter';
import usersRouter from "./usersRouter";
import studyPlanRouter from "./studyPlanRouter";
import activitiesRouter from "./activitiesRouter";
import quizzesRouter from "./quizzesRouter";
import channelsRouter from "./channelsRouter";
import membersRouter from "./membersRouter";
import questionsRouter from "./questionsRouter";
import cloudRouter from "./cloudRouter";
import meetingsRouter from "./meetingsRouter";
//import crawlersRouter from "./crawlersRouter";
// import fs from "fs";
// import logger from "../utils/Logger";
// import dotNetProjectTestsService from "../services/DotNetProjectTestsService";
// import {ChessTestsService} from "../services/ChessTestsService";
// import path from "path";
// import os from "os";

const routers = Router()

routers.use(registrationRouter);
// routers.use("/app", webAppRouter);
// routers.use("/dashboard", dashboardRouter);
routers.use('/interviewer', interviewerRouter);

routers.use("/users", usersRouter);
routers.use("/plans", studyPlanRouter);
routers.use("/activities", activitiesRouter);
routers.use("/quizzes", quizzesRouter);
routers.use("/channels", channelsRouter);
routers.use("/members", membersRouter);
routers.use("/meetings", meetingsRouter);
routers.use("/questions", questionsRouter);
routers.use("/cloud", cloudRouter);
//routers.use("/social-media-crawler", crawlersRouter);


export default routers;




