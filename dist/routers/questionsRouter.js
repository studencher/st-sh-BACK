"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const QuestionsController_1 = __importDefault(require("../controllers/QuestionsController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const router = express_1.default.Router();
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), QuestionsController_1.default.getQuestions);
router.get("/:id", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), QuestionsController_1.default.getQuestion);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.postQuestion);
router.patch("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.patchQuestion);
router.delete("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.deleteQuestion);
router.post("/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.postQuestionComment);
router.patch("/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.patchQuestionComment);
router.delete("/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.deleteQuestionComments);
router.post("/answers/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.postAnswer);
router.patch("/answers/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.patchAnswer);
router.delete("/answers/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.deleteAnswers);
router.post("/answers/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.postAnswerComment);
router.patch("/answers/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.patchAnswerComment);
router.delete("/answers/comments/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, QuestionsController_1.default.deleteAnswerComments);
exports.default = router;
//# sourceMappingURL=questionsRouter.js.map