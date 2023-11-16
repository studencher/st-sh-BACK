"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const ChannelsController_1 = __importDefault(require("../controllers/ChannelsController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const router = express_1.default.Router();
router.post("/member", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), ChannelsController_1.default.moveMembers);
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), ChannelsController_1.default.postChannel);
router.get("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.appPanelEnabled), ChannelsController_1.default.getChannels);
exports.default = router;
//# sourceMappingURL=channelsRouter.js.map