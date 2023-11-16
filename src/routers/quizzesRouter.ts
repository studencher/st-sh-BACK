import express  from "express";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import authorizationService from "../services/AuthorizationService";
import quizzesController from "../controllers/QuizzesController";
import authenticationService from "../services/AuthenticationService";

const router = express.Router();

router.get("/",  authenticationService.verify,  quizzesController.getQuizzes);

router.get("/:id", authenticationService.verify, quizzesController.getQuiz);

router.post("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.quizzesManagementEnabled), userActivityTracker,
    quizzesController.addQuiz);

router.patch("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.quizzesManagementEnabled), userActivityTracker,
    quizzesController.editQuiz);

router.delete("/", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.quizzesManagementEnabled), userActivityTracker,
    quizzesController.deleteQuizzes);

router.get("/questions/types", authenticationService.verify,  quizzesController.getQuizQuestionsTypes);

router.post("/:id/start-trial",  authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), quizzesController.startUserQuiz);

router.post("/:id/trials/:trialId/end", authenticationService.verify, authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), quizzesController.endUserQuiz);

router.get("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), quizzesController.getOptionalQuizzes);


export default router;
