"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const url_1 = __importDefault(require("url"));
const express_1 = __importDefault(require("express"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const addCommittedUserId_1 = require("../middlewares/addCommittedUserId");
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.use("/", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(studentcher_shared_utils_1.Constants.permissions.liveSubscription), addCommittedUserId_1.addCommittedUserId, (0, express_http_proxy_1.default)(process.env.INTERVIEWER_API_ADDRESS, {
    proxyReqPathResolver: function (req, _res) {
        return '/api' + url_1.default.parse(req.url).path;
    }
}));
exports.default = router;
//# sourceMappingURL=interviewerRouter.js.map