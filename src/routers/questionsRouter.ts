import express  from "express";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import questionsController from "../controllers/QuestionsController";
import authenticationService from "../services/AuthenticationService";
import authorizationService from "../services/AuthorizationService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";

const router = express.Router()

router.get("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled), questionsController.getQuestions);

router.get("/:id", authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),  questionsController.getQuestion);

router.post("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker,  questionsController.postQuestion);


router.patch("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.patchQuestion);


router.delete("/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.deleteQuestion);

router.post("/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.postQuestionComment);

router.patch("/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.patchQuestionComment);

router.delete("/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.deleteQuestionComments)

router.post("/answers/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.postAnswer);

router.patch("/answers/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.patchAnswer);

router.delete("/answers/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.deleteAnswers);

router.post("/answers/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.postAnswerComment);

router.patch("/answers/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.patchAnswerComment);

router.delete("/answers/comments/",  authenticationService.verify,  authorizationService.verifyUserPermission(Constants.permissions.appPanelEnabled),
    userActivityTracker, questionsController.deleteAnswerComments);

export default router;

