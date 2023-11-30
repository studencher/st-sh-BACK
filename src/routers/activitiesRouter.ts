import express from "express";
import authorizationService from "../services/AuthorizationService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import activitiesController from "../controllers/ActivitiesController";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import authenticationService from "../services/AuthenticationService";

const router = express.Router();


router.get("/", authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled), activitiesController.getActivities);


router.post("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled),
    userActivityTracker, activitiesController.addActivity);

router.patch("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled),
    userActivityTracker, activitiesController.editActivity);

router.delete("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.activityManagementEnabled),
    userActivityTracker, activitiesController.deleteActivities);


router.post("/meta-data", authenticationService.verify, activitiesController.postVideoMetaData);

export default router;
