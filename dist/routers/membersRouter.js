"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const MembersController_1 = __importDefault(require("../controllers/MembersController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const router = express_1.default.Router();
router.post("/status", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, MembersController_1.default.postMemberStatus);
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), MembersController_1.default.getMemberLastTrack);
exports.default = router;
//# sourceMappingURL=membersRouter.js.map