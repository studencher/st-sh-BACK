"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CloudController_1 = __importDefault(require("../controllers/CloudController"));
const AuthorizationService_1 = __importDefault(require("../services/AuthorizationService"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const router = express_1.default.Router();
router.post("/presigned-url", AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), CloudController_1.default.postPreSignedUrl);
router.post('/upload', AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), CloudController_1.default.postUploadFile);
router.get('/bucket-folders', AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), CloudController_1.default.getBucketFolders);
router.post('/bucket-folder', AuthenticationService_1.default.verify, AuthorizationService_1.default.verifyUserPermission(Constants_1.Constants.permissions.activityManagementEnabled), CloudController_1.default.postBucketFolder);
exports.default = router;
//# sourceMappingURL=cloudRouter.js.map