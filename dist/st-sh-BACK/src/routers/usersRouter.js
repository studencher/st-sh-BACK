"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const UsersController_1 = __importDefault(require("../controllers/UsersController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.userManagement), UsersController_1.default.getUsers);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.userManagement), UsersController_1.default.addUser);
router.patch("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.userManagement), AuthorizationService_1.default.verifyAccessToRole(), PostgresAdapter_1.userActivityTracker, UsersController_1.default.editUser);
router.delete("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.userManagement), PostgresAdapter_1.userActivityTracker, UsersController_1.default.deleteUsers);
router.post("/activities", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.activityTrackingEnabled), PostgresAdapter_1.userActivityTracker, AuthorizationService_1.default.verifyAccessToRole(), UsersController_1.default.addUserActivity);
router.get('/cloud/usage', AuthenticationService_1.default.verify, UsersController_1.default.getUsersCloudUsage);
router.get("/personal-zone", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), UsersController_1.default.getUserPersonalZone);
router.post("/activities/videos", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, UsersController_1.default.postUserActivityVideoStatus);
router.get("/fetchAllUsersOnInit", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), UsersController_1.default.getUserLastDiscordTrack);
exports.default = router;
//# sourceMappingURL=usersRouter.js.map