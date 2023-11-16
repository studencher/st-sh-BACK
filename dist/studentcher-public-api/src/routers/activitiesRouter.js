"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const ActivitiesController_1 = __importDefault(require("../controllers/ActivitiesController"));
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), ActivitiesController_1.default.getActivities);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), PostgresAdapter_1.userActivityTracker, ActivitiesController_1.default.addActivity);
router.patch("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), PostgresAdapter_1.userActivityTracker, ActivitiesController_1.default.editActivity);
router.delete("/", AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), PostgresAdapter_1.userActivityTracker, ActivitiesController_1.default.deleteActivities);
router.post("/meta-data", AuthenticationService_1.default.verify, ActivitiesController_1.default.postVideoMetaData);
exports.default = router;
//# sourceMappingURL=activitiesRouter.js.map