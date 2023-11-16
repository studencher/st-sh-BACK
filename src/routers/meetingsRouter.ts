import express from "express";
import {discordBotHealthCheck} from "../middlewares/discordBotHealthCheck";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import meetingsController from "../controllers/MeetingsController";
import authenticationService from "../services/AuthenticationService";
import authorizationService from "../services/AuthorizationService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";

const router = express.Router()

router.post("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), discordBotHealthCheck, userActivityTracker, meetingsController.addMeeting);

router.post("/end",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), discordBotHealthCheck, userActivityTracker, meetingsController.getUsersTracking, meetingsController.endMeeting);

router.get("/users", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),  meetingsController.getUserMeetings);

router.patch("/users",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), userActivityTracker, meetingsController.editUserMeetings)

export default router;
