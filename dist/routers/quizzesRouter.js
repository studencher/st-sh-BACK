"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const QuizzesController_1 = __importDefault(require("../controllers/QuizzesController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.get("/", AuthenticationService_1.default.verify, QuizzesController_1.default.getQuizzes);
router.get("/:id", AuthenticationService_1.default.verify, QuizzesController_1.default.getQuiz);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.quizzesManagementEnabled), PostgresAdapter_1.userActivityTracker, QuizzesController_1.default.addQuiz);
router.patch("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.quizzesManagementEnabled), PostgresAdapter_1.userActivityTracker, QuizzesController_1.default.editQuiz);
router.delete("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.quizzesManagementEnabled), PostgresAdapter_1.userActivityTracker, QuizzesController_1.default.deleteQuizzes);
router.get("/questions/types", AuthenticationService_1.default.verify, QuizzesController_1.default.getQuizQuestionsTypes);
router.post("/:id/start-trial", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), QuizzesController_1.default.startUserQuiz);
router.post("/:id/trials/:trialId/end", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), QuizzesController_1.default.endUserQuiz);
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), QuizzesController_1.default.getOptionalQuizzes);
exports.default = router;
//# sourceMappingURL=quizzesRouter.js.map