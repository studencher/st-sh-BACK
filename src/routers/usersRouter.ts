import express from "express";

import {Constants} from "../studentcher-shared-utils";

import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import authorizationService from "../services/AuthorizationService";
import usersController from "../controllers/UsersController";
import authenticationService from "../services/AuthenticationService";

const router = express.Router();

router.get("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.userManagement), usersController.getUsers);

router.post("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.userManagement), usersController.addUser);

router.patch("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.userManagement),
    authorizationService.verifyAccessToRole(),  userActivityTracker, usersController.editUser);


router.delete("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.userManagement),
    userActivityTracker, usersController.deleteUsers);

router.post("/activities",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.activityTrackingEnabled),
    userActivityTracker, authorizationService.verifyAccessToRole(),  usersController.addUserActivity);

router.get('/cloud/usage',  authenticationService.verify, usersController.getUsersCloudUsage)


router.get("/personal-zone",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    usersController.getUserPersonalZone);

router.post("/activities/videos",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
   userActivityTracker,  usersController.postUserActivityVideoStatus);

   router.get("/fetchAllUsersOnInit",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
   usersController.getUserLastDiscordTrack  );
export default router;
