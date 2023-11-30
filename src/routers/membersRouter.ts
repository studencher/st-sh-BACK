import express from "express";
import {Constants} from "../studentcher-shared-utils";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import membersController from "../controllers/MembersController";
import authenticationService from "../services/AuthenticationService";
import authorizationService from "../services/AuthorizationService";
const router = express.Router()

router.post("/status",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, membersController.postMemberStatus);

router.get("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    membersController.getMemberLastTrack)

export default router;
