"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const StudyPlansController_1 = __importDefault(require("../controllers/StudyPlansController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.studyPlanManagement), StudyPlansController_1.default.getStudyPlans);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.studyPlanManagement), PostgresAdapter_1.userActivityTracker, StudyPlansController_1.default.addStudyPlan);
router.patch("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.studyPlanManagement), PostgresAdapter_1.userActivityTracker, StudyPlansController_1.default.editStudyPlan);
router.delete("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.studyPlanManagement), PostgresAdapter_1.userActivityTracker, StudyPlansController_1.default.deleteStudyPlans);
router.post("/users", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.studyPlanManagement), PostgresAdapter_1.userActivityTracker, StudyPlansController_1.default.setUsers);
exports.default = router;
//# sourceMappingURL=studyPlanRouter.js.map