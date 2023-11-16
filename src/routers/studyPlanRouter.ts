import express from "express";

import {Constants} from "../studentcher-shared-utils";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import authorizationService from "../services/AuthorizationService";
import studyPlansController from "../controllers/StudyPlansController";
import authenticationService from "../services/AuthenticationService";

const router = express.Router();

router.get("/",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.studyPlanManagement), studyPlansController.getStudyPlans);

router.post("/", authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.studyPlanManagement),
    userActivityTracker, studyPlansController.addStudyPlan);

router.patch("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.studyPlanManagement),
    userActivityTracker, studyPlansController.editStudyPlan);

router.delete("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.studyPlanManagement),
    userActivityTracker, studyPlansController.deleteStudyPlans);

router.post("/users", authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.studyPlanManagement),
    userActivityTracker, studyPlansController.setUsers);

export default router;
