import express from "express";
import {Constants} from "../studentcher-shared-utils";
import channelsController from "../controllers/ChannelsController";
import authenticationService from "../services/AuthenticationService";
import authorizationService from "../services/AuthorizationService";

const router = express.Router()



router.post("/member",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), channelsController.moveMembers);

router.post("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), channelsController.postChannel);

router.get("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), channelsController.getChannels);


export default router;
