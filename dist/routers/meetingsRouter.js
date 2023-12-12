"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discordBotHealthCheck_1 = require("../middlewares/discordBotHealthCheck");
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const MeetingsController_1 = __importDefault(require("../controllers/MeetingsController"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const router = express_1.default.Router();
router.post("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), discordBotHealthCheck_1.discordBotHealthCheck, PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.addMeeting);
router.post("/end", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), discordBotHealthCheck_1.discordBotHealthCheck, PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.getUsersTracking, MeetingsController_1.default.endMeeting);
router.get("/users", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), MeetingsController_1.default.getUserMeetings);
router.patch("/users", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.editUserMeetings);
router.post("/supervisorEnteringMeeting", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), discordBotHealthCheck_1.discordBotHealthCheck, PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.supervisorEnteringMeeting);
router.post("/sendChannelCreationMessagetoChat", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), discordBotHealthCheck_1.discordBotHealthCheck, PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.sendChannelCreationMessagetoChat);
router.post("/disconnectUserFromDiscord", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), MeetingsController_1.default.disconnectUserFromDiscord);
router.post("/getMeetingId", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.appPanelEnabled), discordBotHealthCheck_1.discordBotHealthCheck, PostgresAdapter_1.userActivityTracker, MeetingsController_1.default.getMeetingId);
exports.default = router;
//# sourceMappingURL=meetingsRouter.js.map